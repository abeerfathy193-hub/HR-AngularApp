import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CaptureService {
  private apiURL = environment.webApiURL;
  constructor(private myClient: HttpClient) { }
  takeAttendance(payload: any) {
    debugger
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
    return this.myClient.post(this.apiURL + "/api/Attendance/CheckIn", payload);
  }
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}

