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
    const existingUser = await AuthRepo.findUserByEmail(email);
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
    const { userId } = authentication;

    const user = await AuthRepo.findUserById(userId, "-password");
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
  static login = async ({ email, password }) => {
    const user = await AuthRepo.findUserByEmail(email, "password");
    if (!user) {
      return new ServiceResponse(404, "User Not Found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return new ServiceResponse(401, "Invalid Password");
    }

    const token = JWT_UTILS.generateToken({ userId: user._id });
    const userData = await AuthRepo.findUserById(
      user._id,
      "-password -updatedAt -createdAt"
    );

    return new ServiceResponse(200, "Login Successful", {
      access_token: token,
      user: userData,
    });
  };
}
