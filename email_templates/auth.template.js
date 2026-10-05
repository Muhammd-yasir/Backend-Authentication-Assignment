const Onboard = {
    subject: "Welcome Onboard",
    text: "Thanks for selecting us"
};

const OTP = (otp) => {
    return {
        subject : "Email Verification OTP", 
        text : `Your OTP for email verification is ${otp}
        This OTP will expire in 5 minutes`
    };
};


module.exports = { Onboard, OTP }