require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay"); // ✅ Import Razorpay SDK

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Connect to MongoDB
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
  currentBid: { type: Number, default: 0 },
  highestBidder: { type: String, default: "" },
  closingTime: Date,
  isClosed: { type: Boolean, default: false },
});

const AuctionItem = mongoose.model("AuctionItem", auctionItemSchema);

// ✅ WebSocket Setup
io.on("connection", (socket) => {
  console.log("✅ WebSocket Connected:", socket.id);

  socket.on("placeBid", async ({ auctionId, bidderName, bidAmount }) => {
    try {
      const auction = await AuctionItem.findById(auctionId);

      if (!auction || auction.isClosed) {
        return socket.emit("bidError", { message: "Auction closed or not found" });
      }

      if (bidAmount <= auction.currentBid) {
        return socket.emit("bidError", { message: "Bid must be higher than current bid" });
      }

      auction.currentBid = bidAmount;
      auction.highestBidder = bidderName;
      await auction.save();

      io.emit("bidUpdated", { auctionId, currentBid: bidAmount, highestBidder: bidderName });
    } catch (error) {
      console.error("Bidding Error:", error);
      socket.emit("bidError", { message: "Internal Server Error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ WebSocket Disconnected:", socket.id);
  });
});

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

// ✅ Razorpay Payment Route
app.post("/api/create-order", authenticate, async (req, res) => {
  try {
    const { amount } = req.body; // Amount in the smallest currency unit (e.g., paisa for INR)
    const orderOptions = {
      amount: amount * 100, // Amount is in paise (smallest unit of currency)
      currency: "INR",
      receipt: `receipt_${Math.random() * 100000}`,
      payment_capture: 1, // Auto capture after successful payment
    };

    razorpay.orders.create(orderOptions, (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({ message: "Error creating payment order" });
      }
      res.json({ order });
    });
  } catch (error) {
    console.error("Payment Order Creation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Verify Razorpay Payment Route
app.post("/api/verify-payment", authenticate, async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = require("crypto")
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (signature === expectedSignature) {
      return res.json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists" });

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Signin successful", token });
  } catch (error) {
    console.error("Signin Error:", error);
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

// ✅ Correct API Route for placing a bid
app.post("/api/auctions/:id/bid", async (req, res) => {
  try {
    const { bidAmount, bidderName } = req.body;
    const auction = await AuctionItem.findById(req.params.id);

    if (!auction || auction.isClosed) {
      return res.status(404).json({ message: "Auction not found or already closed" });
    }

    if (bidAmount <= auction.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than current bid" });
    }

    auction.currentBid = bidAmount;
    auction.highestBidder = bidderName;
    await auction.save();

    io.emit("bidUpdated", { 
      auctionId: req.params.id, 
      currentBid: bidAmount, 
      highestBidder: bidderName 
    });

    res.json({ message: "Bid placed successfully", auction });
  } catch (error) {
    console.error("Bidding Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    console.error("Fetching Users Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅`);
});
