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
      supplier_name: DataTypes.STRING,
      representative: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      create_date: DataTypes.DATE,
      update_date: DataTypes.DATE,
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