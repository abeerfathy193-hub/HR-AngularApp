import { Injectable, signal, computed, effect } from '@angular/core';
import { AuthService } from './auth.service';

export interface User {
  username: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {



  constructor(private authService: AuthService) {
    // Sync user data from auth service
    
  }

  logout(): void {
    this.authService.logout();
  }
}


