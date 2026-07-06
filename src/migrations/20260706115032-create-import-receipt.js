"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ImportReceipts", {
      import_receipt_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Suppliers",
          key: "supplier_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Employees",
          key: "employee_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      import_date: Sequelize.DATE,

      confirm_date: Sequelize.DATE,

      note: Sequelize.TEXT,

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("ImportReceipts");
  },
};