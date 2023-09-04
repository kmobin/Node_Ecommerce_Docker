class CustomeErrorHandler extends Error{
    constructor(status, message){
        super()
        this.status = status
        this.message = message
    }
    static alreadyExist(message){
        return new CustomeErrorHandler(402, message)
    }
}

export default CustomeErrorHandler