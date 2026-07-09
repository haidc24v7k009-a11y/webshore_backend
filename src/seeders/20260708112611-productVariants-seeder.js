"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("ProductVariants", [

      {
        product_id: 1,
        color_id: 1,
        size_id: 2,
        stock: 20,
        sku: "AF1-BLK-40",
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        product_id: 1,
        color_id: 1,
        size_id: 3,
        stock: 15,
        sku: "AF1-BLK-41",
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        product_id: 1,
        color_id: 2,
        size_id: 2,
        stock: 10,
        sku: "AF1-WHT-40",
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        product_id: 2,
        color_id: 3,
        size_id: 2,
        stock: 25,
        sku: "ADS-RED-40",
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ProductVariants", null, {});
  },
};