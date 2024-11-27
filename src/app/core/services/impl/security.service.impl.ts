import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SecurityService } from '../security.service';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../models/login/login-request';
import { ResponseLoginResponseDTO } from '../../models/login/response-login-response-dto';
import { ResponseVerificationResponseDto } from '../../models/validation/response-verification-response-dto';

@Injectable({
  providedIn: 'root'
})
export class SecurityServiceImpl implements SecurityService {
  private apiUrl = `${environment.APIURL}`
  constructor(private http: HttpClient) { }

  validation(requestId: string, code: string): Observable<ResponseVerificationResponseDto> {
    return this.http.post<ResponseVerificationResponseDto>(`${this.apiUrl}/auth/valid-verification/${requestId}/${code}`,null);
  }
  
  login(request: LoginRequest): Observable<ResponseLoginResponseDTO> {
    return this.http.post<ResponseLoginResponseDTO>(`${this.apiUrl}/auth/login`,request);
  }

}
