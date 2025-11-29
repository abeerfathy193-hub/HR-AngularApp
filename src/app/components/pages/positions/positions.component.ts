import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PositionService, Position, PositionCreateDto, PositionUpdateDto } from '../../../services/position.service';
import { DepartmentService, Department } from '../../../services/department.service';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.css'
})
export class PositionsComponent implements OnInit {
  positions: Position[] = [];
  allPositions: Position[] = [];
  departments: Department[] = [];
  selectedPosition: Position | null = null;
  selectedDepartmentId: number | null = null;
  isEditing = false;
  isCreating = false;
  loading = false;
  error: string | null = null;

  formData: PositionCreateDto | PositionUpdateDto = {
    title: '',
    description: '',
    departmentId: 0,
    requirements: '',
    salaryRange: '',
    isActive: true
  };

  constructor(
    private positionService: PositionService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadPositions();
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Failed to load departments:', err);
      }
    });
  }

  loadPositions(departmentId?: number): void {
    this.loading = true;
    this.error = null;
    this.positionService.getAll(departmentId).subscribe({
      next: (data) => {
        this.allPositions = data;
        this.filterPositions();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load positions';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterPositions(): void {
    if (this.selectedDepartmentId) {
      this.positions = this.allPositions.filter(p => p.departmentId === this.selectedDepartmentId);
    } else {
      this.positions = this.allPositions;
    }
  }

  onDepartmentChange(): void {
    this.filterPositions();
    if (this.positions.length > 0 && !this.selectedPosition) {
      this.selectPosition(this.positions[0]);
    } else if (this.positions.length === 0) {
      this.selectedPosition = null;
    }
  }

  selectPosition(position: Position): void {
    this.selectedPosition = position;
    this.isEditing = false;
    this.isCreating = false;
    this.formData = { ...position };
  }

  startCreate(): void {
    this.isCreating = true;
    this.isEditing = false;
    this.selectedPosition = null;
    this.formData = {
      title: '',
      description: '',
      departmentId: this.selectedDepartmentId || 0,
      requirements: '',
      salaryRange: '',
      isActive: true
    };
  }

  startEdit(): void {
    if (this.selectedPosition) {
      this.isEditing = true;
      this.isCreating = false;
      this.formData = { ...this.selectedPosition };
    }
  }

  cancel(): void {
    this.isEditing = false;
    this.isCreating = false;
    if (this.selectedPosition) {
      this.formData = { ...this.selectedPosition };
    }
  }

  save(): void {
    if (this.isCreating) {
      this.createPosition();
    } else if (this.isEditing && this.selectedPosition) {
      this.updatePosition();
    }
  }

  createPosition(): void {
    this.loading = true;
    this.error = null;
    this.positionService.create(this.formData as PositionCreateDto).subscribe({
      next: (position) => {
        this.allPositions.push(position);
        this.filterPositions();
        this.selectPosition(position);
        this.isCreating = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create position';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updatePosition(): void {
    if (!this.selectedPosition) return;
    
    this.loading = true;
    this.error = null;
    this.positionService.update(this.selectedPosition.id, this.formData as PositionUpdateDto).subscribe({
      next: (position) => {
        const index = this.allPositions.findIndex(p => p.id === position.id);
        if (index !== -1) {
          this.allPositions[index] = position;
        }
        this.filterPositions();
        this.selectPosition(position);
        this.isEditing = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update position';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deletePosition(id: number): void {
    if (!confirm('Are you sure you want to delete this position?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.positionService.delete(id).subscribe({
      next: () => {
        this.allPositions = this.allPositions.filter(p => p.id !== id);
        this.filterPositions();
        if (this.selectedPosition?.id === id) {
          this.selectedPosition = this.positions.length > 0 ? this.positions[0] : null;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete position';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getDepartmentName(departmentId: number): string {
    const dept = this.departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown';
  }
}


