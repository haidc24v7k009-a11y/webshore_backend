"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Roles", {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      role_name: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Roles");
  },
};