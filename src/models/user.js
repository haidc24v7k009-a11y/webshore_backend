"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.RefreshToken, {
        foreignKey: "user_id",
        as: "refreshTokens",
      });

      User.hasMany(models.Favorite, {
        foreignKey: "user_id",
      });

      User.hasMany(models.CartItem, {
        foreignKey: "user_id",
      });

      User.hasMany(models.Order, {
        foreignKey: "user_id",
      });

      User.hasMany(models.ShippingAddress, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      avatar: DataTypes.STRING,
      role: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      lastLogin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
