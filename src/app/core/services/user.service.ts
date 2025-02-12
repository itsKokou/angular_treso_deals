import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { InstituteUserDTO } from "../models/institution/institute-user-dto";
import { UserStandard } from "../models/user/user-standard";

export interface UserService{
  getUserByInstitutionId(id: number):Observable<RestResponse<InstituteUserDTO[]>>;
  // getUserAdminInstitut(): Observable<RestResponse<any>>
  addUser(data: any):Observable<any>;
  activateUserInstitut(userId:any, data:any):Observable<RestResponse<any>>;
  LockUserInstitut(userId:any, institutionId:any, data:any):Observable<RestResponse<any>>;
  DeleteUserInstitut(userId:any, institutionId:any):Observable<RestResponse<any>>;
  getAllUser():Observable<RestResponse<UserStandard[]>>
}