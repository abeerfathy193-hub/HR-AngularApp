    // src/app/services/leave-type.service.ts

    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { LeaveType, LeaveTypeCreateDto, LeaveTypeUpdateDto } from '../interfaces/leavetypes.interface';
    import { environment } from '../../environments/environment';

    @Injectable({
    providedIn: 'root'
    })
    export class LeaveTypeService {
    private apiUrl = 'https://localhost:44317/api/LeaveType';

    constructor(private http: HttpClient) {}

    getAll(): Observable<LeaveType[]> {
        return this.http.get<LeaveType[]>(`${this.apiUrl}/LeaveTypes`);
    }

    getById(id: number): Observable<LeaveType> {
        return this.http.get<LeaveType>(`${this.apiUrl}/LeaveTypeWithId/${id}`);
    }

    create(leaveType: LeaveTypeCreateDto): Observable<LeaveType> {
        return this.http.post<LeaveType>(`${this.apiUrl}/CreateLeaveType`, leaveType);
    }

    update(leaveType: LeaveTypeUpdateDto): Observable<LeaveType> {
        return this.http.put<LeaveType>(`${this.apiUrl}/UpdateLeaveType`, leaveType);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/DeleteLeaveTypeWithId/${id}`);
    }
    }