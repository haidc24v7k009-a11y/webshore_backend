import db from "../models/index";
import adminService from "../services/admin.service";

let initImportReceipt = async (req, res) => {
    return new Promise(async (resolve, reject) => {

        try {
            let suppliers = await adminService.getAllSuppliers();
            let products = await adminService.getAllProducts();
            let sizes = await adminService.getAllSizes();
            let colors = await adminService.getAllColors();
            resolve(res.render("importReceipt.ejs", {
                suppliers: suppliers,
                products: products,
                sizes: sizes,
                colors: colors
            }));
        } catch (error) {
            console.error("Error initializing import receipt:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    })

}

export default {
    initImportReceipt
}