import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RequestsService } from '../../../services/requests.service';
import { LeaveRequest } from '../../../interfaces/leaveRequest.interface';
import { CommonModule } from '@angular/common';
import { ResignationRequest } from '../../../interfaces/resignationRequest.interface';
import { Employee, Person, UserTemp } from '../../../services/userTemp.service';

@Component({
  selector: 'app-requests',
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './requests.html',
  styleUrl: './requests.css',
})
export class Requests implements OnInit {
  allRequests: RequestTableItem[] = [];
  employee: Employee | null = null;
  person: Person | null = null;
  constructor(private requestsService: RequestsService, private userService: UserTemp) {}

  ngOnInit(): void {
    this.userService.getUserData().subscribe((data) => {
      this.employee = data.employee;
      this.person = data.person;
      this.loadRequests(this.StatusMap);
    });
  }
  StatusMap: { [key: string]: string } = {
    '0': 'Pending',
    '1': 'Approved',
    '2': 'Rejected',
    '3': 'Cancelled',
  };

  addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().substring(0, 10);
  }

  loadRequests(StatusMap: any) {
    this.requestsService.GetRequestsByEmployeeID(1).subscribe({
      next: (req) => {
        this.allRequests = req.result.map((r) => ({
          id: r.id,
          type: r.type,
          date: r.date,
          status: StatusMap[r.status],
          name: r.name,
        }));
      },
      error: (err) => console.error('Leave request error', err),
    });
  }

  cancelRequest(requestId: number, requestType: string) {
    const confirmed = confirm('Are you sure you want to cancel this request?');
    if (confirmed) {
      this.requestsService.cancelRequest(requestId, requestType, 1).subscribe({
        next: () => {
          alert('Request canceled successfully!');
          this.loadRequests(this.StatusMap); // reload the list
        },
        error: (err) => console.error(err),
      });
    }
  }
}
