import axios from "axios";
const GHN_API_URL = process.env.GHN_API_URL;

const GHN_TOKEN = process.env.GHN_TOKEN;

const GHN_SHOP_ID = process.env.GHN_SHOP_ID;

const calculateFee = async (data) => {

    try {

        const response = await axios.post(
            `${GHN_API_URL}/v2/shipping-order/fee`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Token": GHN_TOKEN,
                    "ShopId": GHN_SHOP_ID
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "GHN calculate fee error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export default {
    calculateFee
};