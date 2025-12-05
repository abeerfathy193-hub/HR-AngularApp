import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeDto } from '../../../interfaces/employee.interface';

@Component({
  selector: 'app-employee-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-component.html',
  styleUrl: './employee-component.css'
})
export class EmployeeComponent implements OnInit {
  employees: EmployeeDto[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the API is running.';
        } else if (error.status === 404) {
          this.errorMessage = 'API endpoint not found. Please check the API URL.';
        } else {
          this.errorMessage = error.error?.message || error.message || 'Failed to load employees';
        }
        this.isLoading = false;
      }
    });
  }

  addEmployee(): void {
    this.router.navigate(['/employees-data/employees/create']);
  }

  view(id: number): void {
    this.router.navigate(['/employees-data/employees/view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/employees-data/employees/edit', id]);
  }

  delete(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to delete employee');
        console.error('Error deleting employee:', error);
      }
    });
  }
}
