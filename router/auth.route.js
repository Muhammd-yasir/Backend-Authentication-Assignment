const { Router } = require("express");
const { 
    signupSchema, 
    signinSchema, 
    resetPasswordSchema, 
    verifyOtpSchema 
} = require("../validations/auth.validation");
const { 
    signUpController, 
    loginController,  
    forgotPasswordController, 
    verifyOtpController, 
    resetPasswordController
} = require("../controllers/auth.controller");

const validationMiddleware = require("../middleware/validation.middleware");

const router = Router();

// SignUp
router.post("/sign-up",
    validationMiddleware(signupSchema),
    signUpController
);

// Login
router.post("/login",
    validationMiddleware(signinSchema),
    loginController
);

// forget- password 
router.post("/forgot-password", forgotPasswordController);

// verify-otp
router.post("/verify-otp", validationMiddleware(verifyOtpSchema), verifyOtpController);

// reset-password
router.post("/reset-password", validationMiddleware(resetPasswordSchema), resetPasswordController);
   

module.exports = { authRouter: router }