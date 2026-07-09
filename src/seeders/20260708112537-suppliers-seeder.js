"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Suppliers", [
      {
        supplierName: "Nike Vietnam",
        representative: "Nguyen Van A",
        phone: "0901234567",
        email: "nike@gmail.com",
        address: "Ho Chi Minh",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        supplierName: "Adidas Vietnam",
        representative: "Tran Van B",
        phone: "0912345678",
        email: "adidas@gmail.com",
        address: "Ha Noi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Suppliers", null, {});
  },
};