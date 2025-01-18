import { Observable } from "rxjs";

export interface InstitutService{
  addProfilInstitut(data:any):Observable<any>;
  addProfilIntermediaire(data:any):Observable<any>;
}