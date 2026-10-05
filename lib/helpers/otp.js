const { generateSecret, generate, verify } = require("otplib");

const generateOTP = async() => {

    const secret = generateSecret();

    const token = await generate({
        secret
    });

    return{
        token, 
        secret
    };
};

const verifyOTP = async (token, secret) => {

    const isInValid = await verify({
        token, 
        secret
    });

    return isInValid;

}

module.exports = { generateOTP, verifyOTP }