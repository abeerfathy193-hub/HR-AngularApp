import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from '../interfaces/login.interface';
import { environment } from '../../environments/environment.development';

export interface LoginResponse {
  user: {
    userName: string;
    imagepath: string;
    roles: string[];
  };
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.webApiURL}/api/Account`;

  isAuthenticated: boolean = false;
  currentUser: { userName: string; imagepath: string | null; roles: string[] } | null = null;
  token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      this.token = token;
      this.currentUser = JSON.parse(userStr);
      this.isAuthenticated = true;
    }
  }
  getUserRoles(): string[] | null {
    return this.currentUser ? this.currentUser.roles : null;
  }

  getUserName(): string | null {
    return this.currentUser ? this.currentUser.userName : null;
  }
  getUserImage(): string | null {
    return this.currentUser ? `${environment.webApiURL}/Files/${this.currentUser.imagepath}` : null;
  }
  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials);
  }
  setCredentials(credentials: LoginResponse, rememberMe: boolean = false) {
    debugger;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', credentials.token);
    storage.setItem('currentUser', JSON.stringify(credentials.user));
    this.checkStoredAuth();
  }

  register(registerData: FormData) {
    return this.http.post(`${environment.webApiURL}/api/Applicant/Register`, registerData);
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  }
}
