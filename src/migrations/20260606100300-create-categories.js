"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      categoryName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      categoryImage: Sequelize.STRING,

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
    await queryInterface.dropTable("categories");
  },
};
