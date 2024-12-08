import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { ResponseInstituteUserDTO } from '../../models/institution/response-institute-user-dto';
import { Injectable } from '@angular/core';
import { CarnetOrdreService } from '../carnet-ordre.service';
import { ResponseAssetResponse } from '../../models/carnet-ordre/response-asset-response';

@Injectable({
  providedIn: 'root'
})
export class CarnetOrdreServiceImpl implements CarnetOrdreService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  getAllCarnetOrdre(): Observable<ResponseAssetResponse> {
    return this.http.get<ResponseInstituteUserDTO>(`${this.apiUrl}/assets/mine`);
  }

}
