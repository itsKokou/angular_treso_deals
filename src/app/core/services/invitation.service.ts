import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";

export interface InvitationService{
  sendInvitation(data: any):Observable<RestResponse<any>>;
}