import connection from "../DB/connection.js";
import { globalHandlingError } from "../utils/errorHandling.js";
import cors from "cors";

// Import Routers
import authRouter from "./modules/auth/auth.router.js";
import blogs from "./modules/blogs/blogs.router.js";
import arabicBlogs from "./modules/arabicBlog/arabicBlog.router.js";
import englishBlogs from "./modules/englishBlog/englishBlog.router.js";

const bootstarp = (app, express) => {
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  connection();

  app.use("/api/auth", authRouter);
  app.use("/api/arblogs", arabicBlogs);
  app.use("/api/enBlogs", englishBlogs);

  app.get("*", (req, res, next) => {
    res.json({ message: "invalid routing " });
  });
  app.use(globalHandlingError);
};

export default bootstarp;
