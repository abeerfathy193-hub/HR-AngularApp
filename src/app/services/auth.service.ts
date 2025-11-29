import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../interfaces/login.interface';
import { environment } from '../../environments/environment.development';



export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.webApiURL}'/api/Account`; 
  private _isAuthenticated = signal<boolean>(false);
  private _token = signal<string | null>(null);
  private _currentUser = signal<LoginResponse['user'] | null>(null);

  isAuthenticated = this._isAuthenticated.asReadonly();
  currentUser = this._currentUser.asReadonly();
  token = this._token.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in (from localStorage)
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    // Check both localStorage and sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this._token.set(token);
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest, rememberMe: boolean = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        // Store authentication data
        this._token.set(response.token);
        this._currentUser.set(response.user);
        this._isAuthenticated.set(true);
        
        // Use localStorage for "Remember Me", sessionStorage otherwise
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', response.token);
        storage.setItem('currentUser', JSON.stringify(response.user));
        storage.setItem('rememberMe', rememberMe.toString());
      })
    );
  }

  socialLogin(provider: 'google' | 'facebook' | 'microsoft'): Observable<LoginResponse> {
    // Open OAuth login in a popup window
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const redirectUrl = `${this.API_URL}/external-login/${provider}`;
    const popup = window.open(
      redirectUrl,
      `${provider}Login`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    return new Observable<LoginResponse>((observer) => {
      if (!popup) {
        observer.error(new Error('Popup blocked. Please allow popups for this site.'));
        return;
      }

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'OAUTH_SUCCESS') {
          const response: LoginResponse = event.data.response;
          
          // Store authentication data
          this._token.set(response.token);
          this._currentUser.set(response.user);
          this._isAuthenticated.set(true);
          
          // Store in localStorage for social logins (treat as "remember me")
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('rememberMe', 'true');
          
          window.removeEventListener('message', messageListener);
          popup.close();
          observer.next(response);
          observer.complete();
        } else if (event.data.type === 'OAUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          popup.close();
          observer.error(new Error(event.data.error || 'Social login failed'));
        }
      };

      window.addEventListener('message', messageListener);

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          if (!this._isAuthenticated()) {
            observer.error(new Error('Login cancelled'));
          }
        }
      }, 1000);

      // Fallback: if backend redirects to a callback URL, handle it
      // This is a backup method if popup messaging doesn't work
      const originalUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('token') && urlParams.get('provider') === provider) {
        const token = urlParams.get('token')!;
        const userStr = urlParams.get('user');
        if (userStr) {
          try {
            const user = JSON.parse(decodeURIComponent(userStr));
            const response: LoginResponse = { token, user };
            
            this._token.set(token);
            this._currentUser.set(user);
            this._isAuthenticated.set(true);
            
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('rememberMe', 'true');
            
            // Clean URL
            window.history.replaceState({}, document.title, originalUrl.split('?')[0]);
            
            observer.next(response);
            observer.complete();
          } catch (error) {
            observer.error(new Error('Failed to parse user data'));
          }
        }
      }
    });
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private clearAuth(): void {
    this._token.set(null);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  }
}

