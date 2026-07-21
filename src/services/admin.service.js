import db from "../models/index";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { randomBytes } from "crypto";
import { rejects } from "assert";
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

let getAllBrands = () => {
    return new Promise(async (resolve, rejects) => {
        try {
            let brands = await db.Brand.findAll();
            resolve(brands);
        } catch (error) {
            rejects(error)
        }
    })
}

let getAllCategories = () => {
    return new Promise(async (resolve, rejects) => {
        try {
            let categories = await db.Category.findAll();
            resolve(categories);
        } catch (error) {
            rejects(error)
        }
    })
}

let getImportReceipts = async () => {
    return await db.ImportReceipt.findAll({
        include: [
            {
                model: db.Supplier
            },
            {
                model: db.Employee
            },
            {
                model: db.ImportReceiptDetail,
                include: [
                    {
                        model: db.Product
                    },
                    {
                        model: db.Color
                    },
                    {
                        model: db.Size
                    }
                ]
            }
        ],
        order: [
            ["id", "DESC"]
        ]
    });
};

let createImportReceiptDetail = async (
    data,
    importReceiptId,
    transaction
) => {
    const details = data.details.map(item => ({
        import_receipt_id: importReceiptId,
        product_id: item.product_id,
        color_id: item.color_id,
        size_id: item.size_id,
        quantity: item.quantity,
        subtotal: item.subtotal
    }));

    return await db.ImportReceiptDetail.bulkCreate(
        details,
        { transaction }
    );
};

let createImportReceipt = async (data, employeeId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const importReceipt = await db.ImportReceipt.create({
            supplier_id: data.supplier_id,
            employee_id: employeeId,
            import_date: data.import_date,
            confirm_date: null,
            note: data.note,
            status: 0,
            total: data.total
        }, { transaction });

        await createImportReceiptDetail(
            data,
            importReceipt.id,
            transaction
        );

        await transaction.commit();

        return importReceipt;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

let confirmImportReceipt = async (receiptId) => {
    const transaction = await db.sequelize.transaction();

    try {
        // 1. Tìm phiếu nhập
        const receipt = await db.ImportReceipt.findByPk(receiptId, {
            transaction
        });

        if (!receipt) {
            throw new Error("Import receipt not found");
        }

        // Tránh xác nhận 2 lần
        if (receipt.status === 1) {
            throw new Error("Import receipt already confirmed");
        }

        // 2. Lấy chi tiết phiếu nhập
        const details = await db.ImportReceiptDetail.findAll({
            where: {
                import_receipt_id: receiptId
            },
            transaction
        });

        // 3. Duyệt từng chi tiết
        for (const item of details) {

            // Tìm variant theo product + color + size
            const variant = await db.ProductVariant.findOne({
                where: {
                    product_id: item.product_id,
                    color_id: item.color_id,
                    size_id: item.size_id
                },
                transaction
            });

            if (variant) {
                // Variant đã có → cộng tồn kho
                await variant.increment(
                    {
                        stock: item.quantity
                    },
                    {
                        transaction
                    }
                );
            } else {
                // Variant chưa có → tạo mới
                await db.ProductVariant.create(
                    {
                        product_id: item.product_id,
                        color_id: item.color_id,
                        size_id: item.size_id,
                        stock: item.quantity,
                        deleted: false
                    },
                    { transaction }
                );
            }
        }

        // 4. Cập nhật trạng thái phiếu nhập
        await receipt.update(
            {
                status: 1,
                confirm_date: new Date()
            },
            { transaction }
        );

        await transaction.commit();

        return receipt;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export default {
    //----------InitData-----------//
    getAllSuppliers,
    getAllProducts,
    getAllSizes,
    getAllColors,
    getAllBrands,
    getAllCategories,
    getImportReceipts,

    //----------ImportReceipt--Service-----------//
    createImportReceiptDetail,
    createImportReceipt,
    confirmImportReceipt
};