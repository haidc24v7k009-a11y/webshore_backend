"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ImportReceipt extends Model {
    static associate(models) {

      ImportReceipt.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
      });

      ImportReceipt.belongsTo(models.Employee, {
        foreignKey: "employee_id",
      });

      ImportReceipt.hasMany(models.ImportReceiptDetail, {
        foreignKey: "import_receipt_id",
      });

    }
  }

  ImportReceipt.init(
    {
      supplier_id: DataTypes.INTEGER,
      employee_id: DataTypes.INTEGER,
      import_date: DataTypes.DATE,
      confirm_date: DataTypes.DATE,
      total: DataTypes.DECIMAL(12, 2),
      note: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ImportReceipt",
      tableName: "ImportReceipts",
      timestamps: false,
    }
  );

  return ImportReceipt;
};