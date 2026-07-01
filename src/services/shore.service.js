import db from "../models/index";

let getAllProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = db.Product.findAll({
        include: [
          {
            model: db.Category,
            attributes: ["id", "categoryName"],
          },
          {
            model: db.Brand,
            attributes: ["id", "brandName"],
          },
        ],
      });
      resolve(products);
    } catch (e) {
      reject(e);
    }
  });
};

let getProductById = (id) => {
  console.log("service; ", id);
  return new Promise(async (resolve, reject) => {
    try {
      let product = db.Product.findOne({
        where: { id: id },
        raw: true,
      });
      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

let getProdVarByProdId = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productVars = await db.ProductVariant.findAll({
        where: { product_id: productId },
        include: [
          {
            model: db.Color,
            attributes: ["id", "color_name"],
          },
          {
            model: db.Size,
            attributes: ["id", "size_number"],
          },
        ],
      });
      resolve(productVars);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getAllProduct,
  getProductById,
  getProdVarByProdId,
};
