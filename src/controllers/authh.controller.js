import db from "../models/index";
import CRUDService from "../services/CRUDService";
import productService from "../services/shore.service";

let getRegisterForm = (req, res) => {
  return res.render("crud.ejs");
};

let registerUser = async (req, res) => {
  try {
    let message = await CRUDService.createNewUser(req.body);

    return res.status(200).json({
      errCode: 0,
      message: message
    });
  } catch (error) {
    console.log(error);
  }
};
let loginForm = (req, res) => {
  let message = "helo";
  return res.render("loginForm.ejs", {
    message: message,
  });
};
let login = async (req, res) => {
  try {
    const result = await CRUDService.login(req);

    if (!result) {
      return res.status(401).json({
        message: "Username or password is incorrect",
      });
    }

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, // true khi dùng HTTPS
      sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      type: result.type,
      account: result.account,
    });


    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};



let getDataUsers = async (req, res) => {
  let data = await CRUDService.getAllUser();
  console.log(req.user);
  return res.render("displayCRUD.ejs", {
    user: req.user,
    dataTable: data,
  });
};

let getUserInfo = async (req, res) => {
  try {

    const user = req.user;
    console.log("uuuuuuuuuuuuuuuuuuu", user)
    return res.status(200).json({
      errCode: 0,
      message: "Success",
      data: user
    });

  } catch (e) {

    console.error("getUserInfo Error:", e);

    return res.status(500).json({
      errCode: -1,
      message: e,
      stack: e.stack
    });
  } ư
};

let editUser = async (req, res) => {
  try {
    let id = req.params.id;
    let message = await CRUDService.editUser(id, req.body);
    return res.send(message);
  } catch (error) {
    console.log(error);
  }
};

let updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        errCode: 1,
        message: "Please select an image."
      });
    }
    const userId = req.user.id;
    const avatar = await CRUDService.updateAvatar(userId, req.file);
    return res.status(200).json({
      errCode: 0,
      message: "Avatar updated successfully.",
      avatar
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      message: e.message
    });
  }
};

let refreshToken = async (req, res) => {
  const result = await CRUDService.refreshToken(req);

  if (!result) {
    return res.status(401).json({
      message: "Refresh Token không hợp lệ",
    });
  }

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken: result.accessToken,
  });
};

let logout = async (req, res) => {
  try {
    await CRUDService.logout(req);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.redirect("/loginform");
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Logout failed",
    });
  }
};
export default {
  getRegisterForm,
  registerUser,
  getDataUsers,
  getUserInfo,
  editUser,
  loginForm,
  login,
  refreshToken,
  logout,
  updateAvatar
};
