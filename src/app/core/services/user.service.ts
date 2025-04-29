import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { InstituteUserDTO } from "../models/institution/institute-user-dto";
import { UserDto } from "../models/user/user-dto";

export interface UserService{
  getUserByInstitutionId(id: number):Observable<RestResponse<InstituteUserDTO[]>>;
  // getUserAdminInstitut(): Observable<RestResponse<any>>
  addUser(data: any):Observable<any>;
  activateUserInstitut(userId:any, data:any):Observable<RestResponse<any>>;
  lockUserInstitut(userId:any, institutionId:any, data:any):Observable<RestResponse<any>>;
  deleteUserInstitut(userId:any, institutionId:any):Observable<RestResponse<any>>;
  reinitUserPassword(userId:any, data:any):Observable<RestResponse<any>>;
  getAllUser():Observable<RestResponse<UserDto[]>>
}