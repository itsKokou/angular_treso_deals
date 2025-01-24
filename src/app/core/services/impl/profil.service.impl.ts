import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RestResponse } from '../../models/rest-response';
import { InstituteUserDTO } from '../../models/institution/institute-user-dto';
import { ProfilService } from '../profil.service';
import { ProfilResponse } from '../../models/profil/profil-response';
import { ProposalEnum } from '../../models/enum/proposal-enum';

@Injectable({
  providedIn: 'root'
})
export class ProfilServiceImpl implements ProfilService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  addProfil(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, data);
  }

  getProfilDetail(idSubscription: number): Observable<any> {
    return this.http.get<RestResponse<ProfilResponse[]>>(`${this.apiUrl}/invitations/details/${idSubscription}`);
  }
  
  updateProfil(idSubscription: number, status: ProposalEnum.StatusEnum): Observable<RestResponse<ProfilResponse>> {
    return this.http.patch<RestResponse<ProfilResponse>>(`${this.apiUrl}/invitations/update/${idSubscription}/${status}`, {});
  }

  getAllProfil(): Observable<RestResponse<ProfilResponse[]>> {
    return this.http.get<RestResponse<ProfilResponse[]>>(`${this.apiUrl}/invitations/subscriptions`);
  }

}
