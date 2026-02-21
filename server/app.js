require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");




connectDB();

// app.use(cors());
const app = express();






app.use(express.json());
app.use(cors());
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", require("./routes/authRoutes"));





app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});


app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
