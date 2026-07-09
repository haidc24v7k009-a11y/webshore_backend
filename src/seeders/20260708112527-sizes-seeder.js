"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Sizes", [
      { sizeNumber: 39, status: true, deleted: false, createdAt: new Date(), updatedAt: new Date() },
      { sizeNumber: 40, status: true, deleted: false, createdAt: new Date(), updatedAt: new Date() },
      { sizeNumber: 41, status: true, deleted: false, createdAt: new Date(), updatedAt: new Date() },
      { sizeNumber: 42, status: true, deleted: false, createdAt: new Date(), updatedAt: new Date() },
      { sizeNumber: 43, status: true, deleted: false, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Sizes", null, {});
  },
};