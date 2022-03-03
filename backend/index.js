const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on Port : ${PORT}`);
});
