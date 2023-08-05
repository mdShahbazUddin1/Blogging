const express = require("express")
const userController = require("../controllers/user");
const { auth } = require("../middlewares/auth");
const userRoute = express.Router()

userRoute.post("/register",userController.register);
userRoute.post("/login",userController.login);
userRoute.get("/logout",auth,userController.logout);

module.exports = {
    userRoute
}