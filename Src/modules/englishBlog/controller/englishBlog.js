import enBlogModel from "../../../../DB/Models/englishBlog.model.js";
import { asyncHandler } from "../../../../utils/errorHandling.js";

export const createBlog = asyncHandler(
    async (req, res, next) => {
        const {
            title,
            summary,
            content,
            date,
            mainImage,
            blogImage
        } = req.body
        const isExist = await enBlogModel.findOne({ title })
        if (isExist) {
            return next(new Error('title is already exist'))
        }
        if (!title || !summary || !content) {
            return next(new Error("please add all fields"))
        }
        if (!mainImage || !blogImage) {
            return next(new Error("please add all images"))
        }
        const blog = await enBlogModel.create({
            title,
            summary,
            content,
            date,
            mainImage,
            blogImage
        })
        return res.json({ message: 'Done' })
    }
)
export const getBlogs = asyncHandler(
    async (req, res, next) => {
        const blogs = await enBlogModel.find()
        return res.json({ message: "Done", blogs })
    }
)

export const updateBlog = asyncHandler(
    async (req, res, next) => {
        const { _id,
            summary,
            title,
            content,
            mainImage,
            blogImage
        } = req.body
        const isExist = await enBlogModel.findById(_id)
        if (!isExist) {
            return next(new Error('blog is not exist'))
        }
        const updateBlog = await enBlogModel.findByIdAndUpdate(_id, {
            summary,
            title,
            content,
            mainImage,
            blogImage
        })
        return res.json({ message: "Done" })
    })

export const deleteBlog = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params
        const deleteBlog = await enBlogModel.findByIdAndDelete(id)
        return res.json({ message: "Done", deleteBlog })
    }
)