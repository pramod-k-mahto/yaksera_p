import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Access token not provided");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // ✅ jwt stores expiredAt on the error object automatically
      const expiredAt = error.expiredAt; // This is a Date object

      const err = new ApiError(401, "Token expired");
      err.expiredAt = expiredAt.toLocaleString(); // human-readable
      err.expiredAtISO = expiredAt.toISOString(); // ISO format
      err.expiredAtUnix = Math.floor(expiredAt.getTime() / 1000); // unix timestamp

      throw new ApiError(401,"Token expired",err) 
    }

    return next(new ApiError(401, "Invalid token"));
  }
};

export default verifyToken;
