"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate(models) {
      Color.hasMany(models.ProductVariant, {
        foreignKey: "color_id",
      });
    }
  }

  Color.init(
    {
      colorName: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Color",
    },
  );

  return Color;
};
