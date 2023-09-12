import mongoose from "mongoose";
import { APP_URL } from "../config/index.js";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: String, required: true},
    image: {type: String, required: true, get: (image)=>{
        return `${APP_URL}/${image}`
    }},
    size: {type: String, required: true}
},{timestamps: true, toJSON: {getters: true}, id:false})

productSchema.plugin(mongoosePaginate);
export default mongoose.model('Products', productSchema, 'products') 
