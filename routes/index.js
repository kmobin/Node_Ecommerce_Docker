import express from "express";
import userController from "../controller/auth/userController.js";
import { registerController, loginController, refreshController } from "../controller/index.js";
import auth from "../middleware/auth.js";

const routes = express.Router()

routes.post('/register',registerController.register)
routes.post('/login',loginController.login)
routes.get('/me',auth,userController.me)
routes.post('/refresh',refreshController.refresh)


export default routes

