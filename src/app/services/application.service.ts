import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

// Enums matching backend
export enum ApplicationStatus {
  UnderReview = 'UnderReview',
  InterviewScheduled = 'InterviewScheduled',
  InterviewCompleted = 'InterviewCompleted',
  Hired = 'Hired',
  Rejected = 'Rejected'
}

export enum ApplicationSource {
  LinkedIn = 'LinkedIn',
  Indeed = 'Indeed',
  CompanyWebsite = 'CompanyWebsite',
  Referral = 'Referral',
  Other = 'Other'
}

// DTO matching backend
export interface ApplicationDto {
  id: number;
  applicantId: string;
  vacancyId: number;
  expectedSalary?: number;
  salaryCurrency?: string;
  availableFrom?: Date;
  noticePeriod?: string;
  isOpenToRelocation: boolean;
  preferredLocations?: string;
  yearsOfExperience?: number;
  applicationSource: string;
  otherSource?: string;
  applicationRating?: number;
  applicationStatus: string;
  reviewedAt?: Date;
  employeeId?: number;
  appliedAt: Date;
  userName: string;
  gender: string;
  maritalStatus?: string;
  militaryStatus?: string;
  updatedAt: Date;
}


export interface ApplyRequestDTO {
    applicantId: string;
    vacancyId: number;
    expectedSalary?: number;
    salaryCurrency?: string;
    availableFrom?: string;
    noticePeriod?: string;
    isOpenToRelocation?: boolean;
    preferredLocations?: string;
    yearsOfExperience?: number;
    applicationSource?: ApplicationSource; // Use enum type
    otherSource?: string;
    applicationStatus?: string; // أضف السطر ده

}

export interface VacancyDto {
    id: number;
    title: string;
    description: string;
    department: string;
    location: string;
    employmentType: string;
    salaryRange?: string;
    requirements: string;
    responsibilities: string;
    isActive: boolean;
    createdAt: string;
    deadline?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5220/api/application';

  constructor(private http: HttpClient) { }

  // Apply for a vacancy - تحويل Enum إلى string
  applyForVacancy(request: ApplyRequestDTO): Observable<ApplicationDto> {
    // تحويل request بحيث يكون applicationSource كـ string للـ backend
    const backendRequest = {
      ...request,
      applicationSource: request.applicationSource ? String(request.applicationSource) : 'CompanyWebsite'
    };
    
    return this.http.post<ApplicationDto>(`${this.apiUrl}/apply`, backendRequest);
  }

  // Get applications by applicant
  getByApplicant(applicantId: string): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/applicant/${applicantId}`);
  }

  // Get applications by vacancy
  getByVacancy(vacancyId: number): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/vacancy/${vacancyId}`);
  }


  // Get application by ID
  getById(id: number): Observable<ApplicationDto> {
    return this.http.get<ApplicationDto>(`${this.apiUrl}/${id}`);
  }
  getByIdWithDetails(id: number): Observable<ApplicationDto> {
    return this.http.get<ApplicationDto>(`${this.apiUrl}/applicationDetails/${id}`);
  }
  

  // Update application - تحويل Enum إلى string
  updateApplication(id: number, dto: ApplicationDto): Observable<ApplicationDto> {
    return this.http.put<ApplicationDto>(`${this.apiUrl}/${id}`, dto);
  }

 
  // Delete application
  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
updateStatus(id: number, status: string): Observable<ApplicationDto> {
  return this.http.patch<ApplicationDto>(
    `${this.apiUrl}/${id}/status`, 
    status,  // ✅ بدون JSON.stringify
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

  // دالة مساعدة لتحويل string إلى ApplicationSource enum
  getApplicationSourceFromString(source: string): ApplicationSource {
    switch (source) {
      case 'LinkedIn': return ApplicationSource.LinkedIn;
      case 'Indeed': return ApplicationSource.Indeed;
      case 'CompanyWebsite': return ApplicationSource.CompanyWebsite;
      case 'Referral': return ApplicationSource.Referral;
      case 'Other': return ApplicationSource.Other;
      default: return ApplicationSource.CompanyWebsite;
    }
  }
}