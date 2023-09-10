import Joi from "joi"
import { REFRESH_SECRET } from "../../config/index.js"
import { RefreshToken, User } from "../../models/index.js"
import CustomeErrorHandler from "../../services/CustomeErrorHandler.js"
import JwtService from "../../services/JwtService.js"

const refreshController = {
    async refresh(req, res, next){


        const refreshTokenSchema = Joi.object({
            refresh_token : Joi.string().required()
        })

        try{
            const { error } = refreshTokenSchema.validate(req.body)
            if(error)
                return next(error)
             
        const refreshToken = await RefreshToken.findOne({token : req.body.refresh_token})   
        if(!refreshToken)
            return next(CustomeErrorHandler.unAuthorized('Invalid refresh token!'))
        
         const {_id, role} = await JwtService.verify(req.body.refresh_token, REFRESH_SECRET)    
         
         const user = await User.findOne({_id : _id})

         if(!user)
            return next(CustomeErrorHandler.userNotFound('User not found'))


        const access_token = await JwtService.sign({_id: user._id, role: user.role})
        
        const refresh_token = await JwtService.sign({_id: user._id, role: user.role},'1yr', REFRESH_SECRET)    

         await RefreshToken.create({token : refresh_token})
         
         res.json({access_token, refresh_token})

        }catch(e){
            return next(e)
        }

    }
}

export default refreshController