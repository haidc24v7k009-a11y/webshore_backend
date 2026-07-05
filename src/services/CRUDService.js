import db from "../models/index";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { randomBytes } from "crypto";
env.config();

const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashPassword(data.password);
      await db.User.create({
        fullName: data.fullName,
        username: data.username,
        password: hashPasswordFromBcrypt,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        status: data.status,
        avatar: data.avatar,
        role: data.role,
        gender: data.gender === "1" ? true : false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        lastLogin: data.lastLogin,
      });
      resolve("ok create a new user succeed!");
    } catch (e) {
      reject(e);
    }
  });
};

let hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

let editUser = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      user.set({
        fullName: data.fullName,
        username: data.username,
        password: data.password,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        gender: data.gender === "1" ? true : false,
      });
      await user.save();
      resolve("Update the user succeed!");
    } catch (error) {
      reject(error);
    }
  });
};

let createToken = (user) => {
  let ACCESS_TOKENN_TTL = "15m";
  let REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKENN_TTL },
  );

  const refreshToken = randomBytes(64).toString("hex");
  console.log("refreshToken: ", refreshToken);

  return new Promise(async (resolve, reject) => {
    console.log("user =", user);
    console.log("user.id =", user?.id);
    await db.RefreshToken.create({
      refresh_token: refreshToken,
      user_id: user.id,
      expires_at: Date.now() + REFRESH_TOKEN_TTL,
    });
    resolve({ accessToken, refreshToken });
  });
};

let login = async (req) => {
  let user = await db.User.findOne({
    where: { username: req.body.username },
    raw: true,
  });

  if (!user) {
    return null;
  }

  let check = bcrypt.compareSync(req.body.password, user.password);

  if (!check) {
    return null;
  }

  const { accessToken, refreshToken } = await createToken(user);
  console.log("TLL: ", accessToken.ACCESS_TOKENN_TTL);
  return {
    user,
    accessToken,
    refreshToken,
  };
};

let logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await db.RefreshToken.destroy({
        where: {
          refresh_token: refreshToken,
        },
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
};


let refreshToken = async (req) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return null;
  }

  const token = await db.RefreshToken.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!token) {
    return null;
  }

  if (new Date(token.expires_at) < new Date()) {
    await token.destroy();
    return null;
  }

  // Rotation
  await token.destroy();

  return await createToken(token.user_id);
};



export default {
  createNewUser,
  hashPassword,
  getAllUser,
  getUserInfoById,
  editUser,
  login,
  createToken,
  logout,
  refreshToken,
};
