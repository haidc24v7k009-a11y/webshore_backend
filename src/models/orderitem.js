"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
      });

      OrderItem.belongsTo(models.ProductVariant, {
        foreignKey: "product_variant_id",
      });
    }
  }

  OrderItem.init(
    {
      order_id: DataTypes.INTEGER,
      product_variant_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(12, 2),
      subtotal: DataTypes.DECIMAL(12, 2),
    },
    {
      sequelize,
      modelName: "OrderItem",
    },
  );

  return OrderItem;
};
