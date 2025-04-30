import express, { Router } from "express";
import * as englishBlog from "./controller/englishBlog.js";
import auth from "../../middleware/auth.js";
import {
  fileUplode,
  fileVaildation,
} from "../../../utils/multer.cloudinary.js";

const router = Router();

router.get("/", englishBlog.getEnBlogs);
router.get("/:commonId", englishBlog.getEnBlogByCommonId);

router.post(
  "/",
  auth,
  fileUplode(fileVaildation.image).single("image"),
  englishBlog.createEnBlog
);
router.put(
  "/:id",
  auth,
  fileUplode(fileVaildation.image).single("image"),
  englishBlog.updateEnBlog
);
router.delete("/:id", auth, englishBlog.deleteEnBlog);

export default router;
