import db from "../models/index";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

//LOAD DATA BY ID

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
        where: { product_id: productId, stock: { [db.Sequelize.Op.gt]: 0 } },
        include: [
          {
            model: db.Color,
            attributes: ["id", "colorName"],
          },
          {
            model: db.Size,
            attributes: ["id", "sizeNumber"],
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
              colorName: v.Color.colorName,
            },
          ]),
        ).values(),
      ];

      // Danh sách size không trùng
      let sizes = [
        ...new Map(
          productVars.map((v) => [
            v.Size.id,
            {
              id: v.Size.id,
              sizeNumber: v.Size.sizeNumber,
            },
          ]),
        ).values(),
      ];

      let count = await db.ProductVariant.count({
        where: {
          product_id: productId,
          stock: {
            [db.Sequelize.Op.gt]: 0,
          },
        },
      });
      resolve({ productVars, count, colors, sizes });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
};

let getImagesByProductId = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let images = await db.ProductImage.findAll({
        where: { product_id: productId },
      });
      resolve(images);
    } catch (error) {
      reject(error);
    }
  });
};

//LOAD DATA

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
            model: db.ProductImage,
            attributes: ["image_path"],
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

let getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let categories = await db.Category.findAll({
        attributes: ["id", "categoryName"],
      });
      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

let getAllBrands = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let brands = await db.Brand.findAll({
        attributes: ["id", "brandName"],
      });
      resolve(brands);
    } catch (error) {
      reject(error);
    }
  });
};

let getAllColors = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let colors = await db.Color.findAll({
        attributes: ["id", "colorName"],
      });
      resolve(colors);
    } catch (error) {
      reject(error);
    }
  });
};

let getAllSizes = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sizes = await db.Size.findAll({
        attributes: ["id", "sizeNumber"],
      });
      resolve(sizes);
    } catch (error) {
      reject(error);
    }
  });
};

//------------CART SERVICE----------------//

let addToCart = (userId, variantId, quantity) => {
  return new Promise(async (resolve, reject) => {
    try {
      const variant = await db.ProductVariant.findByPk(variantId);

      if (!variant) {
        return resolve({
          errCode: 1,
          message: "Product variant not found.",
        });
      }

      if (variant.stock < quantity) {
        return resolve({
          errCode: 2,
          message: "Insufficient stock.",
        });
      }

      let cartItem = await db.CartItem.findOne({
        where: {
          user_id: userId,

          product_variant_id: variantId,
        },
      });

      if (cartItem) {
        const newQuantity = cartItem.quantity + quantity;

        if (newQuantity > variant.stock) {
          return resolve({
            errCode: 3,

            message: "Quantity exceeds stock.",
          });
        }

        await cartItem.update({
          quantity: newQuantity,
        });
      } else {
        await db.CartItem.create({
          user_id: userId,

          product_variant_id: variantId,

          quantity,
        });
      }

      resolve({
        errCode: 0,

        message: "Added to cart successfully.",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let findVariant = async (product_id, color_id, size_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let variant = await db.ProductVariant.findOne({
        where: {
          product_id,
          color_id,
          size_id,
        },
      });
      resolve(variant);
    } catch (error) {
      reject(error);
    }
  });
};

let getCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await db.CartItem.findAll({
        where: {
          user_id: userId,
        },

        include: [
          {
            model: db.ProductVariant,

            include: [
              {
                model: db.Product,

                include: [
                  {
                    model: db.ProductImage
                  }
                ]
              },
              {
                model: db.Color,
              },
              {
                model: db.Size,
              },
            ],
          },
        ],

        order: [["createdAt", "DESC"]],
      });

      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });
};

let updateCartItem = (userId, cartItemId, quantity) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cartItem = await db.CartItem.findOne({
        where: {
          id: cartItemId,

          user_id: userId,
        },

        include: [
          {
            model: db.ProductVariant,
          },
        ],
      });

      if (!cartItem) {
        return resolve({
          errCode: 1,

          message: "Cart item not found.",
        });
      }

      if (quantity <= 0) {
        await cartItem.destroy();

        return resolve({
          errCode: 0,

          message: "Item removed from cart.",
        });
      }

      if (quantity > cartItem.ProductVariant.stock) {
        return resolve({
          errCode: 2,

          message: `Only ${cartItem.ProductVariant.stock} items left in stock.`,
        });
      }

      await cartItem.update({
        quantity,
      });

      resolve({
        errCode: 0,

        message: "Cart updated successfully.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let deleteCartItem = (userId, cartItemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cartItem = await db.CartItem.findOne({
        where: {
          id: cartItemId,

          user_id: userId,
        },
      });

      if (!cartItem) {
        return resolve({
          errCode: 1,

          message: "Cart item not found.",
        });
      }

      await cartItem.destroy();

      resolve({
        errCode: 0,

        message: "Item removed successfully.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

// let addToCart = async (userId, variantId, quantity) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await db.CartItem.create({
//         user_id: userId,
//         product_variant_id: variantId,
//         quantity: quantity
//       });
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

//***********CLOUDINARY UPLOAD***********/
const uploadToCloudinary = (file) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(

      {
        folder: "products",
      },

      (error, result) => {

        if (error) return reject(error);

        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

};

//CRUD Service for Product, ProductVariant, Color, Size, CartItem

let createProduct = (data, files) => {
  return new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
      const product = await db.Product.create(
        {
          productName: data.productName,
          price: data.price,
          category_id: data.category_id,
          brand_id: data.brand_id,
          product_description: data.product_description,
        },
        { transaction },
      );

      if (files && files.length > 0) {

        let images = [];

        for (const file of files) {
          const uploadResult = await uploadToCloudinary(file);
          images.push({
            product_id: product.id,
            image_path: uploadResult.secure_url,
          });
        }

        await db.ProductImage.bulkCreate(images, {
          transaction,
        });
      }
      await transaction.commit();
      resolve(product);
    } catch (error) {
      await transaction.rollback();
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
  createProduct,
  getAllCategories,
  getAllBrands,
  getAllColors,
  getAllSizes,
  getImagesByProductId,
  getCart,
  updateCartItem,
  deleteCartItem,
  // getColors,
  // getSizes
};
