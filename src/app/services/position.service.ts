import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Position {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  departmentName?: string;
  requirements?: string;
  salaryRange?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PositionCreateDto {
  title: string;
  description?: string;
  departmentId: number;
  requirements?: string;
  salaryRange?: string;
  isActive?: boolean;
}

export interface PositionUpdateDto {
  title?: string;
  description?: string;
  departmentId?: number;
  requirements?: string;
  salaryRange?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly API_URL = `${environment.webApiURL}/api/JobPosition`;

  constructor(private http: HttpClient) {}

  getAll(departmentId?: number): Observable<Position[]> {
    let params = new HttpParams();
    if (departmentId) {
      params = params.set('departmentId', departmentId.toString());
    }
    return this.http.get<Position[]>(this.API_URL, { params });
  }

  getById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.API_URL}/${id}`);
  }

  create(dto: PositionCreateDto): Observable<Position> {
    return this.http.post<Position>(this.API_URL, dto);
  }

  update(id: number, dto: PositionUpdateDto): Observable<Position> {
    return this.http.put<Position>(`${this.API_URL}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}


