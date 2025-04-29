import arBlogModel from "../../../../DB/Models/arabicBlog.model.js";
import { asyncHandler } from "../../../../utils/errorHandling.js";

export const createBlog = asyncHandler(async (req, res, next) => {
  const { title, summary, content, date, posterImage, mainImage } = req.body;
  const isExist = await arBlogModel.findOne({ title });
  if (isExist) {
    return next(new Error("title is already exist"));
  }
  if (!title || !summary || !content) {
    return next(new Error("please add all fields"));
  }
  if (!mainImage || !blogImage) {
    return next(new Error("please add all images"));
  }
  const blog = await arBlogModel.create({
    title,
    summary,
    content,
    date,
    mainImage,
    blogImage,
  });
  return res.json({ message: "Done" });
});
export const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await arBlogModel.find();
  return res.json({ message: "Done", blogs });
});

export const updateBlog = asyncHandler(async (req, res, next) => {
  const { _id, summary, title, content, mainImage, blogImage } = req.body;
  const isExist = await arBlogModel.findById(_id);
  if (!isExist) {
    return next(new Error("blog is not exist"));
  }
  const updateBlog = await arBlogModel.findByIdAndUpdate(_id, {
    summary,
    title,
    content,
    mainImage,
    blogImage,
  });
  return res.json({ message: "Done" });
});

export const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteBlog = await arBlogModel.findByIdAndDelete(id);
  return res.json({ message: "Done", deleteBlog });
});
