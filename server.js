import express from "express";
import path  from "path";
import mongoose from "mongoose";
import { APP_PORT, DB_URL } from "./config/index.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import { fileURLToPath } from 'url';

const app = express()

mongoose.connect(DB_URL, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
global.appRoot = path.resolve(__dirname) // root dir path
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.get('/hello',(req,res)=>{
    res.json({message: 'Hello World'})
})
app.use('/api',routes)
app.use(errorHandler)

app.listen(APP_PORT, ()=> console.log(`Server Started at PORT ${APP_PORT}`))