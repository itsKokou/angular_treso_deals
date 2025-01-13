import { Observable } from "rxjs";
import { ResponseAssetResponse } from "../models/carnet-ordre/response-asset-response";
import { ResponseResumeAsset } from "../models/carnet-ordre/response-resume-asset";

export interface TransactionService{
  getAllCarnetOrdre():Observable<ResponseAssetResponse>;
  getTransactionEncours():Observable<ResponseAssetResponse>;
  getHistoriqueTransaction():Observable<ResponseAssetResponse>;
  getResumeOrdre(data:any):Observable<ResponseResumeAsset>;
  addCarnetOrdre(data:any):Observable<ResponseAssetResponse>;
  updateCarnetOrdre(data:any):Observable<ResponseAssetResponse>;
  deleteCarnetOrdre(id:number):Observable<any>;
}