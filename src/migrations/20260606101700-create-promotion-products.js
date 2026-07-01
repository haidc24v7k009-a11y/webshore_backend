"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("promotionproducts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      promotion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "promotions",
          key: "id",
        },
        onDelete: "CASCADE",
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

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("promotionproducts", {
      fields: ["promotion_id", "product_id"],
      type: "unique",
      name: "unique_promotion_product",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("promotionproducts");
  },
};
