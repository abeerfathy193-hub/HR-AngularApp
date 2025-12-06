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

@Injectable({
  providedIn: 'root' // هذا يجعل الـ Service متاح في كل التطبيق
})
export class OpenVacanciesService{
  // الرابط الأساسي للـ API - تأكد من ضبطه حسب بيئتك
  private apiUrl = 'http://localhost:5220/api/vacancy'; // مثال
  
  // HttpHeaders للتحكم في الـ Headers
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