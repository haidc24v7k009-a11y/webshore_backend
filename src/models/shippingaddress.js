"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    static associate(models) {
      ShippingAddress.belongsTo(models.User, {
        foreignKey: "user_id",
      });

      ShippingAddress.hasMany(models.Order, {
        foreignKey: "shipping_address_id",
      });
    }
  }

  ShippingAddress.init(
    {
      user_id: DataTypes.INTEGER,
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,
      address_detail: DataTypes.STRING,
      name_receiver: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      default_address: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ShippingAddress",
    },
  );

  return ShippingAddress;
};
