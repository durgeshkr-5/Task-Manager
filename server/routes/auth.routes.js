const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");

const authRouter = express.Router();


// signup
authRouter.post("/signup",registerUser);
//login
authRouter.post("/login",loginUser);


module.exports = authRouter;