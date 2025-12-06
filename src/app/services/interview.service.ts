import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InterviewDTO {
  applicationId: number;
  interviewerId: string;
  scheduledDate: string;
  location: string;
  interviewType: string;
  notes?: string;
}

export interface InterviewToReturnDTO {
  id: number;
  applicationId: number;
  interviewerId: string;
  scheduledDate: string;
  location: string;
  interviewType: string;
  notes?: string;
  status?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5220/api/interview';

  scheduleInterview(interviewData: InterviewDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/schedule`, interviewData);
  }

  getInterviewsByApplicantId(applicantId: number): Observable<InterviewToReturnDTO[]> {
    return this.http.get<InterviewToReturnDTO[]>(`${this.baseUrl}/${applicantId}`);
  }

  getInterviewsByInterviewerId(interviewerId: number): Observable<InterviewToReturnDTO[]> {
    return this.http.get<InterviewToReturnDTO[]>(`${this.baseUrl}/interviewer/${interviewerId}`);
  }
}