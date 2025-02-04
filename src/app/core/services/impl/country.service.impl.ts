import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { Injectable } from '@angular/core';
import { RestResponse } from '../../models/rest-response';
import { InstituteUserDTO } from '../../models/institution/institute-user-dto';
import { CountryService } from '../country.service';
import { CountryDto } from '../../models/country/country-dto';

@Injectable({
  providedIn: 'root'
})
export class CountryServiceImpl implements CountryService {
  private apiUrl = `${environment.APIURL}`

  constructor(private http: HttpClient) { 
  }

  getCountries(): Observable<RestResponse<CountryDto[]>> {
    return this.http.get<RestResponse<CountryDto[]>>(`${this.apiUrl}/countries`);
  }

}
