"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: "category_id",
      });
    }
  }

  Category.init(
    {
      categoryName: DataTypes.STRING,
      categoryImage: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Category",
    },
  );

  return Category;
};
