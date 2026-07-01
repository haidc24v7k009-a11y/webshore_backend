"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
      });

      Product.belongsTo(models.Brand, {
        foreignKey: "brand_id",
      });

      Product.belongsToMany(models.Promotion, {
        through: models.PromotionProduct,
        foreignKey: "product_id",
        otherKey: "promotion_id",
      });

      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
      });

      Product.hasMany(models.ProductVariant, {
        foreignKey: "product_id",
      });

      Product.hasMany(models.Favorite, {
        foreignKey: "product_id",
      });
    }
  }

  Product.init(
    {
      category_id: DataTypes.INTEGER,
      brand_id: DataTypes.INTEGER,
      productName: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      productDescription: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
      featured: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    },
  );

  return Product;
};
