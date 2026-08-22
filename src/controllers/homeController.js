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

let getProductData = async (req, res) => {
  let productData = await productService.getAllProduct();

  return res.status(200).json({
    message: "load product success",
    data: productData,
  });
};

let importReceipt = async (req, res) => {
  return res.render("importreceipt.ejs", {
    user: req.user,
  });
};

let getProductVar = async (req, res) => {
  let prodId = req.params.id;
  console.log(prodId);

  let prod = await productService.getProductById(prodId);
  let prodVar = await productService.getProdVarByProdId(prodId);
  let images = await productService.getImagesByProductId(prodId);

  return res.json({
    product: prod,

    variants: prodVar.productVars,

    colors: prodVar.colors,

    sizes: prodVar.sizes,

    images: images,

    count: prodVar.count,
  });
};
let getSizes = async (req, res) => {
  let sizes = await productService.getSizes(req.params.id, req.params.colorId);

  res.json(sizes);
};

//----------------CART CONTROLLER----------------//
let addToCart = async (req, res) => {
  try {
    const { product_id, color_id, size_id, quantity } = req.body;

    const variant = await productService.findVariant(
      product_id,

      color_id,

      size_id,
    );

    if (!variant) {
      return res.status(404).json({
        errCode: 1,

        message: "Variant not found.",
      });
    }

    const result = await productService.addToCart(
      req.user.id,

      variant.id,

      quantity,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,

      message: "Server error.",
    });
  }
};

let getCart = async (req, res) => {
  try {
    const cart = await productService.getCart(req.user.id);

    return res.status(200).json({
      errCode: 0,

      message: "Success",

      data: cart,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,

      message: "Server Error",
    });
  }
};

let updateCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    const { quantity } = req.body;

    const result = await productService.updateCartItem(
      req.user.id,

      cartItemId,

      quantity,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,

      message: "Server error.",
    });
  }
};

let deleteCartItem = async (req, res) => {
  try {
    const result = await productService.deleteCartItem(
      req.user.id,

      req.params.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,

      message: "Server error.",
    });
  }
};
//----------------------------------------------------------

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

// let loginForm = (req, res) => {
//   let message = "helo";
//   return res.render("loginForm.ejs", {
//     message: message,
//   });
// };
// let login = async (req, res) => {
//   try {
//     const result = await CRUDService.login(req);

//     if (!result) {
//       return res.status(401).json({
//         message: "Username or password is incorrect",
//       });
//     }

//     res.cookie("accessToken", result.accessToken, {
//       httpOnly: true,
//     });

//     return res.json({
//       accessToken: result.accessToken,
//       user: result.user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

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

let createProductForm = async (req, res) => {
  let categories = await productService.getAllCategories();
  let brands = await productService.getAllBrands();
  return res.render("insertproduct.ejs", {
    cates: categories,
    brands: brands,
  });
};

let createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    const result = await productService.createProduct(data, files);
    console.log(files);
    return res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: result,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      success: false,
      message: "Thêm sản phẩm thất bại",
    });
  }
};

export default {
  getHomePage,
  getUserInfo,
  editUser,
  // loginForm,
  // login,
  logout,
  getProductData,
  getProductVar,
  // findProductVariant,
  getSizes,
  createProductForm,
  createProduct,
  importReceipt,
  //--cart--
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem

};
