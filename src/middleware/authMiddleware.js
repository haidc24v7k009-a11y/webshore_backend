import jwt from "jsonwebtoken";
import User from "../models/User.js";
import db from "../models/index";

let protectedRoute = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = req.cookies.accessToken; // Bearer <token>
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    // Verify the token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.error("Token verification failed:", err);
          return res.status(403).json({ message: "Invalid access token" });
        }

        let account;

        if (decoded.type === "user") {

          account = await db.User.findByPk(decoded.id);

        } else {

          account = await db.Employee.findByPk(decoded.id);

        }

        if (!account) {
          return res.status(404).json({ message: "User not found" });
        }
        //return user info
        req.user = account;
        req.accountType = decoded.type;
        next();
      },
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error occurred while verifying token in middleware",
      error,
    });
  }
};
export { protectedRoute };
