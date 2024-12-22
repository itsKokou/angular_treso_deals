import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ResponseAssetResponse } from '../../models/carnet-ordre/response-asset-response';
import { TransactionService } from '../transaction.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceImpl implements TransactionService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  addCarnetOrdre(data:any): Observable<ResponseAssetResponse> {
    return this.http.post<ResponseAssetResponse>(`${this.apiUrl}/assets`, data);
  }

  getTransactionEncours(): Observable<ResponseAssetResponse> {
    return this.http.get<ResponseAssetResponse>(`${this.apiUrl}/assets/published`);
  }

  getHistoriqueTransaction(): Observable<ResponseAssetResponse> {
    return this.http.get<ResponseAssetResponse>(`${this.apiUrl}/assets/historic`);
  }

  getAllCarnetOrdre(): Observable<ResponseAssetResponse> {
    return this.http.get<ResponseAssetResponse>(`${this.apiUrl}/assets/mine`);
  }

}
