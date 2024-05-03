enum ERROR_CODES {
    SERVER_ERROR = 1100,
    BAD_REQUEST = 1200

}

export class CustomServerError extends Error {
  
    constructor(public message: string = "Internal Server Error" , public  error_code : ERROR_CODES = ERROR_CODES.SERVER_ERROR , public statusCode: number = 500) {
        super(message);
    }
    
}

export class BadRequestError extends CustomServerError {
  constructor(message = "") {
    super(message , ERROR_CODES.BAD_REQUEST  , 400);
    this.name = 'BadRequestError';
    this.message = "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.";
  }
}