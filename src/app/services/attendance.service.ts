import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AttendanceTaken } from '../interfaces/attendance.interface';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiURL = `${environment.webApiURL}/api/Attendance`;
  constructor(private myClient: HttpClient) { }
  setCheckIn(attendance: AttendanceTaken) {
    return this.myClient.post(this.apiURL + "/check-in", attendance);
  }
  setCheckOut(attendance: AttendanceTaken) {
    return this.myClient.post(this.apiURL + "/check-out", attendance);
  }
}

