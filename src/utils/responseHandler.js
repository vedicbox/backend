class Response {
  constructor(status, message = null, data = null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    return {
      status: this.status,
      msg: this.message,
      payload: this.data,
    };
  }
}

export class ServiceResponse extends Response {
  // For use in service layer
}

export class HttpHandler {
  static send(res, response) {
    return res.status(response.status).json(response.toJSON());
  }

  static error(res, error, customMessage = "Error", status = 500) {
    console.error("API Error:", error); // Log the full error

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        status: 409,
        msg: "Resource already exists",
        payload: {
          error: customMessage,
          details: "Duplicate key violation",
        },
      });
    }

    // Handle Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: 400,
        msg: "Validation failed",
        payload: {
          error: customMessage,
          details: messages,
        },
      });
    }

    // Default error response (with both custom message and error details)
    return res.status(status).json({
      status: status,
      msg: customMessage,
      payload: {
        error: error.message, // Original error message
        details: error.stack?.split("\n")[0], // First line of stack trace
      },
    });
  }
}
