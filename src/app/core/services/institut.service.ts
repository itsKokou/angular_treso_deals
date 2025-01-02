import { Observable } from "rxjs";
import { ResponseProposalResponse } from "../models/carnet-ordre/response-proposal-response";
import { ProposalEnum } from "../models/enum/proposal-enum";

export interface InstitutService{
  addProfilInstitut(data:any):Observable<any>;
  addProfilIntermediaire(data:any):Observable<any>;
}