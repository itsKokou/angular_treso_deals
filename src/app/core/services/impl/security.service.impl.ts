import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SecurityService } from '../security.service';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../models/login/login-request';
import { ResponseLoginResponseDTO } from '../../models/login/response-login-response-dto';
import { ResponseVerificationResponseDto } from '../../models/validation/response-verification-response-dto';
import { isPlatformBrowser } from '@angular/common';
import { UserDto } from '../../models/user/user-dto';
import { Router } from '@angular/router';
import { RestResponse } from '../../models/rest-response';

@Injectable({
  providedIn: 'root'
})
export class SecurityServiceImpl implements SecurityService {
  isAuthenticated: boolean = false
  private isBrowser: boolean=false
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private plateformId:any) { 
    this.isBrowser = isPlatformBrowser(plateformId);
  }

  // initchangePassword(): Observable<RestResponse<any>> {
  //   return this.http.post<RestResponse<any>>(`${this.apiUrl}/auth/init-change-password`,{});
  // }

  changePassword(data: any): Observable<RestResponse<any>> {
    return this.http.post<RestResponse<any>>(`${this.apiUrl}/auth/change-password`,data);
  }

  validation(requestId: string, code: string): Observable<ResponseVerificationResponseDto> {
    return this.http.post<ResponseVerificationResponseDto>(`${this.apiUrl}/auth/validate-verification/${requestId}/${code}`,{});
  }

  resendValidationCode(requestId: string): Observable<RestResponse<any>> {
    return this.http.post<RestResponse<any>>(`${this.apiUrl}/auth/resend-verification/${requestId}`,{});
  }
  
  login(request: LoginRequest): Observable<ResponseLoginResponseDTO> {
    return this.http.post<ResponseLoginResponseDTO>(`${this.apiUrl}/auth/login`,request);
  }

  getAuthToken():string|null{
    if(this.isBrowser){
      return localStorage.getItem('token');
    }else{
      return null;
    }
  }

  getConnectedUser():any{
    var user = localStorage.getItem("connectedUser")
    if(user != null){
      return JSON.parse(user) as UserDto;
    }else{
      this.router.navigateByUrl("/login");
    }
  }

}
