import multer from "multer"
import { Products } from "../models/index.js"
import path from 'path'
import Joi from "joi"
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.random()*1E9}${path.extname(file.originalname)}`)
    }
})

const handleMultipartData = multer({storage, limits: {fileSize: 1000000 * 5}}).single('image') //5mb



const productController = {
    async store(req, res, next) {
        //multipart form data
        handleMultipartData(req, res, async(err)=>{
            if(err){
                return next(e)
            }
            console.log(req.file)
            const filePath = req.file.path 

            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required()
            })

            const { error } = productSchema.validate(req.body)
            if(error){
                fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err)
                        return next(err)
                })
                return next(error)
            }

            const { name , price, size } = req.body
            let document;
            try{

                document = await Products.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            
            }catch(e){
                return next(e)
            }

            res.status(201).json(document)
        })

    }
}

export default productController