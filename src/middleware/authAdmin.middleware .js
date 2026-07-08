import jwt from "jsonwebtoken";
import User from "../models/employee.js";
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
      async (err, decodedUser) => {
        if (err) {
          console.error("Token verification failed:", err);
          return res.status(403).json({ message: "Invalid access token" });
        }

        //find user
        let user = await db.Employee.findOne({
          where: {
            id: decodedUser.userId,
          },
          raw: true,
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        //return user info
        req.user = user;
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
