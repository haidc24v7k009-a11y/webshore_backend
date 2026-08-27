import db from "../models/index";
import LocationService from "../services/locations.service";
import ghnService from "../services/ghn.service";

let getAllAddress = async (req, res) => {

    try {
        const addresses = await LocationService.getAllShippingAddress(req.user.id);
        return res.status(200).json({
            errCode: 0,
            data: addresses
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: e.message
        });
    }
};

const getProvinces = async (req, res) => {
    try {
        const data = await LocationService.getProvinces();
        return res.status(200).json({
            errCode: 0,
            data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            errCode: -1,
            message: error.message
        });

    }

};

const getDistricts = async (req, res) => {
    try {
        const { province_id } = req.body;
        const data = await LocationService.getDistricts(province_id);
        return res.status(200).json({
            errCode: 0,
            data
        });
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: error.message
        });
    }
};
const getWards = async (req, res) => {
    try {
        const { district_id } = req.body;
        const data = await LocationService.getWards(district_id);
        return res.status(200).json({
            errCode: 0,
            data
        });

    } catch (error) {

        return res.status(500).json({
            errCode: -1,
            message: error.message
        });

    }

};

let createAddress = async (req, res) => {

    try {

        const response = await LocationService.createAddress(
            req.user.id,
            req.body
        );

        return res.status(200).json({

            errCode: 0,
            message: "Create shipping address successfully.",
            data: response

        });

    } catch (error) {

        console.error("========== ERROR ==========");
        console.error(error);
        console.error(error.stack);
        console.error("===========================");
        return res.status(500).json({

            errCode: -1,
            message: error.message

        });

    }

};

let updateAddress = async (req, res) => {

    try {

        const result = await LocationService.updateAddress(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({

            errCode: 0,

            message: "Update shipping address successfully.",

            data: result

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            errCode: -1,

            message: error.message

        });

    }

};

let deleteAddress = async (req, res) => {

    try {

        await LocationService.deleteAddress(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({

            errCode: 0,
            message: "Delete shipping address successfully."

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            errCode: -1,
            message: error.message

        });

    }

};

let setDefaultAddress = async (req, res) => {
    try {
        await LocationService.setDefaultAddress(
            req.user.id,
            req.params.id
        );
        return res.status(200).json({
            errCode: 0,
            message: "Default address updated."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errCode: -1,
            message: error.message
        });
    }
};

let calculateShippingFee = async (req, res) => {
    try {
        const userId = req.user.id;

        const { shipping_address_id } = req.body;

        // 1. Lấy địa chỉ

        const address = await db.ShippingAddress.findOne({
            where: {
                id: shipping_address_id,
                user_id: userId,
            },
        });

        if (!address) {
            return res.status(404).json({
                errCode: -1,
                message: "Shipping address not found",
            });
        }

        // 2. Lấy Cart

        const cartItems = await db.CartItem.findAll({
            where: {
                user_id: userId,
            },

            include: [
                {
                    model: db.ProductVariant,

                    include: [
                        {
                            model: db.Product,
                        },
                    ],
                },
            ],
        });

        if (!cartItems.length) {
            return res.status(400).json({
                errCode: -1,
                message: "Cart is empty",
            });
        }

        // 3. Tính trọng lượng

        let totalWeight = 0;

        cartItems.forEach((item) => {
            // Tạm thời:
            // 1 đôi giày = 1000 gram

            const weightPerItem = 1000;

            totalWeight += weightPerItem * item.quantity;
        });

        // 4. Giới hạn GHN

        if (totalWeight > 1600000) {
            return res.status(400).json({
                errCode: -1,
                message: "Package weight exceeds GHN limit",
            });
        }

        // 5. Request GHN

        const ghnData = {
            service_type_id: 2,

            to_district_id: Number(address.district_code),

            to_ward_code: address.ward_code,

            weight: totalWeight,

            length: 30,

            width: 20,

            height: 15,

            insurance_value: 0,

            coupon: null,

            items: cartItems.map((item) => ({
                name: item.ProductVariant?.Product?.productName || "Product",

                quantity: item.quantity,

                weight: 1000,

                length: 30,

                width: 20,

                height: 15,
            })),
        };

        console.log("GHN FEE REQUEST:", ghnData);

        // 6. Gọi GHN

        const ghnResponse = await ghnService.calculateFee(ghnData);

        if (!ghnResponse || ghnResponse.code !== 200) {
            return res.status(400).json({
                errCode: -1,

                message: ghnResponse?.message || "Cannot calculate shipping fee",
            });
        }

        // 7. Response frontend

        return res.status(200).json({
            errCode: 0,

            message: "Calculate shipping fee successfully",

            data: {
                shipping_fee: ghnResponse.data.total,

                service_fee: ghnResponse.data.service_fee,

                insurance_fee: ghnResponse.data.insurance_fee,

                coupon_value: ghnResponse.data.coupon_value,
            },
        });
    } catch (error) {
        console.error("calculateShippingFee:", error.response?.data || error);
        console.log("GHN TOKEN:", process.env.GHN_TOKEN);
        console.log("GHN SHOP ID:", process.env.GHN_SHOP_ID);
        return res.status(500).json({
            errCode: -1,

            message: "Server error",
        });
    }
};


export default {
    calculateShippingFee,
    getAllAddress,
    getProvinces,
    getDistricts,
    getWards,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
