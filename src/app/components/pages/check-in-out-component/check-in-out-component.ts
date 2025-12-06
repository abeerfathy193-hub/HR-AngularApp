import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CameraModel } from "../camera-model/camera-model";
import { AttendanceService } from '../../../services/attendance.service';
import { CommonModule } from '@angular/common';
import { AttendanceTaken, FaceData } from '../../../interfaces/attendance.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-check-in-out-component',
  imports: [CameraModel, CommonModule],
  templateUrl: './check-in-out-component.html',
  styleUrl: './check-in-out-component.css',
})
export class CheckInOutComponent implements OnInit, OnDestroy {
  IsAttended = false;
  showCameraModal = false;
  currentTime = new Date();
  private clockIntervalId: ReturnType<typeof setInterval> | null = null;
  constructor(private attendanceService: AttendanceService, private authService :AuthService) { }

  ngOnInit(): void {
    this.clockIntervalId = setInterval(() => { this.currentTime = new Date() }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockIntervalId)
      clearInterval(this.clockIntervalId);

  }

  openCameraModal() {
    this.showCameraModal = true;
  }


  onDetect(input: FaceData | null) {
    if (input) {
      this.onAttend(input);
      this.showCameraModal = false;
    }
  }

  onAttend(input: FaceData) {

    const attendance = {
      checkTime: new Date(),
      ImageBase64: input.image,
      longitude: input.coords.longitude,
      latitude: input.coords.latitude
    } as AttendanceTaken;
    if (this.IsAttended) {
      this.attendanceService.setCheckOut(attendance)
        .subscribe({
          next: (res) => { this.onCheckInOut(); console.log("Attendance sent successfully", res) },
          error: (err) => console.error("Error sending attendance", err)
        });
    }
    else {
      this.attendanceService.setCheckIn(attendance)
        .subscribe({
          next: (res) => { this.onCheckInOut(); console.log("Attendance sent successfully", res) },
          error: (err) => console.error("Error sending attendance", err)
        });
    }

  }
  onCheckInOut(): void {
    this.IsAttended = !this.IsAttended;
  }

}
