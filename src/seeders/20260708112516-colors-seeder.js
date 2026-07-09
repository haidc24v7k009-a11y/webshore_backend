"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Colors", [
      {
        colorName: "Black",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        colorName: "White",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        colorName: "Red",
        status: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Colors", null, {});
  },
};