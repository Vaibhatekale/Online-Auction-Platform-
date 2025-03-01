const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const SECRET_KEY = "my_super_secret_123!";

// ✅ Connect to MongoDB with error handling
mongoose
  .connect("mongodb://127.0.0.1:27017/auctionDB")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Connection Error ❌:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ✅ Auction Item Schema
const auctionItemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  currentBid: Number,
  highestBidder: String,
  closingTime: Date,
  isClosed: { type: Boolean, default: false },
});

const AuctionItem = mongoose.model("AuctionItem", auctionItemSchema);

// ✅ Middleware for Authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// ✅ Root Route (Fix "Cannot GET /" Error)
app.get("/", (req, res) => {
  res.send("Server is Running! ✅");
});

// ✅ Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Signin Route
app.post("/api/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Signin successful", token });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Login Route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Logout Route
app.post("/api/logout", authenticate, (req, res) => {
  res.json({ message: "Logout successful" });
});

// ✅ Get all auction items
app.get("/api/auctions", async (req, res) => {
  try {
    const auctions = await AuctionItem.find();
    res.json(auctions);
  } catch (error) {
    console.error("Fetching Auctions Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Create a new auction item
app.post("/api/auctions", async (req, res) => {
  try {
    const { itemName, description, currentBid, closingTime } = req.body;
    const newAuction = new AuctionItem({ itemName, description, currentBid, closingTime });
    await newAuction.save();

    res.status(201).json({ message: "Auction created successfully" });
  } catch (error) {
    console.error("Auction Creation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Place a Bid
app.post("/api/bids", async (req, res) => {
  try {
    const { auctionId, bidderName, bidAmount } = req.body;
    const auction = await AuctionItem.findById(auctionId);

    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (bidAmount <= auction.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than current bid" });
    }

    auction.currentBid = bidAmount;
    auction.highestBidder = bidderName;
    await auction.save();

    res.json({ message: "Bid placed successfully", auction });
  } catch (error) {
    console.error("Bidding Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all bids (Dummy Response for Now)
app.get("/api/bids", (req, res) => {
  res.json({ message: "Bids API is working!" });
});

// ✅ Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Don't send passwords
    res.json(users);
  } catch (error) {
    console.error("Fetching Users Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅`);
});
