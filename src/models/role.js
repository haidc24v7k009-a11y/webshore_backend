"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.Employee, {
        foreignKey: "role_id",
      });
    }
  }

  Role.init(
    {
      role_name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "Roles",
      timestamps: false,
    }
  );

  return Role;
};