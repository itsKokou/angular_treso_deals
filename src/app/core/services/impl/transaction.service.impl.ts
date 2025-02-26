import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { RestResponse } from '../../models/rest-response';
import { ResumeAssetResponse } from '../../models/carnet-ordre/resume-asset-response';
import { AssetResponse } from '../../models/carnet-ordre/asset-response';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceImpl implements TransactionService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  getResumeOrdre(data: any): Observable<RestResponse<ResumeAssetResponse>> {
    return this.http.post<any>(`${this.apiUrl}/assets/overview`, data);
  }

  updateCarnetOrdre(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/assets`, data);
  }

  deleteCarnetOrdre(id: number):Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/assets/delete/${id}`);
  }

  addCarnetOrdre(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assets`, data);
  }

  getTransactionEncours(): Observable<RestResponse<AssetResponse[]>> {
    return this.http.get<RestResponse<AssetResponse[]>>(`${this.apiUrl}/assets/published`);
  }

  getHistoriqueTransaction(): Observable<RestResponse<AssetResponse[]>> {
    return this.http.get<RestResponse<AssetResponse[]>>(`${this.apiUrl}/assets/historic`);
  }

  getAllCarnetOrdre(): Observable<RestResponse<AssetResponse[]>> {
    return this.http.get<RestResponse<AssetResponse[]>>(`${this.apiUrl}/assets/mine`);
  }

  rechercherCarnetOrdre(params: { [key: string]: string | number }): Observable<RestResponse<AssetResponse[]>> {
    let httpParams = new HttpParams();
  
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key].toString());
      });
    }

    return this.http.get<RestResponse<AssetResponse[]>>(`${this.apiUrl}/assets/search`, { params: httpParams });
  }

}
