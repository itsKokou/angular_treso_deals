import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InstitutService } from '../institut.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutServiceImpl implements InstitutService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  addProfilInstitut(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/institutions/bank/register`, data);
  }

  addProfilIntermediaire(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/institutions/sgi/register`, data);
  }

}
