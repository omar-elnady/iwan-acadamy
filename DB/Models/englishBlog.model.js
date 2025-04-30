import { Schema, model } from "mongoose";

const enBlogSchema = new Schema(
  {
    title: {
      type: String,
      unique: false,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: false,
    },
    overview: {
      type: String,
      unique: false,
      required: false,
    },
    content: {
      type: String,
      unique: false,
      required: false,
    },
    image: { secure_url: String, public_id: String },
    commonId: { type: String, unique: true },
    isLinked: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "en",
    }
  },
  { timestamps: true }
);

const enBlogModel = model("englishBlog", enBlogSchema);
export default enBlogModel;
