"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
      });

      Order.belongsTo(models.PaymentMethod, {
        foreignKey: "payment_method_id",
      });

      Order.belongsTo(models.ShippingAddress, {
        foreignKey: "shipping_address_id",
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
      });
    }
  }

  Order.init(
    {
      user_id: DataTypes.INTEGER,
      shipping_address_id: DataTypes.INTEGER,
      payment_method_id: DataTypes.INTEGER,
      total_amount: DataTypes.DECIMAL(12, 2),
      shipping_fee: DataTypes.DECIMAL(12, 2),
      discount_amount: DataTypes.DECIMAL(12, 2),
      order_status: DataTypes.STRING,
      delivery_status: DataTypes.STRING,
      note: DataTypes.TEXT,
      ordered_at: DataTypes.DATE,
      delivery_date: DataTypes.DATE,
      initinal_price: DataTypes.DECIMAL(12, 2),
    },
    {
      sequelize,
      modelName: "Order",
    },
  );

  return Order;
};
