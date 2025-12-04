import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { PositionService } from '../../../services/position.service';
import { DepartmentService } from '../../../services/department.service';
import { IPosition, IPositionCreate, IPositionUpdate } from '../../../interfaces/position.interface';
import { IDepartment } from '../../../interfaces/department.interface';
declare var bootstrap: any;


@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.css'
})
export class PositionsComponent implements OnInit {

  positions: IPosition[] = [];
  filteredPositions: IPosition[] = [];
  paginatedPositions: IPosition[] = [];
  departments: IDepartment[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  loading: boolean = false;
  isEditMode: boolean = false;
  positionId?: number;
  selectedDepartmentId?: number;

  PositionForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    departmentId: new FormControl<number | null>(null, [Validators.required]),
  });

  constructor(
    private positionService: PositionService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadPositions();
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data: IDepartment[]) => {
        this.departments = data.filter(dept => dept.isActive);
      },
      error: (err: any) => {
        console.error('Error loading departments', err);
      }
    });
  }

  loadPositions(): void {
    this.loading = true;
    this.positionService.getAllPositions().subscribe({
      next: (data: IPosition[]) => {
        this.positions = data;
        this.filteredPositions = this.positions;
        this.applyPagination();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading positions', err);
        this.loading = false;
      }
    });
  }

  applyPagination(): void {
    this.totalPages = Math.ceil(this.filteredPositions.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPositions = this.filteredPositions.slice(startIndex, endIndex);
  }

  onSearch(searchVal: string): void {
    if (searchVal) {
      const val = searchVal.toLowerCase().trim();
      if (!val) {
        this.filteredPositions = this.positions;
      } else {
        this.filteredPositions = this.positions.filter(pos =>
          pos.title.toLowerCase().includes(val) ||
          (pos.description && pos.description.toLowerCase().includes(val))
        );
        this.currentPage = 1;
        this.applyPagination();
      }
    } else {
      this.filteredPositions = this.positions;
      this.currentPage = 1;
      this.applyPagination();
    }
  }

  onDepartmentFilterChange(departmentId: string): void {
    const deptId = departmentId ? parseInt(departmentId) : undefined;
    this.selectedDepartmentId = deptId;
    
    if (deptId) {
      this.filteredPositions = this.positions.filter(pos => pos.departmentId === deptId);
    } else {
      this.filteredPositions = this.positions;
    }
    this.currentPage = 1;
    this.applyPagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.positionId = undefined;
    this.PositionForm.reset({
      title: '',
      description: '',
      departmentId: null,
    });

    const modalElement = document.getElementById('positionModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  openEditModal(position: IPosition): void {
    this.isEditMode = true;
    this.positionId = position.id;

    this.PositionForm.patchValue({
      title: position.title,
      description: position.description || '',
      departmentId: position.departmentId,
    });

    const modalElement = document.getElementById('positionModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  savePosition(): void {
    if (this.PositionForm.valid) {
      this.loading = true;

      if (this.isEditMode && this.positionId) {
        const positionData = {
          id: this.positionId || 0,
          title: this.PositionForm.value.title?.trim()!,
          description: this.PositionForm.value.description?.trim() || '',
          departmentId: this.PositionForm.value.departmentId!,
          isActive: true,
        } as IPositionUpdate;
        this.positionService.updatePosition(positionData).subscribe({
          next: (res: any) => {
            this.loading = false;
            this.closeModal();
            this.loadPositions();
          },
          error: (err: any) => {
            console.error('Error saving position', err);
            this.loading = false;
            this.loadPositions();
          }
        });
      }
      else {
        const positionData = {
          title: this.PositionForm.value.title?.trim()!,
          description: this.PositionForm.value.description?.trim() || '',
          departmentId: this.PositionForm.value.departmentId!,
          isActive: true,
        } as IPositionCreate;
        this.positionService.createPosition(positionData).subscribe({
          next: (res: any) => {
            this.loading = false;
            this.closeModal();
            this.loadPositions();
          },
          error: (err: any) => {
            console.error('Error saving position', err);
            this.loading = false;
          }
        });
      }
    }
  }

  deletePosition(position: IPosition): void {
    if (confirm(`Are you sure you want to delete position "${position.title}"?`)) {
      this.loading = true;
      this.positionService.deletePosition(position.id).subscribe({
        next: (res: any) => {
          this.loadPositions();
          alert('Position deleted successfully!');
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error deleting position', err);
          this.loading = false;
        }
      });
    }
  }

  // Close modal
  closeModal(): void {
    const modalElement = document.getElementById('positionModal')!;
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  // Helper method to check if form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.PositionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getDepartmentName(departmentId: number): string {
    const dept = this.departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'N/A';
  }
}
