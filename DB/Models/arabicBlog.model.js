import { Schema, model, trusted } from "mongoose";

const arBlogSchema = new Schema({
    original_title: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        unique: false,
        required: true
    },
    overview: {
        type: String,
        unique: false,
        required: true
    },
    blog_content: {
        type: String,
        unique: false,
        required: false
    },
    poster_image: { secure_url: String, public_id: String },
    main_image: { secure_url: String, public_id: String },
    date: {
        type: String,
        unique: false,
        required: false
    }
}, { timestamps: true })

const arBlogModel = model('arabicBlog', arBlogSchema)
export default arBlogModel