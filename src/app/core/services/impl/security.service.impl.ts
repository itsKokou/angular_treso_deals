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

  validation(requestId: string, code: string): Observable<ResponseVerificationResponseDto> {
    return this.http.post<ResponseVerificationResponseDto>(`${this.apiUrl}/auth/validate-verification/${requestId}/${code}`,{});
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

  getConnectedUser(){
    var user = localStorage.getItem("connectedUser")
    if(user != null){
      return JSON.parse(user);
    }else{
      this.router.navigateByUrl("/login");
    }
  }

}
