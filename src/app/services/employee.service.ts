import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { EmployeeDto, AddEmployee, UpdateEmployeeDto } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = `${environment.webApiURL}/api/Employee`;

  constructor(private http: HttpClient) {}

  getAllEmployees() {
    return this.http.get<EmployeeDto[]>(`${this.API_URL}/Employees`);
  }

  getEmployeeById(id: number) {
    return this.http.get<EmployeeDto>(`${this.API_URL}/Employee/${id}`);
  }

  addEmployee(employeeData: FormData){
    return this.http.post(`${this.API_URL}/AddEmployee`, employeeData);
  }

  updateEmployee(id: number, employeeData: FormData) {
    return this.http.put<EmployeeDto>(`${this.API_URL}/UpdateEmployee/${id}`, employeeData);
  }

  deleteEmployee(id: number) {
    return this.http.delete<void>(`${this.API_URL}/DeleteEmployee/${id}`);
  }
}

