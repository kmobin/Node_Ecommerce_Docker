import express from "express";
import { registerController } from "../controller/index.js";

const routes = express.Router()

routes.post('/register',registerController.register)


export default routes

