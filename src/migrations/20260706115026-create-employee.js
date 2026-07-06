"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Employees", {
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Roles",
          key: "role_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },

      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      gender: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },

      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Employees");
  },
};