"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      shipping_address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "shippingaddresses",
          key: "id",
        },
      },

      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "paymentmethods",
          key: "id",
        },
      },

      initinal_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      shipping_fee: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      discount_amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },

      order_status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },

      delivery_status: {
        type: Sequelize.STRING,
        defaultValue: "waiting",
      },

      note: Sequelize.TEXT,

      ordered_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      delivery_date: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("orders");
  },
};
