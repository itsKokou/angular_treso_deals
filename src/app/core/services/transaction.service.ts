import { Observable } from "rxjs";
import { ResponseAssetResponse } from "../models/carnet-ordre/response-asset-response";

export interface TransactionService{
  getAllCarnetOrdre():Observable<ResponseAssetResponse>;
  getTransactionEncours():Observable<ResponseAssetResponse>;
  getHistoriqueTransaction():Observable<ResponseAssetResponse>;
  addCarnetOrdre(data:any):Observable<ResponseAssetResponse>;
}