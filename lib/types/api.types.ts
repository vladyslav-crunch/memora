export type ApiFieldError<TFields extends string = string> = {
    field: TFields;
    message: string;
};

export type ApiErrorResponse<TFields extends string = string> = {
    status: number;
    message?: string;
    errors?: ApiFieldError<TFields>[];
};

export class ApiError extends Error implements ApiErrorResponse {
    status: number;
    errors?: ApiFieldError[];

    constructor(status: number, message?: string, errors?: ApiFieldError[]) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}