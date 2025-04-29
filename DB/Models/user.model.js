import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        toLowerCase: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true })

const userModel = model('user', userSchema)
export default userModel