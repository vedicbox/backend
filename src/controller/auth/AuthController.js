import AuthService from "../../service/auth/AuthService.js";
import { HttpHandler } from "../../utils/responseHandler.js";

export default class AuthController {
  static async signUp(req, res) {
    try {
      const result = await AuthService.signUp(req.body);
      return HttpHandler.send(res, result);
    } catch (error) {
      return HttpHandler.error(
        res,
        error, // Pass the actual error object
        "Registration failed. Please try again later"
      );
    }
  }

  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      return HttpHandler.send(res, result);
    } catch (error) {
      return HttpHandler.error(
        res,
        error, // Pass the actual error object
        "Login failed. Please try again later"
      );
    }
  }

  static async authCheck(req, res) {
    try {
      const result = await AuthService.authCheck(req.auth);
      return HttpHandler.send(res, result);
    } catch (error) {
      return HttpHandler.error(
        res,
        error, // Pass the actual error object
        "Authentication check failed"
      );
    }
  }
}
