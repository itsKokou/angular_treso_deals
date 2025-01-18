import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PropositionService } from '../proposition.service';
import { ProposalEnum } from '../../models/enum/proposal-enum';
import { RestResponse } from '../../models/rest-response';
import { ProposalResponse } from '../../models/carnet-ordre/proposal-response';

@Injectable({
  providedIn: 'root'
})
export class PropositionServiceImpl implements PropositionService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  treatProposal(id: any, statut: ProposalEnum.StatusEnum, proposal: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/proposals/response-at-proposal/${id}/${statut}`, proposal);
  }

  addProposaltoAsset(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/proposals/add`, data);
  }

  getAllProposalsByAssetId(id: number): Observable<RestResponse<ProposalResponse[]>> {
    return this.http.get<RestResponse<ProposalResponse[]>>(`${this.apiUrl}/proposals/${id}?idAsset=${id}`);
  }
}
