import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { ResponseInstituteUserDTO } from '../../models/institution/response-institute-user-dto';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceImpl implements UserService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  getUserByInstitutionId(id: number): Observable<ResponseInstituteUserDTO> {
    return this.http.get<ResponseInstituteUserDTO>(`${this.apiUrl}/users/${id}`);
  }

}
