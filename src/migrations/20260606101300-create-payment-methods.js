"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("paymentmethods", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      method_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      method_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: Sequelize.STRING,

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("paymentmethods");
  },
};
