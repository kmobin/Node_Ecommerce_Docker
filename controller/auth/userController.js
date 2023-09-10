import { User } from "../../models/index.js"
import CustomeErrorHandler from "../../services/CustomeErrorHandler.js"

const userController = {
    async me(req, res, next){

        try{

           const user = await User.findOne({_id: req.user._id}).select(' -password -updatedAt -createdAt -__v')
            if(!user)
                return next(CustomeErrorHandler.userNotFound('User not found'))
            
            res.json(user)    


        }catch(e){
            return next(e)
        }
    }
}

export default userController