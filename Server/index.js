const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const adminRoutes = require("./routes/Admin");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173",process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// cloudinary connect
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

// default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// ── Auto-seed categories on startup ──
const Category = require("./models/Category");
const seedCategories = async () => {
  const defaultCategories = [
    { name: "Web Development", description: "Learn to build modern web applications." },
    { name: "Mobile Development", description: "Build apps for iOS and Android." },
    { name: "Data Science", description: "Analyze data and build machine learning models." },
    { name: "Machine Learning", description: "Deep learning, neural networks, and AI." },
    { name: "DevOps", description: "CI/CD, Docker, Kubernetes, and cloud infrastructure." },
    { name: "Design", description: "Master UI/UX and graphic design." },
    { name: "Business", description: "Learn entrepreneurship and management." },
    { name: "Blockchain", description: "Smart contracts, DeFi, and Web3 development." },
  ];

  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log("Categories seeded automatically");
    } else {
      console.log(` ${count} categories already exist — skipping seed`);
    }
  } catch (err) {
    console.error(" Category seed error:", err.message);
  }
};

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
  // Seed categories after server starts (runs once)
  seedCategories();
});

