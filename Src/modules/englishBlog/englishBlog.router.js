import express, { Router } from "express";
import * as englishBlog from './controller/englishBlog.js'
import auth from '../../middleware/auth.js'
const router = Router()



router.post('/sendblog', englishBlog.createBlog)
router.get('/getblogs', englishBlog.getBlogs)
router.put('/updateblog', englishBlog.updateBlog)
router.delete('/:id', englishBlog.deleteBlog)



export default router