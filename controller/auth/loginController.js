import Joi from "joi"
import bcrypt from 'bcrypt'
import { User } from "../../models/index.js"
import CustomeErrorHandler from "../../services/CustomeErrorHandler.js"
import JwtService from "../../services/JwtService.js"
import { REFRESH_SECRET } from "../../config/index.js"
import refreshToken from "../../models/refreshToken.js"

const loginController = {
    async login(req, res, next) {


           const loginSchema = Joi.object({
               email: Joi.string().email().required(),
               password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
           }) 

          try{
            const {error} = loginSchema.validate(req.body)

            if(error)
                 return next(error)

            const user = await User.findOne({email : req.body.email })   
            if(!user)
                return next(CustomeErrorHandler.userNotFound('User not found!'))
            
            const match = await bcrypt.compare(req.body.password,user.password) 

            if(!match)
                return next(CustomeErrorHandler.wrongCredential('Username or password is wrong'))
             
            const access_token =  JwtService.sign({_id: user._id, role: user.role}) 
            const refresh_token = JwtService.sign({_id:user._id, role: user.role}, '1yr', REFRESH_SECRET)

            await refreshToken.create({token: refresh_token})
            
            res.json({access_token, refresh_token})
 
          } catch(e){
              return next(e)
          }


    }
}


export default loginController