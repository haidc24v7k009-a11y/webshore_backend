"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.User, {
        foreignKey: "user_id",
      });

      CartItem.belongsTo(models.ProductVariant, {
        foreignKey: "product_variant_id",
      });
    }
  }

  CartItem.init(
    {
      user_id: DataTypes.INTEGER,
      product_variant_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CartItem",
    },
  );

  return CartItem;
};
