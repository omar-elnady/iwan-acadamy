import userModel from "../../../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../../../../utils/errorHandling.js";

export const register = asyncHandler(async (req, res, next) => {
  const { userName, password, cPassword } = req.body;
  const isExist = await userModel.findOne({ userName });
  if (password != cPassword) {
    return next(new Error("Confirm Password not match password"));
  }
  if (isExist) {
    return next(new Error("userName is aleady exist"));
  }
  const hashPassword = bcrypt.hashSync(
    password,
    Number(process.env.SALT_ROUNDS)
  );
  const user = await userModel.create({
    userName,
    password: hashPassword,
  });
  return res.json({
    message: "Done",
    user: { userName: user.userName, _id: user._id },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { userName, password } = req.body;
  const checkUser = await userModel.findOne({ userName });
  if (!checkUser) {
    return next(new Error("Username is not exist"));
  }
  const comparePassword = bcrypt.compareSync(password, checkUser.password);
  if (!comparePassword) {
    return next(new Error("Username or Password not correct"));
  }
  const token = jwt.sign(
    { userName, id: checkUser._id },
    process.env.SECRETJWT_KEY
  );
  res.json({ message: "Done", token });
});
