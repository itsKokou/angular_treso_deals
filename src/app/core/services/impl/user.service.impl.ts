import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { Injectable } from '@angular/core';
import { RestResponse } from '../../models/rest-response';
import { InstituteUserDTO } from '../../models/institution/institute-user-dto';
import { UserDto } from '../../models/user/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserServiceImpl implements UserService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  reinitUserPassword(userId: any, data:any): Observable<RestResponse<any>> {
    return this.http.post<RestResponse<any[]>>(`${this.apiUrl}/auth/reinit-password/${userId}`, data);
  }

  getAllUser(): Observable<RestResponse<UserDto[]>> {
    return this.http.get<RestResponse<UserDto[]>>(`${this.apiUrl}/users`);
  }

  activateUserInstitut(userId: any, data:any): Observable<RestResponse<any>> {
    return this.http.patch<RestResponse<any[]>>(`${this.apiUrl}/users/activate-account/${userId}`, data);
  }

  lockUserInstitut(userId: any, institutionId: any, data:any): Observable<RestResponse<any>> {
    return this.http.patch<RestResponse<any[]>>(`${this.apiUrl}/users/${institutionId}/block/${userId}`, data);
  }

  deleteUserInstitut(userId: any, institutionId: any): Observable<RestResponse<any>> {
    return this.http.delete<RestResponse<any[]>>(`${this.apiUrl}/users/${institutionId}/delete/${userId}`);
  }

  getUserByInstitutionId(id: number): Observable<RestResponse<InstituteUserDTO[]>> {
    return this.http.get<RestResponse<InstituteUserDTO[]>>(`${this.apiUrl}/users/${id}`);
  }

  // getUserAdminInstitut(): Observable<RestResponse<any>> {
  //   return this.http.get<RestResponse<any>>(`${this.apiUrl}/users`);
  // }

  addUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, data);
  }

}
