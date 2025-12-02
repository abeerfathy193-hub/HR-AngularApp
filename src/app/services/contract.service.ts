    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { ContractDto, ContractCreateDto, ContractPointCreateDto, ContractPointDto } from '../interfaces/Contrac.interface';

    @Injectable({
    providedIn: 'root'
    })
    export class ContractService {

    private apiUrl = 'https://localhost:44317/api/Contract';

    constructor(private http: HttpClient) {}

    getAllContracts(): Observable<ContractDto[]> {
        return this.http.get<ContractDto[]>(`${this.apiUrl}/GetAll`);
    }
    getAllActiveContracts(): Observable<ContractDto[]> {
    return this.http.get<ContractDto[]>(`${this.apiUrl}/GetAllActive`);
  }


    getContractById(id: number): Observable<ContractDto> {
        return this.http.get<ContractDto>(`${this.apiUrl}/GetById/${id}`);
    }

    addContract(dto: ContractCreateDto): Observable<ContractDto> {
        return this.http.post<ContractDto>(`${this.apiUrl}/Create`, dto);
    }

    updateContract(dto: ContractDto): Observable<ContractDto> {
        return this.http.put<ContractDto>(`${this.apiUrl}/Update/${dto.id}`, dto);
    }

    deleteContract(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
    }

    addPoint(contractId: number, dto: ContractPointCreateDto): Observable<ContractPointDto> {
        return this.http.post<ContractPointDto>(`${this.apiUrl}/${contractId}/AddPoint`, dto);
    }

    updatePoint(dto: ContractPointDto): Observable<ContractPointDto> {
        return this.http.put<ContractPointDto>(`${this.apiUrl}/UpdatePoint/${dto.id}`, dto);
    }

    removePoint(pointId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/RemovePoint/${pointId}`);
    }
    }

    