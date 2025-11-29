import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    { label: 'Total Employees', value: '245', icon: '👥', color: 'primary' },
    { label: 'Active Contracts', value: '189', icon: '📄', color: 'success' },
    { label: 'Pending Leaves', value: '12', icon: '🏖️', color: 'warning' },
    { label: 'Today Attendance', value: '198', icon: '⏰', color: 'info' }
  ];
}

