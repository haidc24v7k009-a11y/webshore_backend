"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: "product_id",
      });

      ProductVariant.belongsTo(models.Size, {
        foreignKey: "size_id",
      });

      ProductVariant.belongsTo(models.Color, {
        foreignKey: "color_id",
      });

      ProductVariant.hasMany(models.CartItem, {
        foreignKey: "product_variant_id",
      });

      ProductVariant.hasMany(models.OrderItem, {
        foreignKey: "product_variant_id",
      });
      ProductVariant.hasMany(models.ImportReceiptDetail, {
        foreignKey: "product_variant_id",
      });

    }
  }

  ProductVariant.init(
    {
      product_id: DataTypes.INTEGER,
      size_id: DataTypes.INTEGER,
      color_id: DataTypes.INTEGER,
      sku: DataTypes.STRING,
      stock: DataTypes.INTEGER,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ProductVariant",
    },
  );

  return ProductVariant;
};
