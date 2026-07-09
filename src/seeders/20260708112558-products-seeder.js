"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Products", [
      {
        category_id: 1,
        brand_id: 1,
        productName: "Nike Air Force 1",
        price: 2500000,
        productDescription: "Classic Sneaker",
        status: true,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 1,
        brand_id: 2,
        productName: "Adidas Superstar",
        price: 2200000,
        productDescription: "Adidas Classic",
        status: true,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};