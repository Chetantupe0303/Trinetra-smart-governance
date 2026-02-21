require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");




connectDB();

// app.use(cors());
const app = express();






app.use(express.json());
app.use(cors(
  {
    origin: process.env.CORS,
    credentials: true,
  }
));
app.use(cookieParser());
// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", complaintRoutes);
app.use("/api/auth", require("./routes/authRoutes"));





app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});


app.use(errorHandler);








const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
