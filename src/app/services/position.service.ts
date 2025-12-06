import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IPosition, IPositionCreate, IPositionUpdate } from '../interfaces/position.interface';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly API_URL = `${environment.webApiURL}/api/JobPosition`;

  constructor(private http: HttpClient) {}

  getAllPositions() {
    return this.http.get<IPosition[]>(this.API_URL);
  }
  getPositionsByDepartment(departmentId: number) { 
    return this.http.get<IPosition[]>(`${this.API_URL}/department/${departmentId}`);
  }
  getPositionById(id: number) {
    return this.http.get<IPosition>(`${this.API_URL}/${id}`);
  }

  createPosition(dto: IPositionCreate) {
    return this.http.post(this.API_URL, dto);
  }

  updatePosition(dto: IPositionUpdate) {
    return this.http.put(`${this.API_URL}`, dto);
  }

  deletePosition(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}


