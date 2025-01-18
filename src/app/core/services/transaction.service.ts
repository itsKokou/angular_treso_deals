import { Observable } from "rxjs";
import { ResumeAssetResponse } from "../models/carnet-ordre/resume-asset-response";
import { RestResponse } from "../models/rest-response";
import { AssetResponse } from "../models/carnet-ordre/asset-response";

export interface TransactionService{
  getAllCarnetOrdre():Observable<RestResponse<AssetResponse[]>>;
  getTransactionEncours():Observable<RestResponse<AssetResponse[]>>;
  getHistoriqueTransaction():Observable<RestResponse<AssetResponse[]>>;
  getResumeOrdre(data:any):Observable<RestResponse<ResumeAssetResponse>>;
  addCarnetOrdre(data:any):Observable<any>;
  updateCarnetOrdre(data:any):Observable<any>;
  deleteCarnetOrdre(id:number):Observable<any>;
}