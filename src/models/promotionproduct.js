"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PromotionProduct extends Model {
    static associate(models) {
      PromotionProduct.belongsTo(models.Promotion, {
        foreignKey: "promotion_id",
      });

      PromotionProduct.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }

  PromotionProduct.init(
    {
      promotion_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PromotionProduct",
    },
  );

  return PromotionProduct;
};
