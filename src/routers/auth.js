import { Router } from 'express';
import { loginController, registerController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerController))
authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginController))

export default authRouter;
