"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.CustomServerError = void 0;
var ERROR_CODES;
(function (ERROR_CODES) {
    ERROR_CODES[ERROR_CODES["SERVER_ERROR"] = 1100] = "SERVER_ERROR";
    ERROR_CODES[ERROR_CODES["BAD_REQUEST"] = 1200] = "BAD_REQUEST";
})(ERROR_CODES || (ERROR_CODES = {}));
class CustomServerError extends Error {
    constructor(message = "Internal Server Error", error_code = ERROR_CODES.SERVER_ERROR, statusCode = 500) {
        super(message);
        this.message = message;
        this.error_code = error_code;
        this.statusCode = statusCode;
    }
}
exports.CustomServerError = CustomServerError;
class BadRequestError extends CustomServerError {
    constructor(message = "") {
        super(message, ERROR_CODES.BAD_REQUEST, 400);
        this.name = "BadRequestError";
        this.message =
            "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.";
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=index.js.map