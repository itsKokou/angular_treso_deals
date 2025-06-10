import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { NotificationDto } from "../models/notification/notification-dto";

export interface NotificationService{
  getAllNotification():Observable<RestResponse<NotificationDto[]>>;
  ReadNotification(idNotification:number):Observable<any>;
}