'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeRefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmployeeRefreshToken.belongsTo(models.Employee, {
        foreignKey: "employee_id"
      });
    }
  }
  EmployeeRefreshToken.init({
    employee_id: DataTypes.INTEGER,
    refresh_token: DataTypes.STRING,
    device_info: DataTypes.STRING,
    revoked: DataTypes.BOOLEAN,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'EmployeeRefreshToken',
  });
  return EmployeeRefreshToken;
};