const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
require("dotenv").config();

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  //  Input Validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "All fields (name, email, password) are required" });
  }

  try {
    // check email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    //  Check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧑 Create a new user instance
    const newUser = new User({ name, email, password: hashedPassword });

    //  Save user to MongoDB
    await newUser.save();

    //  Generate a JWT token for immediate login
    const token = jwt.sign(
      { _id: newUser._id.toString(), email: newUser.email }, // Payload
      process.env.JWT_SECRET, // Use environment variable
      { expiresIn: "1h" } // Token expiration
    );

    //  Send success response with token
    return res
      .status(201)
      .json({ message: "User created successfully", token, user: { id: newUser._id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    // 🚨 Handle unexpected errors (e.g., database connection issues)
    console.error("Signup error:", error);

    // Avoid exposing raw error messages to client
    res.status(500).json({ error: "Internal server error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //  Input Validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "All fields (email, password) are required" });
  }

  try {
    // check email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    //  Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    //  Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    //  Generate a JWT token
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email }, // Payload
      process.env.JWT_SECRET, // Use environment variable
      { expiresIn: "1h" } // Token expiration
    );

    //  Send success response with token
    return res
      .status(200)
      .json({ message: "Login successful", token, user: { id: user._id, email: user.email } });
  } catch (error) {
    // Handle unexpected errors 
    console.error("Login error:", error);

    // Avoid exposing raw error messages to client
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { registerUser, loginUser };
