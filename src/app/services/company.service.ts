import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Company {
  id: number;
  name: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  radiusInMeters?: number | null;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyCreateDto {
  name: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  radiusInMeters?: number | null;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
}

export interface CompanyUpdateDto {
  name?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  radiusInMeters?: number | null;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly API_URL = `${environment.webApiURL}/api/Company`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.API_URL);
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.API_URL}/${id}`);
  }

  create(dto: CompanyCreateDto): Observable<Company> {
    return this.http.post<Company>(this.API_URL, dto);
  }

  update(id: number, dto: CompanyUpdateDto): Observable<Company> {
    return this.http.put<Company>(`${this.API_URL}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}


