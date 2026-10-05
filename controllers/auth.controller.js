const {
    createUserForSignup,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword
} = require("../services/auth.service");

// sign-up controller 

const signUpController = async (req, res) => {

    const result = await createUserForSignup(req.body);

    return res.status(result.status).send(result.message);
};

// login controller

const loginController = async (req, res) => {

    const result = await loginUser(req.body);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    return res.status(result.status).send({
        message: result.message,
        token: result.token
    });
};

// forgot password controller

const forgotPasswordController = async(req, res) => {

    const result = await forgotPassword(req.body);

    return res.status(result.status).send(result.message);
};

// verify OTP controller

const verifyOtpController = async(req, res) => {
    
    const result = await verifyOTP(req.body);

    return res.status(result.status).send(result.message);
};

// reset password controller

const resetPasswordController = async(req, res) => {

    const result = await resetPassword(req.body);

    return res.status(result.status).send(result.message)
}

module.exports = {
    signUpController, loginController, forgotPasswordController, verifyOtpController, resetPasswordController
}