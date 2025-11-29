import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService, Department, DepartmentCreateDto, DepartmentUpdateDto } from '../../../services/department.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  selectedDepartment: Department | null = null;
  isEditing = false;
  isCreating = false;
  loading = false;
  error: string | null = null;

  formData: DepartmentCreateDto | DepartmentUpdateDto = {
    name: '',
    description: '',
    managerId: undefined,
    companyId: undefined
  };

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.error = null;
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
        if (data.length > 0 && !this.selectedDepartment) {
          this.selectDepartment(data[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load departments';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectDepartment(department: Department): void {
    this.selectedDepartment = department;
    this.isEditing = false;
    this.isCreating = false;
    this.formData = { ...department };
  }

  startCreate(): void {
    this.isCreating = true;
    this.isEditing = false;
    this.selectedDepartment = null;
    this.formData = {
      name: '',
      description: '',
      managerId: undefined,
      companyId: undefined
    };
  }

  startEdit(): void {
    if (this.selectedDepartment) {
      this.isEditing = true;
      this.isCreating = false;
      this.formData = { ...this.selectedDepartment };
    }
  }

  cancel(): void {
    this.isEditing = false;
    this.isCreating = false;
    if (this.selectedDepartment) {
      this.formData = { ...this.selectedDepartment };
    }
  }

  save(): void {
    if (this.isCreating) {
      this.createDepartment();
    } else if (this.isEditing && this.selectedDepartment) {
      this.updateDepartment();
    }
  }

  createDepartment(): void {
    this.loading = true;
    this.error = null;
    this.departmentService.create(this.formData as DepartmentCreateDto).subscribe({
      next: (department) => {
        this.departments.push(department);
        this.selectDepartment(department);
        this.isCreating = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create department';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateDepartment(): void {
    if (!this.selectedDepartment) return;
    
    this.loading = true;
    this.error = null;
    this.departmentService.update(this.selectedDepartment.id, this.formData as DepartmentUpdateDto).subscribe({
      next: (department) => {
        const index = this.departments.findIndex(d => d.id === department.id);
        if (index !== -1) {
          this.departments[index] = department;
        }
        this.selectDepartment(department);
        this.isEditing = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update department';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteDepartment(id: number): void {
    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.departmentService.delete(id).subscribe({
      next: () => {
        this.departments = this.departments.filter(d => d.id !== id);
        if (this.selectedDepartment?.id === id) {
          this.selectedDepartment = this.departments.length > 0 ? this.departments[0] : null;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete department';
        this.loading = false;
        console.error(err);
      }
    });
  }
}


