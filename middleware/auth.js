import CustomeErrorHandler from "../services/CustomeErrorHandler.js"
import JwtService from "../services/JwtService.js"

const auth = async(req, res, next)=>{

        try{

            const authHeader = req.headers.authorization
            if(!authHeader)
                return next(CustomeErrorHandler.unAuthorized())

            const token = authHeader.split(' ')[1] 
            const {_id,role} = await JwtService.verify(token)
            req.user = {
                _id,
                role
            }
            next()

        }catch(e){
            return next(e)
        }
}

export default auth