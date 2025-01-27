import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { ProfilResponse } from "../models/profil/profil-response";
import { ProposalEnum } from "../models/enum/proposal-enum";

export interface ProfilService{
  getAllProfil():Observable<RestResponse<ProfilResponse[]>>;
  getProfilDetail(idSubscription:number):Observable<any>;
  updateProfil(idSubscription:number, status: ProposalEnum.StatusEnum):Observable<RestResponse<ProfilResponse>>;
}