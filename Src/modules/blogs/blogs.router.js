import express, { Router } from "express";
import * as blogs from './controller/blogs.js'
import { fileUplode, fileVaildation } from "../../../utils/multer.cloudinary.js";
// import auth from '../../middleware/auth.js'
const router = Router()



router.post('/createArabicBlog', fileUplode(fileVaildation.image).array("images"), blogs.createArabicBlog)
router.post('/createEnglishBlog', fileUplode(fileVaildation.image).array("images"), blogs.createEnglishBlog)
router.get('/getArabicBlogs', blogs.getArabicBlogs)
router.get('/getEnglishBlogs', blogs.getEnglishBlogs)
router.put('/updateblog', blogs.updateBlog)
router.delete('/:_id', blogs.deleteBlog)
// router.patch('/uploadImg', fileUplode(fileVaildation.image).single("image"), blogs.uploadImage)


export default router

