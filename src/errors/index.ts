export class CustomServerError extends Error {
    error_code: string;
    statusCode: number = 500;
    constructor(message: string = "Internal Server Error" , error_code: string = "" , statusCode: number = 500) {
        super(message);
        this.name = 'CustomServerError';
        this.error_code = ""
    }
    
}

export class BadRequestError extends CustomServerError {
  constructor(message: string) {
    super(message , "1200" , 400);
    this.name = 'BadRequestError';
    this.message = "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.";
  }
}