import db from "../models/index";
import CRUDService from "../services/CRUDService";
import productService from "../services/shore.service";

let getRegisterForm = (req, res) => {
  return res.render("crud.ejs");
};

let registerUser = async (req, res) => {
  try {
    let message = await CRUDService.createNewUser(req.body);
    return res.send(message);
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
    if (result.type === "employee") {
      return res.render("adminpage.ejs");
    }

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
  let id = req.params.id;
  let user = await CRUDService.getUserInfoById(id);
  let message = "";
  return res.render("infoUser.ejs", {
    data: user,
    message: message,
  });
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
  logout
};
