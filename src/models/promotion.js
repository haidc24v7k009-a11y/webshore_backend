"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    static associate(models) {
      Promotion.belongsToMany(models.Product, {
        through: models.PromotionProduct,
        foreignKey: "promotion_id",
        otherKey: "product_id",
      });
    }
  }

  Promotion.init(
    {
      promotion_name: DataTypes.STRING,
      promotion_code: DataTypes.STRING,
      discount_type: DataTypes.STRING,
      discount_value: DataTypes.DECIMAL(10, 2),
      min_order_value: DataTypes.DECIMAL(12, 2),
      max_discount: DataTypes.DECIMAL(12, 2),
      quantity: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
      per_user_limit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Promotion",
    },
  );

  return Promotion;
};
