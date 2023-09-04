import express from "express";
import mongoose from "mongoose";
import { APP_PORT, DB_URL } from "./config/index.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express()

mongoose.connect(DB_URL, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});

app.use(express.json())
app.use('/api',routes)
app.use(errorHandler)

app.listen(APP_PORT, ()=> console.log(`Server Started at PORT ${APP_PORT}`))