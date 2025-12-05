    // src/app/services/holiday.service.ts

    import { Injectable } from '@angular/core';
    import { HttpClient, HttpParams } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { Holiday, HolidayCreateDto, HolidayUpdateDto, SyncResponse, PreviewResponse } from '../interfaces/holiday.interface';
    import { environment } from '../../environments/environment';

    @Injectable({
    providedIn: 'root'
    })
    export class HolidayService {
    private apiUrl = 'https://localhost:7138/api/Holiday';

    constructor(private http: HttpClient) {}

    // Read operations
    getAll(): Observable<Holiday[]> {
        return this.http.get<Holiday[]>(`${this.apiUrl}/GetAll`);
    }

    getActive(): Observable<Holiday[]> {
        return this.http.get<Holiday[]>(`${this.apiUrl}/active`);
    }

    getById(id: number): Observable<Holiday> {
        return this.http.get<Holiday>(`${this.apiUrl}/GetById/${id}`);
    }

    getByYear(year: number): Observable<Holiday[]> {
        return this.http.get<Holiday[]>(`${this.apiUrl}/year/${year}`);
    }

    // Create, Update, Delete operations
    add(holiday: HolidayCreateDto): Observable<Holiday> {
        return this.http.post<Holiday>(`${this.apiUrl}/Add`, holiday);
    }

    update(id: number, holiday: HolidayUpdateDto): Observable<Holiday> {
        return this.http.put<Holiday>(`${this.apiUrl}/Update/${id}`, holiday);
    }

    deactivate(id: number, deletedBy: string): Observable<void> {
        const params = new HttpParams().set('deletedBy', deletedBy);
        return this.http.delete<void>(`${this.apiUrl}/Deactivate/${id}`, { params });
    }

    // Calendarific API operations
    syncFromApi(year: number, countryCode: string = 'EG', syncedBy: string = 'Admin'): Observable<SyncResponse> {
        const params = new HttpParams()
        .set('year', year.toString())
        .set('countryCode', countryCode)
        .set('syncedBy', syncedBy);
        return this.http.post<SyncResponse>(`${this.apiUrl}/sync`, null, { params });
    }

    previewApiHolidays(year: number, countryCode: string = 'EG'): Observable<PreviewResponse> {
        const params = new HttpParams()
        .set('year', year.toString())
        .set('countryCode', countryCode);
        return this.http.get<PreviewResponse>(`${this.apiUrl}/preview`, { params });
    }
    }