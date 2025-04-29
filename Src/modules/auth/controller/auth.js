import userModel from "../../../../DB/Models/user.model.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { asyncHandler } from "../../../../utils/errorHandling.js"

const secretJWT = 'iwan-website-project-nodejs'

export const register = asyncHandler(
    async (req, res, next) => {
        const { userName,
            password,
            cPassword,
             } = req.body
        const isExist = await userModel.findOne({ userName })
        if (password != cPassword) {
            return next(new Error('cPassword not match password'))
        }
        if (isExist) {
            return next(new Error('userName is aleady exist'))
        }
        const hashPassword = bcrypt.hashSync(password, 8);
        const user = await userModel.create({
            userName,
            password: hashPassword,
        })
        return res.json({ message: 'Done' })
    })

export const login = asyncHandler(
    async (req, res, next) => {
        const { userName, password } = req.body
        const checkUser = await userModel.findOne({ userName })
        if (!checkUser) {
            return next(new Error("userName is not exist"))
        }
        const comparePassword = bcrypt.compareSync(password, checkUser.password)
        if (!comparePassword) {
            return next(new Error('userName or password not correct'))
        }
        const token = jwt.sign({  userName, id: checkUser._id }, secretJWT);
        res.json({ message: 'Done', token })
    }
)
