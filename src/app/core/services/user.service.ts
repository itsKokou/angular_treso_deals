import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { InstituteUserDTO } from "../models/institution/institute-user-dto";

export interface UserService{
  getUserByInstitutionId(id: number):Observable<RestResponse<InstituteUserDTO[]>>;
  getUserAdminInstitut(): Observable<RestResponse<any>>
  addUser(data: any):Observable<any>;
}