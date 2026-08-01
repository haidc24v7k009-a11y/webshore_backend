import axios from "axios";
import db from "../models/index";
const ghnApi = axios.create({
    baseURL: "https://online-gateway.ghn.vn/shiip/public-api",
    headers: {
        Token: process.env.GHN_TOKEN
    }
});

const getProvinces = async () => {

    const response = await ghnApi.get("/master-data/province");

    return response.data.data;

};

const getDistricts = async (province_id) => {

    const response = await ghnApi.post(
        "/master-data/district",
        {
            province_id
        }
    );

    return response.data.data;

};

const getWards = async (district_id) => {

    const response = await ghnApi.post(
        "/master-data/ward",
        {
            district_id
        }
    );

    return response.data.data;

};


let getAllShippingAddress = async (userId) => {

    try {
        return await db.ShippingAddress.findAll({
            where: {
                user_id: userId
            },
            order:
                [
                    ["default_address", "DESC"],
                    ["createdAt", "DESC"]
                ]
        })
    } catch (e) {
        console.log(e)
        throw (e)
    }
}
let createAddress = async (userId, data) => {

    const transaction = await db.sequelize.transaction();
    try {
        // Validate
        if (!data.name_receiver)
            throw new Error("Receiver name is required.");

        if (!data.phone_number)
            throw new Error("Phone number is required.");

        if (!data.province)
            throw new Error("Province is required.");

        if (!data.district)
            throw new Error("District is required.");

        if (!data.ward)
            throw new Error("Ward is required.");

        if (!data.address_detail)
            throw new Error("Address detail is required.");
        // Nếu chưa có địa chỉ nào thì mặc định luôn
        const count = await db.ShippingAddress.count({

            where: {
                user_id: userId
            },
            transaction
        });
        if (count === 0) {
            data.default_address = true;
        }

        // Nếu người dùng chọn mặc định
        if (data.default_address === true) {
            await db.ShippingAddress.update(
                {
                    default_address: false
                },
                {
                    where: {
                        user_id: userId
                    },
                    transaction
                }
            );
        }
        const address = await db.ShippingAddress.create(
            {
                user_id: userId,

                province: data.province,
                province_code: data.province_code,

                district: data.district,
                district_code: data.district_code,

                ward: data.ward,
                ward_code: data.ward_code,

                address_detail: data.address_detail,

                name_receiver: data.name_receiver,

                phone_number: data.phone_number,

                default_address: data.default_address
            },
            {
                transaction
            }
        );
        await transaction.commit();
        return address;

    } catch (error) {
        await transaction.rollback();

        console.error("========== ERROR ==========");
        console.error(error);
        console.error(error.stack);
        console.error("===========================");

    }

};

let updateAddress = async (userId, id, data) => {
    const transaction = await db.sequelize.transaction();
    try {
        const address = await db.ShippingAddress.findOne({
            where: {
                id,
                user_id: userId
            },
            transaction
        });
        if (!address) {
            throw new Error("Shipping address not found.");
        }
        if (data.default_address) {
            await db.ShippingAddress.update(

                {
                    default_address: false
                },
                {
                    where: {
                        user_id: userId
                    },
                    transaction
                }
            );
        }
        await address.update(
            {
                province: data.province,
                province_code: data.province_code,
                district: data.district,
                district_code: data.district_code,
                ward: data.ward,
                ward_code: data.ward_code,
                address_detail: data.address_detail,
                name_receiver: data.name_receiver,
                phone_number: data.phone_number,
                default_address: data.default_address
            },
            {
                transaction
            }
        );
        await transaction.commit();
        return address;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

};
let deleteAddress = async (userId, id) => {

    const transaction = await db.sequelize.transaction();
    try {
        const address = await db.ShippingAddress.findOne({
            where: {
                id,
                user_id: userId
            },
            transaction
        });
        if (!address) {
            throw new Error("Shipping address not found.");
        }
        const isDefault = address.default_address;
        await address.destroy({
            transaction
        });
        // Nếu xóa địa chỉ mặc định
        if (isDefault) {
            const nextAddress = await db.ShippingAddress.findOne({
                where: {
                    user_id: userId
                },
                order: [

                    ["createdAt", "ASC"]
                ],
                transaction
            });
            if (nextAddress) {
                nextAddress.default_address = true;
                await nextAddress.save({
                    transaction
                });
            }
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
let setDefaultAddress = async (userId, id) => {
    const transaction = await db.sequelize.transaction();
    try {
        const address = await db.ShippingAddress.findOne({
            where: {
                id,
                user_id: userId
            },
            transaction
        });
        if (!address) {
            throw new Error("Shipping address not found.");
        }
        await db.ShippingAddress.update(
            {
                default_address: false
            },
            {
                where: {
                    user_id: userId
                },
                transaction
            }
        );
        address.default_address = true;
        await address.save({
            transaction
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;

    }

};
export default {
    getProvinces,
    getDistricts,
    getWards,
    getAllShippingAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};