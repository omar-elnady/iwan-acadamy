import { Router } from "express";
import * as arabicBlog from "./controller/arabicBlog.js";
import auth from "../../middleware/auth.js";
import {
  fileUplode,
  fileVaildation,
} from "../../../utils/multer.cloudinary.js";
const router = Router();

router.get("/",  arabicBlog.getArBlogs);
router.get("/:commonId", arabicBlog.getArBlogByCommonId);

router.post(
  "/",
  auth,
  fileUplode(fileVaildation.image).single("image"),
  arabicBlog.createArBlog
);
router.put(
  "/:id",
  auth,
  fileUplode(fileVaildation.image).single("image"),
  arabicBlog.updateArBlog
);
router.delete("/:id", auth, arabicBlog.deleteArBlog);

export default router;
