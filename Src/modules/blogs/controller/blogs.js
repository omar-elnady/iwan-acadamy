import enBlogModel from "../../../../DB/Models/englishBlog.model.js";
import arBlogModel from "../../../../DB/Models/arabicBlog.model.js";
import { asyncHandler } from "../../../../utils/errorHandling.js";
import cloudinary from '../../../../utils/cloudinary.js'

export const createArabicBlog = asyncHandler(
    async (req, res, next) => {
        const {
            original_title,
            title,
            overview,
            blog_content,
            date
        } = req.body
        const isExist = await arBlogModel.findOne({ original_title })
        if (isExist) {
            return next(new Error('original_title is already exist'))
        }
        if (!title || !overview || !blog_content || !original_title) {
            return next(new Error("please add all fields"))
        }
        if (req.files.length < 2) {
            return res.json({ message: 'Please add images' })
        }
        let poster_image = {}
        let main_image = {};
        for (let i = 0; i < req.files.length; i++) {
            const element = req.files[i];
            const { secure_url, public_id } = await cloudinary.uploader.upload(element.path, { folder: `blogs` })
            if (i == 0) {
                main_image = { secure_url, public_id }
            }
            if (i == 1) {
                poster_image = { secure_url, public_id }
            }
        }
        const blog = await arBlogModel.create({
            original_title,
            title,
            overview,
            blog_content,
            date,
            poster_image,
            main_image
        })
        return res.json({ message: 'success' , files : req.files })
    }
)

export const createEnglishBlog = asyncHandler(
    async (req, res, next) => {
        const {
            original_title,
            title,
            overview,
            blog_content,
            date
        } = req.body

        const isExist = await enBlogModel.findOne({ original_title })
        if (isExist) {
            return next(new Error('original_title is already exist'))
        }
        if (!title || !overview || !blog_content || !original_title) {
            return next(new Error("please add all fields"))
        }
        if (req.files.length < 2) {
            return res.json({ message: 'please add images' })
        }
        let poster_image = {}
        let main_image = {};
        for (let i = 0; i < req.files.length; i++) {
            const element = req.files[i];
            const { secure_url, public_id } = await cloudinary.uploader.upload(element.path, { folder: `blogs` })
            if (i == 0) {
                main_image = { secure_url, public_id }
            }
            if (i == 1) {
                poster_image = { secure_url, public_id }
            }
        }
        const blog = await enBlogModel.create({
            original_title,
            title,
            overview,
            blog_content,
            date,
            poster_image,
            main_image
        })
        return res.json({ message: 'success' })
    }
)

export const getEnglishBlogs = asyncHandler(
    async (req, res, next) => {
        const blogs = await enBlogModel.find()
        return res.json({ message: "success", blogs })
    }
)
export const getArabicBlogs = asyncHandler(
    async (req, res, next) => {
        const blogs = await arBlogModel.find()
        return res.json({ message: "success", blogs })
    }
)

export const updateBlog = asyncHandler(
    async (req, res, next) => {
        const {
            _id,
            original_title,
            title,
            overview,
            blog_content,
        } = req.body
        const isEnglishBlogExist = await enBlogModel.findById(_id)
        const isArabicBlogExist = await arBlogModel.findById(_id)
        if (isEnglishBlogExist) {
            const updateEnglishBlog = await enBlogModel.findByIdAndUpdate(_id, {
                title,
                overview,
                blog_content,
            }, { new: true })
            return res.json({ message: "success" })

        }
        if (isArabicBlogExist) {
            const updateEnglishBlog = await arBlogModel.findByIdAndUpdate(_id, {
                title,
                overview,
                blog_content,
            }, { new: true })
            return res.json({ message: "success" })

        }

        return res.json({ message: "id is not exist" })
    })

export const deleteBlog = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.params
        const deleteEnglishBlog = await enBlogModel.findByIdAndDelete(_id)
        const deleteArabicBlog = await arBlogModel.findByIdAndDelete(_id)
        return res.json({ message: "success" })
    }
)

export const uploadImage = asyncHandler(
    async (req, res, next) => {
        return res.json({ message: "success", file: req.file })
    }
)
