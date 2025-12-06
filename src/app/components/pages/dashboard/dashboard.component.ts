import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from '../../../services/requests.service';
import { RouterLink, RouterModule } from '@angular/router';
import { UserTemp } from '../../../services/userTemp.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats = [
    { label: 'Total Employees', value: '245', icon: '👥', color: 'primary' },
    { label: 'Active Contracts', value: '189', icon: '📄', color: 'success' },
    { label: 'Pending Leaves', value: '12', icon: '🏖️', color: 'warning' },
    { label: 'Today Attendance', value: '198', icon: '⏰', color: 'info' },
  ];

  pendingRequests: RequestTableItem[] = [];
  StatusMap: any = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Cancelled',
  };

  id: any;
  empId: any;

  constructor(private requestsService: RequestsService, private userService: UserTemp) {}

  ngOnInit(): void {
    this.id = this.userService.getUserId();
    console.log('User Id:', this.id);

    this.userService.getEmp(this.id).subscribe({
      next: (data) => {
        console.log('API Response:', data); // <-- you will see it here
        this.empId = data.employee.id;
        console.log('Employee ID:', this.empId);
        this.loadPendingRequests(this.empId);
      },
      error: (err) => {
        console.error('Error fetching employee:', err);
      },
    });
  }
  // ====================
  loadPendingRequests(id: number) {
    this.requestsService.GetRequestsForApproval(id).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : res.result;
        this.pendingRequests = (data ?? []).map((r: any) => ({
          id: r.id,
          type: r.type,
          date: r.date,
          status: this.StatusMap[r.status], // StatusMap applied here
          name: r.name ?? 'N/A',
        }));
      },
      error: (err) => console.error(err),
    });
  }

  handleRequest(req: any, action: 'approve' | 'reject') {
    if (action == 'approve') {
      const confirmed = confirm('Are you sure you want to Approve this request?');
      if (confirmed) {
        const newStatus = 1;
        // Approved
        const dto = {
          Id: req.id,
          NewStatus: newStatus,
          UpdatedByUserId: this.empId, // logged-in HR/admin ===================
        };
        this.requestsService.updateRequestStatus(req.type, dto).subscribe({
          next: () => {
            // refresh the table
            this.loadPendingRequests(this.empId);
          },
          error: (err) => console.error(err),
        });
      }
    } else {
      const rejected = confirm('Are you sure you want to Reject this request?');
      if (rejected) {
        const newStatus = 2;
        // Rejected
        const dto = {
          Id: req.id,
          NewStatus: newStatus,
          UpdatedByUserId: this.empId, // logged-in HR/admin ===================
        };
        this.requestsService.updateRequestStatus(req.type, dto).subscribe({
          next: () => {
            // refresh the table
            this.loadPendingRequests(this.empId);
          },
          error: (err) => console.error(err),
        });
      }
    }
  }
}
