"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product, {
        foreignKey: "brand_id",
      });
    }
  }

  Brand.init(
    {
      brandName: DataTypes.STRING,
      brandImage: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Brand",
    },
  );

  return Brand;
};
