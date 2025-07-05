import bcrypt from "bcryptjs";
import AuthRepo from "../../repo/auth/AuthRepo.js";
import JWT_UTILS from "../../utils/jwtUtils.js";
import { ServiceResponse } from "../../utils/responseHandler.js";

export default class AuthService {
  /**
   * User registration
   * @param {Object} userData - { firstName, lastName, email, password }
   * @returns {ServiceResponse}
   */
  static signUp = async (userData) => {
    const { firstName, lastName, email, password } = userData;

    // Check if the email already exists
    const existingUser = await AuthRepo.findUserByFields({ email });
    if (existingUser) {
      return new ServiceResponse(409, "Email already exists");
    }

    // Create a new user
    const newUser = await AuthRepo.createUser({
      firstName,
      lastName,
      email,
      password,
    });

    return new ServiceResponse(201, "User created successfully", {
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  };

  /**
   * User authentication check
   * @param {string} userId
   * @returns {ServiceResponse}
   */
  static authCheck = async (authentication) => {
    const { userId, org } = authentication;

    const user = await AuthRepo.findUserByFields({ _id: userId, org }, "-password");
    if (!user) {
      return new ServiceResponse(404, "User Not Found");
    }

    return new ServiceResponse(200, null, { user });
  };

  /**
   * User login
   * @param {Object} credentials - { email, password }
   * @returns {ServiceResponse}
   */
  static login = async ({ email, org, password }) => {
    try {
      // 1. Find user with password field
      const user = await AuthRepo.findUserByFields({ email, org }, "+password");
      if (!user) {
        return new ServiceResponse(404, "User Not Found");
      }

      // 2. Compare passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return new ServiceResponse(401, "Invalid Credentials"); // Generic message for security
      }

      // 3. Generate token
      const token = JWT_UTILS.generateToken({
        userId: user._id,
        org: user.org
      });

      if (!token) {
        return new ServiceResponse(500, "Token Generation Failed");
      }

      // 4. Get user data without sensitive fields
      const userData = await AuthRepo.findUserByFields(
        { _id: user._id, org }, // Changed 'id' to '_id' to match MongoDB
        "-password -updatedAt -createdAt"
      );

      return new ServiceResponse(200, "Login Successful", {
        access_token: token,
        user: userData,
      });

    } catch (error) {
      console.error("Login Error:", error);
      return new ServiceResponse(500, "Internal Server Error");
    }
  };

}
