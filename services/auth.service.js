const { getDB } = require("../lib/helpers/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../lib/helpers/email");
const { Onboard, OTP } = require("../email_templates/auth.template");
const { generateOTP, verifyOTP : verifyOTPHelper } = require("../lib/helpers/otp");


// SIGN-UP
const createUserForSignup = async (body) => {

    const { password, email } = body;

    const user = await getDB()
        .collection("user")
        .findOne({ email });

    if (user) {
        return {
            status: 409,
            message: "Email Already Exists"
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await getDB().collection("user").insertOne({
        email,
        password: hashedPassword
    });

    await sendMail(
        email,
        Onboard.subject,
        Onboard.text
    );

    return {
        status: 201,
        message: "User Created"
    };
};


// LOGIN
const loginUser = async (body) => {

    const { email, password } = body;

    const user = await getDB()
        .collection("user")
        .findOne({ email });

    if (!user) {
        return {
            status: 400,
            message: "Credentials Not Found"
        };
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {
        return {
            status: 400,
            message: "Credentials Not Found"
        };
    }

    const token = jwt.sign(
        {
            email: user.email,
            id: user._id.toString()
        },
        process.env.SECRET_KEY
    );

    return {
        status: 200,
        message: "User Logged In Successful",
        token: token
    };
};


// FORGOT PASSWORD
const forgotPassword = async (body) => {

    const { email } = body;

    const user = await getDB().collection("user").findOne({ email });

    if (!user) {
        return {
            status: 404,
            message: "User Not Found"
        };
    }

    const { token, secret } = await generateOTP();

    console.log("Token", token);
    console.log("secret", secret);

    const otpExpiry = Date.now() + 5 * 60 * 1000;

    await getDB().collection("user").updateOne(
        { email },
        {
            $set: {
                otp: token,
                otpSecret: secret,
                otpExpiry: otpExpiry,
                otpVerified: false
            }
        }
    );

    const otpEmail = OTP(token);

    await sendMail(
        email,
        otpEmail.subject,
        otpEmail.text
    );

    return {
        status: 200,
        message: "OTP Sent Successfully"
    };
};


// VERIFY OTP
const verifyOTP = async (body) => {

    const { email, otp } = body;

    const user = await getDB()
        .collection("user")
        .findOne({ email });

    if (!user) {
        return {
            status: 404,
            message: "User Not Found"
        };
    }

    if (!user.otp || !user.otpSecret) {
        return {
            status: 400,
            message: "OTP Not Found"
        };
    }

    if (Date.now() > user.otpExpiry) {
        return {
            status: 400,
            message: "OTP Expired"
        };
    }

    const isOTPValid = await verifyOTPHelper(
        otp,
        user.otpSecret
    );

    if (!isOTPValid) {
        return {
            status: 400,
            message: "Invalid OTP"
        };
    }

    await getDB()
        .collection("user")
        .updateOne(
            { email },
            {
                $set: {
                    otpVerified: true
                }
            }
        );

    return {
        status: 200,
        message: "OTP Verified Successfully"
    };
};


// RESET PASSWORD
const resetPassword = async (body) => {

    const { email, password } = body;

    const user = await getDB()
        .collection("user")
        .findOne({ email });

    if (!user) {
        return {
            status: 404,
            message: "User Not Found"
        };
    }

    if (!user.otpVerified) {
        return {
            status: 400,
            message: "Please Verify OTP"
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await getDB().collection("user").updateOne(
        { email },
        {
            $set: {
                password: hashedPassword
            },
            $unset: {
                otp: "",
                otpSecret: "",
                otpExpiry: "",
                otpVerified: ""
            }
        }
    );

    return {
        status: 200,
        message: "Password Reset Successful"
    };
};


module.exports = {
    createUserForSignup,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword
};