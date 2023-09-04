import Joi from "joi"
import { User } from "../../models/index.js"
import CustomeErrorHandler from "../../services/CustomeErrorHandler.js"
import bcrypt from 'bcrypt'
import JwtService from "../../services/JwtService.js"

const registerController = {
    async register(req, res, next) {

          // CHECKLIST
        // [ ] validate the request
        // [ ] check if user is in the database already
        // [ ] prepare model
        // [ ] store in the db
        // [ ] generate jwt token
        // [ ] send response

       const registerSchema = Joi.object({
           name: Joi.string().min(3).max(30).required(),
           email: Joi.string().email().required(),
           password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
           repeat_password: Joi.ref('password')
       })
       try{
       const { error } = registerSchema.validate(req.body)
            if(error){
                return next(error)
            }
        
          let exist = await User.exists({email: req.body.email})  
             if(exist)
                return next(CustomeErrorHandler.alreadyExist('User already Exists!'))   

            const {name, email, password} = req.body

           const user = new User({
               name,
               email,
               password: await bcrypt.hash(password, 10)
           }) 
           const result = await user.save()

           const access_token = JwtService.sign({_id : result._id, role:result.role})

           res.json({access_token})

       }catch(e){
            return next(e)
       }
    }
}


export default registerController