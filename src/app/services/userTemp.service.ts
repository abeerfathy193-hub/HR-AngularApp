import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  nationalId: string | null;
  passPort: string;
  ssnId: number;
  personId: string;
  contractId: number;
  positionID: number;
  nationalIdPath: string | null;
  passportPath: string;
  birthCertificatePath: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
  isActive: boolean;
}

export interface Person {
  id: string;
  fullName: string;
  birthDate: string;
  gender: number;
  address: string;
  country: string;
  maritalStatus: number;
  nationality: string;
  education: string;
  militaryStatus: number;
  isEmailConfirmed: boolean;
  logInBY: number;
  imgPath: string;
  cvPath: string;
  militaryPath: string;
  educationPath: string;
  userName: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface UserData {
  employee: Employee;
  person: Person;
}

@Injectable({
  providedIn: 'root',
})
export class UserTemp {
  constructor(private http: HttpClient) {}
  private Url = 'http://localhost:5220/api/Employee/Employees';
  private personUrl = 'http://localhost:5220/api/Employee/Employees/person';

  getUserData(id: any): Observable<UserData> {
    return this.http.get<UserData>(`${this.Url}/${id}`);
  }
  getEmp(id: any) {
    return this.http.get<UserData>(`${this.personUrl}/${id}`);
  }

  getUserId(): string | null {
    const token = localStorage.getItem('authToken'); // or sessionStorage
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return (
      decoded['nameid'] ||
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      null
    );
  }
}
