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
        where: { product_id: productId, quantity: { [db.Sequelize.Op.gt]: 0 } },
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

      // Danh sách màu không trùng
      let colors = [
        ...new Map(
          productVars.map((v) => [
            v.Color.id,
            {
              id: v.Color.id,
              color_name: v.Color.color_name,
            },
          ])
        ).values(),
      ];

      // Danh sách size không trùng
      let sizes = [
        ...new Map(
          productVars.map((v) => [
            v.Size.id,
            {
              id: v.Size.id,
              size_number: v.Size.size_number,
            },
          ])
        ).values(),
      ];

      let count = await db.ProductVariant.count({
        where: {
          product_id: productId,
          quantity: {
            [db.Sequelize.Op.gt]: 0,
          },
        },
      });
      resolve({ productVars, count, colors, sizes });
    } catch (error) {
      reject(error);
    }
  });
};


// let getColors = async (productId) => {
//   return await db.Color.findAll({
//     attributes: ["id", "color_name"],
//     include: [
//       {
//         model: db.ProductVariant,
//         attributes: [],
//         where: {
//           product_id: productId,
//           quantity: {
//             [db.Sequelize.Op.gt]: 0,
//           },
//         },
//       },
//     ],
//     group: ["Color.id", "Color.color_name"]
//   });
// };

// let getSizes = async (productId, colorId) => {
//   return await db.Size.findAll({
//     attributes: ["id", "size_number"],
//     include: [
//       {
//         model: db.ProductVariant,
//         attributes: [],
//         where: {
//           product_id: productId,
//           color_id: colorId,
//           quantity: {
//             [db.Sequelize.Op.gt]: 0,
//           },
//         },
//       },
//     ],
//     group: ["Size.id"],
//   });
// };


let findVariant = async (product_id, color_id, size_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let variant = await db.ProductVariant.findOne({
        where: {
          product_id,
          color_id,
          size_id
        }
      });
      resolve(variant);
    } catch (error) {
      reject(error);
    }
  })

}

let addToCart = async (userId, variantId, quantity) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.CartItem.create({
        user_id: userId,
        product_variant_id: variantId,
        quantity: quantity
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getAllProduct,
  getProductById,
  getProdVarByProdId,
  findVariant,
  addToCart,
  // getColors,
  // getSizes
};
