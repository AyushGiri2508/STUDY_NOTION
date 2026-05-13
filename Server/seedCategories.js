const mongoose = require("mongoose");
require("dotenv").config();
const Category = require("./models/Category");

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB...");

    const categories = [
      { name: "Web Development", description: "Learn to build modern web applications." },
      { name: "Mobile Development", description: "Build apps for iOS and Android." },
      { name: "Data Science", description: "Analyze data and build machine learning models." },
      { name: "Machine Learning", description: "Deep learning, neural networks, and AI." },
      { name: "DevOps", description: "CI/CD, Docker, Kubernetes, and cloud infrastructure." },
      { name: "Design", description: "Master UI/UX and graphic design." },
      { name: "Business", description: "Learn entrepreneurship and management." },
      { name: "Blockchain", description: "Smart contracts, DeFi, and Web3 development." },
    ];

    for (let cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedCategories();
