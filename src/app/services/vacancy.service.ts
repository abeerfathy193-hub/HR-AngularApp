import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

// Interface لتحديد شكل البيانات
export interface VacancyDto {
  id?: number;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  employmentType: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  isRemote: boolean;
  numberOfOpenings: number;
  status: string;
  postedDate?: Date;
  closingDate?: Date;
  jobPositionId: number;
  departmentName?: string;
  departmentId?: number;
  positionTitle?: string;
}
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
  applicationSource: string; // Backend expects string
  otherSource?: string;
  applicationRating?: number;
  applicationStatus: string;
  reviewedAt?: Date;
  employeeId?: number;
  appliedAt: Date;
  
}


@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private apiUrl = 'http://localhost:5220/api/vacancy'; 
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // يمكن إضافة Authorization header إذا كان عندك authentication
      // 'Authorization': 'Bearer ' + token
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  // الحصول على جميع الوظائف الشاغرة
  getAllVacancies(): Observable<VacancyDto[]> {
    return this.http.get<VacancyDto[]>(this.apiUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // الحصول على وظيفة شاغرة بالـ ID
  getVacancyById(id: number): Observable<VacancyDto> {
    return this.http.get<VacancyDto>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // الحصول على الوظائف الشاغرة حسب القسم
  getVacanciesByDepartment(departmentId: number): Observable<VacancyDto[]> {
    return this.http.get<VacancyDto[]>(`${this.apiUrl}/department/${departmentId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // إنشاء وظيفة شاغرة جديدة
  createVacancy(vacancy: VacancyDto): Observable<VacancyDto> {
    return this.http.post<VacancyDto>(this.apiUrl, vacancy, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // تحديث وظيفة شاغرة
  updateVacancy(id: number, vacancy: VacancyDto): Observable<VacancyDto> {
    return this.http.put<VacancyDto>(`${this.apiUrl}/${id}`, vacancy, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // حذف وظيفة شاغرة
  deleteVacancy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // الحصول على وظائف شاغرة بحالة معينة
  getVacanciesByStatus(status: string): Observable<VacancyDto[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<VacancyDto[]>(this.apiUrl, { 
      ...this.httpOptions, 
      params 
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  // البحث في الوظائف الشاغرة
  searchVacancies(searchTerm: string): Observable<VacancyDto[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<VacancyDto[]>(`${this.apiUrl}/search`, { 
      ...this.httpOptions, 
      params 
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  // معالجة الأخطاء
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Something went wrong';
    
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل
      errorMessage = `Error : ${error.error.message}`;
    } else {
      // خطأ من الخادم
      errorMessage = `Code Error: ${error.status}\n Message: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
   // Get applications for a vacancy 
  getApplicationsForVacancy(vacancyId: number): Observable<ApplicationDto[]> {
  return this.http.get<ApplicationDto[]>(`${this.apiUrl}/${vacancyId}/applications`);
 }

  // دالة مساعدة لتحويل التاريخ
  private convertDates(vacancy: VacancyDto): VacancyDto {
    if (vacancy.postedDate) {
      vacancy.postedDate = new Date(vacancy.postedDate);
    }
    if (vacancy.closingDate) {
      vacancy.closingDate = new Date(vacancy.closingDate);
    }
    return vacancy;
  }
}