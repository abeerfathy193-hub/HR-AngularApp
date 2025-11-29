import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CameraModel } from "../camera-model/camera-model";
import { CaptureService } from '../../../services/capture.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-in-out-component',
  imports: [CameraModel, CommonModule],
  templateUrl: './check-in-out-component.html',
  styleUrl: './check-in-out-component.css',
})
export class CheckInOutComponent implements OnInit, OnDestroy {
  CheckAttendance = signal<boolean>(false);
  showCameraModal = false;
  currentTime = new Date();
  private clockIntervalId: ReturnType<typeof setInterval> | null = null;
    constructor(private CaptureService: CaptureService) { }

  ngOnInit(): void {
    this.clockIntervalId = setInterval(() => {this.currentTime = new Date()}, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockIntervalId) 
      clearInterval(this.clockIntervalId);
    
  }

  openCameraModal() {
    this.showCameraModal = true;
  }

  closeCameraModal(event: string | null) {
    if (event) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.takeAttendance(event, latitude, longitude);
        },
        (error) => {
          console.error("Cannot get location", error);
        }
      );
    }
    this.showCameraModal = false;
  }
  takeAttendance(format: string, lat: number, lon: number) {
    const payload = {
      EmployeeId: 0,
      ImageBase64: format,
      latitude: lat,
      longitude: lon,
      CheckTime: new Date().toISOString()
    };
    console.log("Attendance Payload:", payload);
    this.CaptureService.takeAttendance(payload)
      .subscribe({
        next: (res) => {this.onCheckInOut(); console.log("Attendance sent successfully", res)},
        error: (err) => console.error("Error sending attendance", err)
      });
  }
  onCheckInOut(): void {
    this.CheckAttendance.set(!this.CheckAttendance());
  }

}
