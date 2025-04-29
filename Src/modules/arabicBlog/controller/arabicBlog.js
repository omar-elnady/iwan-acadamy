import arBlogModel from "../../../../DB/Models/arabicBlog.model.js";
import { asyncHandler } from "../../../../utils/errorHandling.js";
import cloudinary from "../../../../utils/cloudinary.js";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import enBlogModel from "../../../../DB/Models/englishBlog.model.js";

const formatted = dayjs().format("D MMM - YYYY");

export const createArBlog = asyncHandler(async (req, res, next) => {
  const { title, overview, content, commonId } = req.body;
  if (!title) {
    return next(new Error("please add title"));
  }
  const file = req.file;
  const titleWithoutSpace = title?.trim();
  const titleSlug = titleWithoutSpace.replace(/\s+/g, "-").toLowerCase();
  const isSlugExist = await arBlogModel.findOne({ slug: titleSlug });
  if (isSlugExist) {
    return next(new Error("The blog with this title already exists"));
  }
  let image = {};
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `blogs/${titleSlug}` }
    );
    image = { secure_url, public_id };
  }
  const isEnBlogCommonIdExist = await enBlogModel.findOne({ commonId });
  const blog = await arBlogModel.create({
    title: titleWithoutSpace,
    overview,
    content,
    image,
    slug: titleSlug,
    date: formatted,
    commonId: isEnBlogCommonIdExist ? isEnBlogCommonIdExist.commonId : uuidv4(),
    isLinked: isEnBlogCommonIdExist ? true : false,
  });
  return res.json({ message: "Done", blog });
});

export const getArBlogs = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const search = req.query.search || "";
  const cleanSearch = search.replace(/"/g, "");
  const regex = new RegExp(cleanSearch, "i");
  const totalBlogs = await arBlogModel.countDocuments({
    $or: [
      { title: { $regex: regex } },
      { overview: { $regex: regex } },
      { content: { $regex: regex } },
    ],
  });
  const blogs = await arBlogModel
    .find({
      $or: [
        { title: { $regex: regex } },
        { overview: { $regex: regex } },
        { content: { $regex: regex } },
      ],
    })
    .limit(limit)
    .skip(skip);

  const totalPages = Math.ceil(totalBlogs / limit);
  return res.json({ message: "Done", blogs, totalPages, totalBlogs });
});

export const getArBlogByCommonId = asyncHandler(async (req, res) => {
  const { commonId } = req.params;

  const blog = await arBlogModel.findOneAndUpdate(
    { commonId },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    return next(new Error("Blog not found"));
  }

  return res.json({ message: "Done", blog });
});

export const updateArBlog = asyncHandler(async (req, res, next) => {
  const { title, overview, content, commonId } = req.body;
  const { id } = req.params;
  let image = req.file;

  const isBlogExist = await arBlogModel.findById(id);
  if (!isBlogExist) {
    return next(new Error("Blog is not exist"));
  }
  const titleWithoutSpace = title?.trim();
  const titleSlug = titleWithoutSpace.replace(/\s+/g, "-").toLowerCase();
  const isSlugExist = await arBlogModel.findOne({ slug: titleSlug });
  if (isSlugExist && isSlugExist._id.toString() !== id) {
    return next(new Error("Can't update blog, this title is already exist"));
  }
  const isEnBlogCommonIdExist = await enBlogModel.findOne({ commonId });
  let newImage = null;

  if (image?.path && isBlogExist.image?.public_id) {
    await cloudinary.uploader.destroy(isBlogExist.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      image.path,
      { folder: `blogs/${titleSlug}` }
    );
    newImage = { secure_url, public_id };
  }
  const blog = await arBlogModel.findByIdAndUpdate(
    id,
    {
      title: titleWithoutSpace,
      overview,
      content,
      image: newImage || isBlogExist.image,
      slug: titleSlug,
      lastUpdate: formatted,
      commonId: isEnBlogCommonIdExist
        ? isEnBlogCommonIdExist.commonId
        : isBlogExist.commonId,
      isLinked: isEnBlogCommonIdExist ? true : false,
    },
    { new: true }
  );
  return res.json({ message: "Done", blog });
});

export const deleteArBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await arBlogModel.findById(id);
  if (!blog) {
    return next(new Error("Blog not found"));
  }
  if (blog.image?.public_id) {
    await cloudinary.uploader.destroy(blog.image.public_id);
  }
  const deleteBlog = await arBlogModel.findByIdAndDelete(id);

  return res.json({
    message: "Blog and image deleted successfully",
    deleteBlog,
  });
});
