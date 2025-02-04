import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RestResponse } from '../../models/rest-response';
import { InvitationService } from '../invitation.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationServiceImpl implements InvitationService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  sendInvitation(data: any): Observable<RestResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/invitations`, data);
  }

 
}
