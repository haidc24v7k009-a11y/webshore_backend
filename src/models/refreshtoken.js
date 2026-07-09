"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model { }

  RefreshToken.init(
    {
      account_id: DataTypes.INTEGER,

      account_type: DataTypes.ENUM("user", "employee"),

      refresh_token: DataTypes.STRING,

      device_info: DataTypes.STRING,

      revoked: DataTypes.BOOLEAN,

      expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "RefreshTokens",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  return RefreshToken;
};