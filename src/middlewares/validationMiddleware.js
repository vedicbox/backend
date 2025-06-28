import { body, validationResult } from "express-validator";

export const validateSignUp = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  (req, res, next) => handleValidation(req, res, next),
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
  (req, res, next) => handleValidation(req, res, next),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return next(new APIError("Validation failed", 400, errors.array()));
  }
  next();
}
