"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.hasMany(models.Order, {
        foreignKey: "payment_method_id",
      });
    }
  }

  PaymentMethod.init(
    {
      method_name: DataTypes.STRING,
      method_code: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PaymentMethod",
    },
  );

  return PaymentMethod;
};
