import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IDepartment, IDepartmentCreate, IDepartmentUpdate } from '../interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly API_URL = `${environment.webApiURL}/api/Department`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<IDepartment[]>(`${this.API_URL}/GetAll`);
  }

  getById(id: number) {
    return this.http.get<IDepartment>(`${this.API_URL}/GetDepartmentById/${id}`);
  }


  create(dto: IDepartmentCreate) {
    return this.http.post(`${this.API_URL}/CreateDepartment`, dto);
  }

  update(dto: IDepartmentUpdate) {
    return this.http.put<IDepartment>(`${this.API_URL}/UpdateDepartment`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.API_URL}/DeleteDepartment/${id}`);
  }
}


