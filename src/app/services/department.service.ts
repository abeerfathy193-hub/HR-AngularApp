import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  managerName?: string;
  companyId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DepartmentCreateDto {
  name: string;
  description?: string;
  managerId?: number;
  companyId?: number;
}

export interface DepartmentUpdateDto {
  name?: string;
  description?: string;
  managerId?: number;
  companyId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly API_URL = `${environment.webApiURL}/api/Department`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.API_URL);
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.API_URL}/${id}`);
  }

  create(dto: DepartmentCreateDto): Observable<Department> {
    return this.http.post<Department>(this.API_URL, dto);
  }

  update(id: number, dto: DepartmentUpdateDto): Observable<Department> {
    return this.http.put<Department>(`${this.API_URL}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}


