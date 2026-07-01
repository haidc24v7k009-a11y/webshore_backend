"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },

      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "brands",
          key: "id",
        },
      },

      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      productDescription: Sequelize.TEXT,

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("products");
  },
};
