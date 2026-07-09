"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      Supplier.hasMany(models.ImportReceipt, {
        foreignKey: "supplier_id",
      });
    }
  }

  Supplier.init(
    {
      supplierName: DataTypes.STRING,
      representative: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Supplier",
      tableName: "Suppliers",
      timestamps: false,
    }
  );

  return Supplier;
};