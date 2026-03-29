const express = require("express");
const mongoose = require("mongoose");
const cors = require ("cors");
const dotenv = require ("dotenv");

const propertyRoutes = require("./routes/propertyRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");

dotenv.config();

const authRoutes = require("./routes/authRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favourites", favouriteRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected ✅");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });