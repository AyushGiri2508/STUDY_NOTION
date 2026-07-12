/**
 * Seed Admin Script
 * Run: node seedAdmin.js
 *
 * Creates an admin account in the database.
 * Uses environment variables or defaults.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Profile = require("./models/Profile");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@studynotion.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "Admin";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "StudyNotion";

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to database");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`⚠️  Admin account already exists: ${ADMIN_EMAIL}`);
      console.log(`   Account type: ${existingAdmin.accountType}`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create profile
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: "Platform Administrator",
      contactNumber: null,
    });

    // Create admin user
    const admin = await User.create({
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      accountType: "Admin",
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${ADMIN_FIRST_NAME}${ADMIN_LAST_NAME}`,
    });

    console.log("✅ Admin account created successfully!");
    console.log("─────────────────────────────────");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name:     ${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`);
    console.log(`   ID:       ${admin._id}`);
    console.log("─────────────────────────────────");
    console.log("⚠️  Change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
