"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("promotions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      promotion_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      promotion_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      discount_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      per_user_limit: {
        type: Sequelize.INTEGER,
      },

      min_order_value: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      max_discount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("promotions");
  },
};
