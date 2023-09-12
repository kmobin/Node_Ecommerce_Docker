import express from "express";
import userController from "../controller/auth/userController.js";
import { registerController, loginController, refreshController, productController} from "../controller/index.js";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const routes = express.Router()

routes.post('/register',registerController.register)
routes.post('/login',loginController.login)
routes.get('/me',auth,userController.me)
routes.post('/refresh',refreshController.refresh)
routes.post('/logout',auth,loginController.logout)

routes.post('/products',[auth,admin], productController.store)
routes.put('/products/:id',[auth,admin], productController.update)
routes.delete('/products/:id',[auth, admin],productController.destroy)


export default routes

