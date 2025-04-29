import userModel from "../../DB/Models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (
    !authorization ||
    !authorization?.startsWith(`${process.env.TOKEN_PREFIX_BEARER_KEY}`)
  ) {
    return next(new Error("authorization is required"));
  }
  const token = authorization.split("iwan ")[1];
  if (!token) {
    return next(new Error("token is required"));
  }
  const decoded = jwt.verify(token, process.env.SECRETJWT_KEY);
  if (!decoded?.id) {
    const err = new Error("invalid or expired token");
    err.statusCode = 401;
    return next(err);
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    const err = new Error("User not found or not registered");
    err.statusCode = 404;
    return next(err);
  }
  req.user = user;
  return next();
});

export default auth;
