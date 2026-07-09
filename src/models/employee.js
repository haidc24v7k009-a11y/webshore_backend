'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasMany(models.RefreshToken, {
        foreignKey: "employee_id"
      });

      Employee.belongsTo(models.Role, {
        foreignKey: "role_id",
      });

      Employee.hasMany(models.ImportReceipt, {
        foreignKey: "employee_id",
      });

      Employee.hasMany(models.Order, {
        foreignKey: "employee_id",
      });
    }
  }
  Employee.init({
    full_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    lastLogin: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Employee',

  });
  return Employee;
};