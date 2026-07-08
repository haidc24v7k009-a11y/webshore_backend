"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RefreshTokens", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      account_type: {
        type: Sequelize.ENUM("user", "employee"),
        allowNull: false,
      },

      refresh_token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      device_info: {
        type: Sequelize.STRING,
      },

      revoked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      lastLogin: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("RefreshTokens");
  }
};