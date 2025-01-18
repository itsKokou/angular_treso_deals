export interface RestResponse<T>{
    statusCode?: number;
    errors?: Array<Error>;
    data?: T;
}