import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RestResponse } from '../../models/rest-response';
import { CguService } from '../cgu.service';

@Injectable({
  providedIn: 'root'
})
export class CguServiceImpl implements CguService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  traiterCgu(code: string, agreement: string): Observable<RestResponse<any>> {
    return this.http.put<RestResponse<any>>(`${this.apiUrl}/cgu/agreed/${code}/${agreement}`,{});
  }

  getCgu(): Observable<RestResponse<any>> {
    return this.http.get<RestResponse<any>>(`${this.apiUrl}/cgu`);
  }

  

}
