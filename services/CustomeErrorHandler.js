class CustomeErrorHandler extends Error{
    constructor(status, message){
        super()
        this.status = status
        this.message = message
    }
    static alreadyExist(message){
        return new CustomeErrorHandler(402, message)
    }
    static userNotFound(message){
        return new CustomeErrorHandler(404, message)
    }
    static wrongCredential(message){
        return new CustomeErrorHandler(403,message)
    }
    static unAuthorized(message='Unauthorized'){
        return new CustomeErrorHandler(401,message)
    }
}

export default CustomeErrorHandler