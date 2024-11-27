import { Observable } from "rxjs";
import { LoginRequest } from "../models/login/login-request";
import { ResponseLoginResponseDTO } from "../models/login/response-login-response-dto";
import { ResponseVerificationResponseDto } from "../models/validation/response-verification-response-dto";

export interface SecurityService{
  login(request: LoginRequest):Observable<ResponseLoginResponseDTO>;
  validation(requestId: string, code: string):Observable<ResponseVerificationResponseDto>;
}