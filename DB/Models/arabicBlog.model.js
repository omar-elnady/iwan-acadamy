import { Schema, model, trusted } from "mongoose";

const arBlogSchema = new Schema(
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
  },
  { timestamps: true }
);

const arBlogModel = model("arabicBlog", arBlogSchema);
export default arBlogModel;
