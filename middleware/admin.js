import { User } from "../models/index.js"
import CustomeErrorHandler from "../services/CustomeErrorHandler.js"

const admin = async(req, res, next) => {
    try{
        const user = await User.findOne({_id: req.user._id})
  
        if(!user)
            return next(CustomeErrorHandler.userNotFound('User not found!'))

        if(user.role === 'admin')
            next()
        else
            return next(CustomeErrorHandler.unAuthorized('Unauthorized user'))    
    }catch(e){
        return next(e)
    }
}

export default admin
