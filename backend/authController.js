const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router(); // ✅ यह Line Missing थी!

const SECRET_KEY = "my_super_secret_123!";

// Temporary user database (Replace this with MongoDB later)
const users = [];

// Signup Route
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: "Signup successful!" });
});

// Login Route (Debugging Added)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const user = users.find(user => user.username === username);
    if (!user) {
        console.log("❌ User not found:", username);
        return res.status(401).json({ message: "Invalid username or password!" });
    }

    console.log("🔹 Stored Hashed Password:", user.password);
    console.log("🔹 Entered Password:", password);

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔹 Password Match:", isMatch);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password!" });
    }

    // Generate JWT Token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token });
});

module.exports = router;
