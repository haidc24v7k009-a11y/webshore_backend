import db from "../models/index";
import LocationService from "../services/locations.service";


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
export default {
    getAllAddress,
    getProvinces,
    getDistricts,
    getWards,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
