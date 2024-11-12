import createHttpError from 'http-errors';
import  register  from '../services/auth.js';



export const registerController = async (req,res) =>{
    const data = await register(req.body);

    res.status(201).json({
        status:201,
        message:"Successfully registred user"
    })
}
