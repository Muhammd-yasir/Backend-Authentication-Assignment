const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendMail(
    to,
    subject,
    text,
    html,
    from = "Muhammad Yasir <yasir193019@gmail.com>"
) {
    const response = await transporter.sendMail({
        from,
        to,
        text,
        html,
        subject
    });

    return response;
};

module.exports = sendMail

