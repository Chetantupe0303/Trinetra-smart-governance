const jwt = require("jsonwebtoken");
const User = require("../models/users");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token received in protect cookie:", req.cookies.token);
    console.log("Token received in protect middleware:", token);

    // if (
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith("Bearer")
    // ) {
    //   token = req.headers.authorization.split("Bearer ")[1];
    // }

    if (!token) {
      const error = new Error("Not authorized, no token");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      const error = new Error("Not authorized, no decoded token");
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(decoded.id).select("-password");

    if(!user){
      throw new Error("User not found");  
    }
    req.user = user;

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};


 

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    const error = new Error("Admin access only");
    error.statusCode = 403;
    next(error);
  }
};

module.exports = { protect, adminOnly };
