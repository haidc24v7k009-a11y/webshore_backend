"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ImportReceiptDetails", {
      import_receipt_detail_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      import_receipt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ImportReceipts",
          key: "import_receipt_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      create_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      update_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ImportReceiptDetails");
  },
};