import { Observable } from "rxjs";
import { LoginRequest } from "../models/login/login-request";
import { RestResponse } from "../models/rest-response";
import { InstituteUserDTO } from "../models/institution/institute-user-dto";

export interface UserService{
  getUserByInstitutionId(id: number):Observable<RestResponse<InstituteUserDTO[]>>;
}