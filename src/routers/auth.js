import { Router } from 'express';
import { registerController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerController))

export default authRouter;
