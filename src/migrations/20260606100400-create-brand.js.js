"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("brands", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      brandName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      brandImage: Sequelize.STRING,

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("brands");
  },
};
