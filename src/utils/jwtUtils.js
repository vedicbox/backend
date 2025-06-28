import jwt from "jsonwebtoken";

export default class JWT_UTILS {
  static generateToken(payload) {
    // Add 'static' keyword
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }
    const options = {
      expiresIn: "1d", // Token expiration time
    };
    return jwt.sign(payload, secretKey, options);
  }
}
