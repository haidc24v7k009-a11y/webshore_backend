import db from "../models/index";
import adminService from "../services/admin.service";

let initImportReceipt = async (req, res) => {
    return new Promise(async (resolve, reject) => {

        try {
            let suppliers = await adminService.getAllSuppliers();
            let products = await adminService.getAllProducts();
            let sizes = await adminService.getAllSizes();
            let colors = await adminService.getAllColors();
            let brands = await adminService.getAllBrands();
            let categories = await adminService.getAllCategories()
            let importReceipts = await adminService.getImportReceipts()
            return res.status(200).json({
                suppliers: suppliers,
                products: products,
                sizes: sizes,
                colors: colors,
                brands: brands,
                importReceipts: importReceipts,
            });
        } catch (error) {
            console.error("Error initializing import receipt:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    })

}
let initImportReceiptData = async (req, res) => {

    try {
        const result = await adminService.getImportReceipts();

        return res.status(200).json({
            message: "Import receipt confirmed successfully",
            data: result
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "LOAD FAIL",
            error: error.message
        });
    }
}

let createImportReceipt = async (req, res) => {
    try {
        // Chỉ employee được tạo phiếu nhập
        if (req.accountType !== "employee") {
            return res.status(403).json({
                message: "Only employees can create import receipts"
            });
        }

        // req.user là Employee lấy từ database
        const employeeId = req.user.id;

        const result = await adminService.createImportReceipt(
            req.body,
            employeeId
        );

        return res.status(201).json({
            message: "Create import receipt successfully",
            data: result
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Create import receipt failed",
            error: error.message
        });
    }
};

let confirmImportReceipt = async (req, res) => {
    try {
        if (req.accountType !== "employee") {
            return res.status(403).json({
                message: "Only employees can confirm import receipts"
            });
        }

        const receiptId = req.params.id;

        const result = await adminService.confirmImportReceipt(receiptId);

        return res.status(200).json({
            message: "Import receipt confirmed successfully",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export default {
    initImportReceipt,
    createImportReceipt,
    confirmImportReceipt
}