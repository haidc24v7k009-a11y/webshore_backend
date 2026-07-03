import db from "../models/index";
import CRUDService from "../services/CRUDService";
import productService from "../services/shore.service";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();

    console.log("===============================");
    console.log(data);
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};

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

let getDataCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  console.log(req.user);
  return res.render("displayCRUD.ejs", {
    user: req.user,
    dataTable: data,
  });
};

let getProductData = async (req, res) => {
  let productData = await productService.getAllProduct();

  return res.render("product.ejs", {
    user: req.user,
    dataTable: productData,
  });
};

let getProductVar = async (req, res) => {
  let prodId = req.params.id;
  console.log(prodId);

  let prod = await productService.getProductById(prodId);
  let prodVar = await productService.getProdVarByProdId(prodId);


  return res.render("productvariant.ejs", {
    prod: prod,
    prodDetail: prodVar.productVars,
    variantCount: prodVar.count,
    colors: prodVar.colors,
    sizes: prodVar.sizes,

  });
};
let getSizes = async (req, res) => {

  let sizes = await productService.getSizes(
    req.params.id,
    req.params.colorId
  );

  res.json(sizes);
}

let addtoCart = async (userId, product_variant_id, quantity) => {
  try {
    await productService.addToCart(userId, product_variant_id, quantity);
    return console.log("Added to cart successfully");
  } catch (error) {
    console.error(error);
    return console.error("Failed to add to cart");
  }
};

let findProductVariant = async (req, res) => {
  let { product_id, color_id, size_id } = req.body;
  console.log("req.body: ", req.body);
  let variant = await productService.findVariant(product_id, color_id, size_id);
  console.log("variant: ", variant);

  let { quantity } = req.body;
  let userId = req.user.id;
  await addtoCart(userId, variant.id, quantity);

  res.json({
    variant: variant,
  });
}

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

    return res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
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
  getHomePage,
  getRegisterForm,
  registerUser,
  getDataCRUD,
  getUserInfo,
  editUser,
  loginForm,
  login,
  logout,
  getProductData,
  getProductVar,
  findProductVariant,
  getSizes,
  addtoCart,
};
