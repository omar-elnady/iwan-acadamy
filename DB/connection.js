import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connection = async () => {
    return mongoose.connect(process.env.MONGODB_URL).then(() => {
    // return mongoose.connect(`mongodb://127.0.0.1:27017/iwan`).then(() => {
        console.log("Mongo Database Connected")
    }).catch((err) => console.log(err))
}
export default connection