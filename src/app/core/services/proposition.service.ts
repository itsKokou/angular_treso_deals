import { Observable } from "rxjs";
import { ResponseProposalResponse } from "../models/carnet-ordre/response-proposal-response";
import { ProposalEnum } from "../models/enum/proposal-enum";

export interface PropositionService{
  getAllProposalsByAssetId(id: number):Observable<ResponseProposalResponse>;
  addProposaltoAsset(data:any):Observable<any>;
  treatProposal(id:any, statut:ProposalEnum.StatusEnum, proposal: any):Observable<any>;
}