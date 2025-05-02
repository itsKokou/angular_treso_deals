import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InstitutService } from '../institut.service';
import { RestResponse } from '../../models/rest-response';

@Injectable({
  providedIn: 'root'
})
export class InstitutServiceImpl implements InstitutService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  getInstitutionById(id: number): Observable<RestResponse<any>> {
    return this.http.get(`${this.apiUrl}/institutions/${id}`)
  }

  addProfilInstitut(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/institutions/bank/register`, data);
  }

  addProfilIntermediaire(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/institutions/sgi/register`, data);
  }

}
