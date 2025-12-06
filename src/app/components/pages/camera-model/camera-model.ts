import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { FaceData } from '../../../interfaces/attendance.interface';
@Component({
  selector: 'app-camera-model',
  imports: [],
  templateUrl: './camera-model.html',
  styleUrl: './camera-model.css',
})
export class CameraModel implements OnInit {

  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>; //Refer to video template - static: true to access in ngOnInit, by default it's false and must be accessed in ngAfterViewInit
  @Output() faceDetected = new EventEmitter<FaceData | null>(); //Emit captured image as data URL or null if no face detected
  stream: MediaStream | null = null; //To store the camera streaming
  currentLocation: { latitude: number; longitude: number } | null = null;

  async ngOnInit() {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        });
      await this.loadModels();
      await this.startCameraAndDetect();
    } catch (err) {
      console.error("Error initializing camera or models", err);
      alert("Camera or face detection failed!");
      this.faceDetected.emit(null);
    }
  }

  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/model'); //Detect faces
    await faceapi.nets.faceLandmark68Net.loadFromUri('/model'); //Detect facial landmarks (eyes, nose, mouth, etc.)
    // await faceapi.nets.faceRecognitionNet.loadFromUri('/model'); //Recognize faces
  }

  async startCameraAndDetect() {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true }); //Make request for accessing camera
    this.video.nativeElement.srcObject = this.stream; //Assign stream to video element

    this.video.nativeElement.onloadedmetadata = () => {
      this.video.nativeElement.play(); //Wait until loading video data and play it

      this.video.nativeElement.addEventListener("playing", () => {
        this.detectFaceLoop(); //Once video is playing, start detecting faces
      });
    };
  }

  async detectFaceLoop() {
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 416,
      scoreThreshold: 0.6
    });
    const detect = async () => {
      const detection = await faceapi.detectSingleFace(this.video.nativeElement, options); //Detect single face on video streaming 
      if (!detection) {
        requestAnimationFrame(detect); //If no face detected, continue detection - instead of setInterval cause it's asynchronous with updating video frames
      } else {
        console.log("FACE DETECTED", detection);
        const capturedImage = this.captureImage();
        this.stopCamera();
        this.faceDetected.emit({ image: capturedImage, coords: this.currentLocation!});
      }
    };
    detect();
  }

  captureImage(): string {
    const canvas = document.createElement('canvas');
    const video = this.video.nativeElement;

    canvas.width = Math.min(video.videoWidth, 1024);
    canvas.height = (canvas.width / video.videoWidth) * video.videoHeight;

    const ctx = canvas.getContext('2d')!;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.filter = 'contrast(1.1) brightness(1.05)';

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.85);
  }
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  closeModal() {
    this.stopCamera();
    this.faceDetected.emit(null);
  }
}
