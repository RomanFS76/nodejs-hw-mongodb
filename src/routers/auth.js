import { Router } from 'express';
import { loginController, registerController,refreshSessionController,logoutController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerController))
authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginController))

authRouter.post("/refresh", ctrlWrapper(refreshSessionController))

authRouter.post("/logout", ctrlWrapper(logoutController))


export default authRouter;
