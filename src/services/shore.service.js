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
}

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
}

let getAllColors = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let colors = await db.Color.findAll({
        attributes: ["id", "color_name"],
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
        attributes: ["id", "size_number"],
      });
      resolve(sizes);
    } catch (error) {
      reject(error);
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


//***********CLOUDINARY UPLOAD***********/
const uploadToCloudinary = (file) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(

      {
        folder: "products"
      },

      (error, result) => {

        if (error) return reject(error);

        resolve(result);

      }

    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(stream);

  });

};

//CRUD Service for Product, ProductVariant, Color, Size, CartItem

let createProduct = (data, files) => {
  return new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
      const product = await db.Product.create({
        productName: data.productName,
        price: data.price,
        category_id: data.category_id,
        brand_id: data.brand_id,
        product_description: data.product_description
      }, { transaction });

      if (files && files.length > 0) {

        let images = [];

        for (const file of files) {
          const uploadResult = await uploadToCloudinary(file);
          images.push({
            product_id: product.id,
            image_path: uploadResult.secure_url
          });
        }

        await db.ProductImage.bulkCreate(images, {
          transaction
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
  // getColors,
  // getSizes
};
