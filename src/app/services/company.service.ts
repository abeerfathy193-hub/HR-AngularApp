import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ICompany } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly API_URL = `${environment.webApiURL}/api/Company`;

  constructor(private http: HttpClient) { }

  getCompanySetting() {
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.authService.token()}`
    // });
    return this.http.get<ICompany>(`${this.API_URL}/GetCompanySetting`);
  }

  saveCompanySetting(dto: FormData) {
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.authService.token()}`
    // });
    return this.http.post(`${this.API_URL}/SaveCompanySetting`, dto);
  }
  getCompanyImagesUrl(Img: string){
    return `${environment.webApiURL}/Files/CompanySettings/${Img}`;
  }
}


