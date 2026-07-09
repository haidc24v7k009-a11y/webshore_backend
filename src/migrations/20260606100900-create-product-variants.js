"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("productvariants", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      size_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "sizes",
          key: "id",
        },
      },

      color_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "colors",
          key: "id",
        },
      },

      sku: {
        type: Sequelize.STRING,
        unique: true,
      },

      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("productvariants");
  },
};
