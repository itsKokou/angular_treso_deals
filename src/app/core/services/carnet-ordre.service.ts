import { Observable } from "rxjs";
import { ResponseAssetResponse } from "../models/carnet-ordre/response-asset-response";

export interface CarnetOrdreService{
  getAllCarnetOrdre():Observable<ResponseAssetResponse>;
}