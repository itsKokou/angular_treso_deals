import { Observable } from "rxjs";
import { ProposalEnum } from "../models/enum/proposal-enum";
import { RestResponse } from "../models/rest-response";
import { ProposalResponse } from "../models/carnet-ordre/proposal-response";

export interface PropositionService{
  getAllProposalsByAssetId(id: number):Observable<RestResponse<ProposalResponse[]>>;
  addProposaltoAsset(data:any):Observable<any>;
  treatProposal(id:any, statut:ProposalEnum.StatusEnum, proposal: any):Observable<any>;
}