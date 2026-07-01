"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  RefreshToken.init(
    {
      user_id: DataTypes.INTEGER,
      refresh_token: DataTypes.TEXT,
      device_info: DataTypes.STRING,
      revoked: DataTypes.BOOLEAN,
      expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "RefreshToken",
    },
  );

  return RefreshToken;
};
