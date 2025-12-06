import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import { IDepartment, IDepartmentCreate, IDepartmentUpdate } from '../../../interfaces/department.interface';
declare var bootstrap: any;


@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {

  departments: IDepartment[] = [];
  filteredDepartments: IDepartment[] = [];
  paginatedDepartments: IDepartment[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  loading: boolean = false;
  isEditMode: boolean = false;
  DepartmentId?: number;

  DepartmentForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(2)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    isActive: new FormControl(false)
  });

  constructor(private departmentService: DepartmentService) { }
  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (data: IDepartment[]) => {
        this.departments = data;
        this.filteredDepartments = this.departments;
        this.applyPagination();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading departments', err);
        this.loading = false;
      }
    });
  }
  applyPagination(): void {
    this.totalPages = Math.ceil(this.filteredDepartments.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = (startIndex + this.itemsPerPage) > this.filteredDepartments.length ? this.filteredDepartments.length : (startIndex + this.itemsPerPage);
    this.paginatedDepartments = this.filteredDepartments.slice(startIndex, endIndex);
  }

  onSearch(searchVal: string): void {
    if (searchVal) {
      const val = searchVal.toLowerCase().trim();
      if (val) {
        this.filteredDepartments = this.departments.filter(dept =>
          dept.code.toLowerCase().includes(val) ||
          dept.name.toLowerCase().includes(val) ||
          (dept.description && dept.description.toLowerCase().includes(val))
        );
      }
    }
    else
      this.filteredDepartments = this.departments;
    this.currentPage = 1;
    this.applyPagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination();
    }
  }
  onStatusChange(event: any) {
    this.DepartmentForm.patchValue({ isActive: event.target.checked });
  }
  openCreateModal(): void {
    this.isEditMode = false;
    this.DepartmentId = undefined;
    this.DepartmentForm.reset({
      code: '',
      name: '',
      description: '',
      isActive: false,
    });

    const modalElement = document.getElementById('departmentModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  openEditModal(department: IDepartment): void {
    this.isEditMode = true;
    this.DepartmentId = department.id;

    this.DepartmentForm.patchValue({
      code: department.code,
      name: department.name,
      description: department.description || '',
      isActive: department.isActive,
    });

    const modalElement = document.getElementById('departmentModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  saveDepartment(): void {
    if (this.DepartmentForm.valid) {

      this.loading = true;
      if (this.isEditMode && this.DepartmentId) {
        const departmentData = {
          id: this.DepartmentId || 0,
          code: this.DepartmentForm.value.code?.trim()!,
          name: this.DepartmentForm.value.name?.trim()!,
          description: this.DepartmentForm.value.description?.trim() || '',
          isActive: this.DepartmentForm.value.isActive,
        } as IDepartmentUpdate;
        this.departmentService.update(departmentData).subscribe({
          next: (res: any) => {
            this.loading = false;
            this.closeModal();
            this.loadDepartments();
          },
          error: (err: any) => {
            console.error('Error saving department', err);
            this.loading = false;
          }
        });
      }
      else {
        const departmentData = {
          code: this.DepartmentForm.value.code?.trim()!,
          name: this.DepartmentForm.value.name?.trim()!,
          description: this.DepartmentForm.value.description?.trim() || '',
          isActive: this.DepartmentForm.value.isActive,
        } as IDepartmentCreate;
        this.departmentService.create(departmentData).subscribe({
          next: (res: any) => {
            this.loading = false;
            this.closeModal();
            this.loadDepartments();
          },
          error: (err: any) => {
            console.error('Error saving department', err);
            this.loading = false;
          }
        });
      }
    }
  }

  deleteDepartment(department: IDepartment): void {
    if (confirm(`Are you sure you want to delete department "${department.name}"?`)) {
      this.loading = true;
      this.departmentService.delete(department.id).subscribe({
        next: (res: any) => {
          this.loading = false;
          alert('Department deleted successfully!');
          this.loadDepartments();
        },
        error: (err: any) => {
          console.error('Error deleting department', err);
          this.loading = false;
        }
      });
    }
  }



  // Close modal
  closeModal(): void {
    const modalElement = document.getElementById('departmentModal')!;
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  // Helper method to check if form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.DepartmentForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}