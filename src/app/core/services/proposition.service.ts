import { Observable } from "rxjs";
import { ResponseProposalResponse } from "../models/carnet-ordre/response-proposal-response";

export interface PropositionService{
  getAllProposalsByAssetId(id: number):Observable<ResponseProposalResponse>;
}