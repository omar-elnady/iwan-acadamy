import  { Router } from "express";
import * as arabicBlog from './controller/arabicBlog.js'
import auth from '../../middleware/auth.js'
const router = Router()



router.post('/sendblog', arabicBlog.createBlog)
router.get('/getblogs', arabicBlog.getBlogs)
router.put('/updateblog', arabicBlog.updateBlog)
router.delete('/:id', arabicBlog.deleteBlog)



export default router