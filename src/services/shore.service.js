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
                    model: db.ProductImage,
                  },
                ],
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

//***********ORDER SERVICE***********/
let createOrder = async (userId, data) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { shipping_address_id, payment_method_id, note } = data;
    // 1. Kiểm tra shipping address

    const shippingAddress = await db.ShippingAddress.findOne({
      where: {
        id: shipping_address_id,
        user_id: userId,
      },
      transaction,
    });

    if (!shippingAddress) {
      throw new Error("Shipping address does not belong to this user.");
    }
    // 2. Kiểm tra payment method
    const paymentMethod = await db.PaymentMethod.findByPk(payment_method_id, {
      transaction,
    });

    if (!paymentMethod) {
      throw new Error("Payment method not found.");
    }

    // 3. Lấy Cart

    const cartItems = await db.CartItem.findAll({
      where: {
        user_id: userId,
      },

      include: [
        {
          model: db.ProductVariant,

          include: [
            {
              model: db.Product,
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

      transaction,

      lock: transaction.LOCK.UPDATE,
    });

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Your cart is empty.");
    }

    // 4. Tính tiền + kiểm tra stock

    let initialPrice = 0;

    const orderItems = [];

    for (const cartItem of cartItems) {
      const variant = cartItem.ProductVariant;

      if (!variant) {
        throw new Error(
          `Product variant ${cartItem.product_variant_id} not found.`,
        );
      }

      // Kiểm tra stock

      if (variant.stock < cartItem.quantity) {
        throw new Error(
          `Product "${variant.Product.productName}" is not enough stock.`,
        );
      }

      // Giá sản phẩm

      const price = Number(variant.Product.price);

      const quantity = Number(cartItem.quantity);

      const subtotal = price * quantity;

      initialPrice += subtotal;

      orderItems.push({
        product_variant_id: variant.id,
        quantity: quantity,
        price: price,
        subtotal: subtotal,
      });
    }
    // 5. Shipping / Discount
    const shippingFee = 300000;

    const discountAmount = 0;

    const totalAmount = initialPrice + shippingFee - discountAmount;

    // 6. Tạo Order

    const order = await db.Order.create(
      {
        user_id: userId,

        shipping_address_id: shipping_address_id,

        payment_method_id: payment_method_id,

        total_amount: totalAmount,

        shipping_fee: shippingFee,

        discount_amount: discountAmount,

        initial_price: initialPrice,

        order_status: "pending",

        delivery_status: "pending",

        note: note || null,

        ordered_at: new Date(),
      },
      {
        transaction,
      },
    );

    // 7. Tạo OrderItems

    for (const item of orderItems) {
      await db.OrderItem.create(
        {
          order_id: order.id,

          product_variant_id: item.product_variant_id,

          quantity: item.quantity,

          price: item.price,

          subtotal: item.subtotal,
        },
        {
          transaction,
        },
      );
    }

    // 8. Trừ stock

    for (const cartItem of cartItems) {
      const variant = cartItem.ProductVariant;

      await variant.decrement("stock", {
        by: cartItem.quantity,

        transaction,
      });
    }
    // 9. Xóa Cart
    await db.CartItem.destroy({
      where: {
        user_id: userId,
      },

      transaction,
    });

    // 10. Commit

    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

let getOrderByUser = async (userId) => {
  try {
    const orders = await db.Order.findAll({
      where: {
        user_id: userId,
      },

      include: [
        {
          model: db.OrderItem,

          include: [
            {
              model: db.ProductVariant,

              include: [
                {
                  model: db.Product,

                  include: [
                    {
                      model: db.ProductImage,
                    },
                  ],
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
        },

        {
          model: db.ShippingAddress,
        },

        {
          model: db.PaymentMethod,
        },
      ],

      order: [["ordered_at", "DESC"]],
    });

    return orders;
  } catch (error) {
    console.error("getOrderByUser error:", error);

    throw error;
  }
};

let getOrderDetail = async (userId, orderId) => {
  const order = await db.Order.findOne({
    where: {
      id: orderId,
      user_id: userId,
    },
    include: [
      {
        model: db.ShippingAddress,
      },
      {
        model: db.PaymentMethod,
      },
      {
        model: db.OrderItem,
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
      },
    ],
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
};

let cancelOrder = async (userId, orderId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const order = await db.Order.findOne({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: [
        {
          model: db.OrderItem,
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    // Chỉ cho phép hủy khi đơn đang pending
    if (order.order_status !== "pending") {
      throw new Error("This order cannot be cancelled.");
    }

    // Trả lại stock
    for (const item of order.OrderItems) {
      const variant = await db.ProductVariant.findByPk(
        item.product_variant_id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      );

      if (variant) {
        await variant.increment("stock", {
          by: item.quantity,
          transaction,
        });
      }
    }

    // Cập nhật trạng thái
    order.order_status = "cancelled";
    order.delivery_status = "cancelled";

    await order.save({
      transaction,
    });

    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**************Payment service********************/

let getAllPaymentMethods = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const paymentMethods = await db.PaymentMethod.findAll({
        attributes: ["id", "method_name", "description"],
      });
      resolve(paymentMethods);
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
  createProduct,
  getAllCategories,
  getAllBrands,
  getAllColors,
  getAllSizes,
  getImagesByProductId,
  getCart,
  updateCartItem,
  deleteCartItem,
  getAllPaymentMethods,
  createOrder,
  getOrderByUser,
  getOrderDetail,
  cancelOrder,

  // getColors,
  // getSizes
};
