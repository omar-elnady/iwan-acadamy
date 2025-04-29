import { Router } from "express";
import * as arabicBlog from "./controller/arabicBlog.js";
import auth from "../../middleware/auth.js";
const router = Router();

router.post("/sendblog", auth, arabicBlog.createBlog);
router.get("/getblogs", arabicBlog.getBlogs);
router.put("/updateblog", auth, arabicBlog.updateBlog);
router.delete("/:id", auth, arabicBlog.deleteBlog);

export default router;
