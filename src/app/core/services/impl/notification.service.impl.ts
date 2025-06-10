import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RestResponse } from '../../models/rest-response';
import { NotificationService } from '../notification.service';
import { NotificationDto } from '../../models/notification/notification-dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceImpl implements NotificationService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  getAllNotification(): Observable<RestResponse<NotificationDto[]>> {
    return this.http.get<RestResponse<NotificationDto[]>>(`${this.apiUrl}/notifications`);
  }

  ReadNotification(idNotification: number): Observable<any> {
     return this.http.put<RestResponse<any>>(`${this.apiUrl}/notifications/mark-as-read/${idNotification}`, {});
  }
}
