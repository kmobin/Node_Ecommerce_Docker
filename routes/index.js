import express from "express";
import { registerController, loginController } from "../controller/index.js";

const routes = express.Router()

routes.post('/register',registerController.register)
routes.post('/login',loginController.login)


export default routes

