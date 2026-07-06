"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ImportReceiptDetail extends Model {
    static associate(models) {

      ImportReceiptDetail.belongsTo(models.ImportReceipt, {
        foreignKey: "import_receipt_id",
      });

      ImportReceiptDetail.belongsTo(models.Product, {
        foreignKey: "product_id",
      });

    }
  }

  ImportReceiptDetail.init(
    {
      import_receipt_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "ImportReceiptDetail",
      tableName: "ImportReceiptDetails",
      timestamps: false,
    }
  );

  return ImportReceiptDetail;
};