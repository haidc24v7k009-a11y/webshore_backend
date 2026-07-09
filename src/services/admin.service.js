import db from "../models/index";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { randomBytes } from "crypto";
env.config();

let getAllSuppliers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let suppliers = await db.Supplier.findAll({
            });
            resolve(suppliers);
        } catch (error) {
            reject(error);
            throw new Error("Error retrieving suppliers: " + error.message);
        }
    });
}

let getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.Product.findAll({
            });
            resolve(products);
        } catch (error) {
            reject(error);
            throw new Error("Error retrieving products: " + error.message);
        }
    });
}

let getAllSizes = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let sizes = await db.Size.findAll({
            });
            resolve(sizes);
        } catch (error) {
            reject(error);
            throw new Error("Error retrieving sizes: " + error.message);
        }
    });
}

let getAllColors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let colors = await db.Color.findAll({
            });
            resolve(colors);
        } catch (error) {
            reject(error);
            throw new Error("Error retrieving colors: " + error.message);
        }
    });
}

export default {
    getAllSuppliers,
    getAllProducts,
    getAllSizes,
    getAllColors
};