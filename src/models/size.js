"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.hasMany(models.ProductVariant, {
        foreignKey: "size_id",
      });
    }
  }

  Size.init(
    {
      sizeNumber: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Size",
    },
  );

  return Size;
};
