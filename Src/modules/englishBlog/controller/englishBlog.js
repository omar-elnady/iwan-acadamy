import enBlogModel from "../../../../DB/Models/englishBlog.model.js";
import { asyncHandler } from "../../../../utils/errorHandling.js";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { paginate } from "../../../../utils/paginate.js";  
import arBlogModel from "../../../../DB/Models/arabicBlog.model.js";
import cloudinary from "../../../../utils/cloudinary.js";

const formatted = dayjs().format("D MMM - YYYY");


export const getEnBlogs = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  const search = req.query.search || "";
  const cleanSearch = search.replace(/"/g, "").slice(0, 50);
  const regex = new RegExp(cleanSearch, "i");

  const totalBlogs = await enBlogModel.countDocuments({
    $or: [
      { title: { $regex: regex } },
      { overview: { $regex: regex } },
     
    ],
  });

  const blogs = await enBlogModel
    .find({
      $or: [
        { title: { $regex: regex } },
        { overview: { $regex: regex } },
       
      ],
    })
    .limit(limit)
    .skip(skip);

  const totalPages = Math.ceil(totalBlogs / limit);
  return res.json({ message: "Blogs retrieved successfully", blogs, totalPages, totalBlogs });
});

export const getEnBlogByCommonId = asyncHandler(async (req, res) => {
  const { commonId } = req.params;

  const blog = await enBlogModel.findOneAndUpdate(
    { commonId },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    return next(new Error("Blog not found"));
  }

  return res.json({ message: "Blog retrieved successfully", blog });
});

export const createEnBlog = asyncHandler(async (req, res, next) => {
  const { title, overview, content, commonId } = req.body;
  if (!title) {
    return next(new Error("please add title"));
  }
  const file = req.file;
  const titleWithoutSpace = title?.trim();
  const titleSlug = titleWithoutSpace.replace(/\s+/g, "-").toLowerCase();
  const isSlugExist = await enBlogModel.findOne({ slug: titleSlug });
  if (isSlugExist) {
    return next(new Error("The blog with this title already exists"));
  }
  let image = {};
  if (file?.path) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `blogs/en/${titleSlug}` }
    );
    image = { secure_url, public_id };
  }
  console.log(image);
  const isArBlogCommonIdExist = await arBlogModel.findOne({ commonId });
  const blog = await enBlogModel.create({
    title: titleWithoutSpace,
    overview,
    content,
    image,
    slug: titleSlug,
    date: formatted,
    commonId: isArBlogCommonIdExist ? isArBlogCommonIdExist.commonId : uuidv4(),
    isLinked: isArBlogCommonIdExist ? true : false,
    language: "en",
  });
  return res.json({ message: "Blog created successfully", blog });
});


export const updateEnBlog = asyncHandler(async (req, res, next) => {
  const { title, overview, content, commonId } = req.body;
  const { id } = req.params;
  let image = req.file;

  const isBlogExist = await enBlogModel.findById(id);
  if (!isBlogExist) {
    return next(new Error("Blog is not exist"));
  }
  const titleWithoutSpace = title?.trim();
  const titleSlug = titleWithoutSpace.replace(/\s+/g, "-").toLowerCase();
  const isSlugExist = await enBlogModel.findOne({ slug: titleSlug });
  if (isSlugExist && isSlugExist._id.toString() !== id) {
    return next(new Error("Can't update blog, this title is already exist"));
  }
  const isArBlogCommonIdExist = await arBlogModel.findOne({ commonId });
  let newImage = null;

  if (image?.path && isBlogExist.image?.public_id) {
    await cloudinary.uploader.destroy(isBlogExist.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      image.path,
      { folder: `blogs/en/${titleSlug}` }
    );
    newImage = { secure_url, public_id };
  }
  const blog = await enBlogModel.findByIdAndUpdate(
    id,
    {
      title: titleWithoutSpace,
      overview,
      content,
      image: newImage || isBlogExist.image,
      slug: titleSlug,
      lastUpdate: formatted,
      commonId: isArBlogCommonIdExist
        ? isArBlogCommonIdExist.commonId
        : isBlogExist.commonId,
      isLinked: isArBlogCommonIdExist ? true : false,
    },
    { new: true }
  );
  return res.json({ message: "Blog updated successfully", blog });
});

export const deleteEnBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await enBlogModel.findById(id);
  if (!blog) {
    return next(new Error("Blog not found"));
  }
  if (blog.image?.public_id) {
    await cloudinary.uploader.destroy(blog.image.public_id);
  }
  const deleteBlog = await enBlogModel.findByIdAndDelete(id);

  return res.json({
    message: "Blog and image deleted successfully",
    deleteBlog,
  });
});
