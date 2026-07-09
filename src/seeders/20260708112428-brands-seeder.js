"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Brands", [
      {
        brandName: "Nike",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        brandName: "Adidas",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        brandName: "Puma",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Brands", null, {});
  },
};