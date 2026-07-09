"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Categories", [
      {
        categoryName: "Sneaker",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: "Running",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};