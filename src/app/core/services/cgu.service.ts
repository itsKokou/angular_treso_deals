import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";

export interface CguService{
  getCgu(): Observable<RestResponse<any>>
  traiterCgu(code: string, agreement: string ): Observable<RestResponse<any>>
}