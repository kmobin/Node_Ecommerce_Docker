import multer from "multer"
import { Products } from "../models/index.js"
import path from 'path'
import Joi from "joi"
import fs from 'fs'
import CustomeErrorHandler from "../services/CustomeErrorHandler.js"
import productSchema from "../validator/product.js"

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
            if(!req.file)
                return next(CustomeErrorHandler.internalServer('Image Missing'))
            
            const filePath = req.file.path 

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

    },
    async update(req, res, next) {

        handleMultipartData(req, res, async(err)=>{
            if(err)
                return next(err)
            
            const {error} = await productSchema.validate(req.body)
            if(error){
                if(req.file){
                    fs.unlink(`${appRoot}/${req.file.path}`, (err)=>{
                        if(err)
                            return next(err)
                    })
                }
                return next(error)
            }

            const {name ,price, size} = req.body
            let document
            try{    
                document = await Products.findByIdAndUpdate({_id : req.params.id},
                    {
                        name,
                        price,
                        size,
                        ...(req.file && {image: req.file.path})
                    },{new: true})

            }catch(e){
                return next(e)
            }
            res.status(201).json(document)
        })

    },
    async destroy(req, res, next){
        let document
        try{
           document = await Products.findOneAndRemove({_id: req.params.id})
            
            if(!document)
                return next(CustomeErrorHandler.internalServer('Record not found!'))
            console.log(document._doc, document, document.image) // _doc give original document without getter execution
                
            fs.unlink(`${appRoot}/${document._doc.image}`,(err)=>{
                if(err)
                    return next(err)
            })

             

        }catch(e){
            return next(e)
        }
        res.status(201).json(document)   
    },
    async index(req, res, next){
        let documents;
        try{

            //Pagination mongoose.pagination
            // const options = {
            //     page: 1,
            //     limit: 2,
            //     collation: {
            //       locale: 'en',
            //     },
            //   };

                //    documents = await Products.paginate({}, options, (err, result) => result.docs)

            //Normal Way
            documents = await Products.find().select('-updatedAt -__v').sort({_id: -1});
        }catch(e){
            return next(e)
        }
        res.json(documents)
    },
    async show(req, res, next){
        let document;
        try{
            document = await Products.findOne({_id : req.params.id}).select('-updatedAt -__v')
        }catch(e){
            return next(e)
        }
        res.status(200).json(document)
    }
}

export default productController