import { DEBUG_MODE } from "../config/index.js"
import pkg  from "joi"
import CustomeErrorHandler from "../services/CustomeErrorHandler.js"

const {ValidationError} = pkg

const errorHandler = (err, req, res, next) => {
    let statusCode = 500
    const data = {
        message : 'Internal Server Error',
        ...(DEBUG_MODE && { origialError : err.message})
    }

    if(err instanceof ValidationError){
        statusCode = 401
        data.message = err.message
    }
    if(err instanceof CustomeErrorHandler){
        statusCode = err.status
        data.message = err.message
    }

     return res.status(statusCode).json(data)   
}

export default errorHandler