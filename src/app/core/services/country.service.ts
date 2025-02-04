import { Observable } from "rxjs";
import { RestResponse } from "../models/rest-response";
import { CountryDto } from "../models/country/country-dto";

export interface CountryService{
  getCountries():Observable<RestResponse<CountryDto[]>>;
}