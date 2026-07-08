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

let createToken = async (account, accountType) => {
  let ACCESS_TOKEN_TTL = "15m";
  let REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

  const payload = {
    id: account.id,
    type: accountType, // "user" | "employee"
  };
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_TTL,
    }
  );

  const refreshToken = randomBytes(64).toString("hex");
  console.log("refreshToken: ", refreshToken);

  return new Promise(async (resolve, reject) => {
    await db.RefreshToken.create({
      account_id: account.id,
      account_type: accountType,
      refresh_token: refreshToken,
      expires_at: Date.now() + REFRESH_TOKEN_TTL,
    });
    resolve({ accessToken, refreshToken });
  });
};

let login = async (req) => {

  const { username, password } = req.body;

  let user = await db.User.findOne({
    where: { username }
  });

  if (user) {
    if (!bcrypt.compareSync(password, user.password)) {
      return null;
    }
    const { accessToken, refreshToken } = await createToken(user, "user");

    return {
      account: user,
      type: "user",
      accessToken,
      refreshToken
    }
  }
  let employee = await db.Employee.findOne({
    where: {
      username
    }
  });
  if (employee) {
    if (!bcrypt.compareSync(password, employee.password)) {
      return null;
    }
    const { accessToken, refreshToken } = await createToken(employee, "employee");
    return {
      account: employee,
      type: "employee",
      accessToken,
      refreshToken
    }
  }
  console.log("TLL: ", accessToken.ACCESS_TOKEN_TTL);
  return null;
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
      raw: true,
    },
  });

  if (!token) {
    return null;
  }

  if (new Date(token.expires_at) < new Date()) {
    await token.destroy();
    return null;
  }

  let account;

  if (token.account_type === "user") {

    account = await db.User.findByPk(token.user_id);

  } else {

    account = await db.Employee.findByPk(token.user_id);

  }

  await token.destroy();

  return await createToken(account, token.account_type);
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
