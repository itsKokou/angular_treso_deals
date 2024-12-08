import { Observable } from "rxjs";
import { LoginRequest } from "../models/login/login-request";
import { ResponseLoginResponseDTO } from "../models/login/response-login-response-dto";
import { ResponseVerificationResponseDto } from "../models/validation/response-verification-response-dto";
import { ResponseInstituteUserDTO } from "../models/institution/response-institute-user-dto";

export interface UserService{
  getUserByInstitutionId(id: number):Observable<ResponseInstituteUserDTO>;
}