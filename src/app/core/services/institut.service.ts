import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";

export interface InstitutService{
  addProfilInstitut(data:any):Observable<any>;
  addProfilIntermediaire(data:any):Observable<any>;
  getInstitutionById(id:number):Observable<RestResponse<any>>;
}