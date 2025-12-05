// src/app/components/pages/leave-type/leave-type.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LeaveTypeService } from '../../../services/leavetype.service';
import { LeaveType, LeaveTypeCreateDto, LeaveTypeUpdateDto } from '../../../interfaces/leavetypes.interface';

@Component({
  selector: 'app-leave-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './leavetypscomponant.html',
  styleUrls: ['./leavetypscomponant.css']
})
export class LeaveTypeComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  filteredLeaveTypes: LeaveType[] = [];
  leaveTypeForm: FormGroup;
  
  isLoading = false;
  showModal = false;
  isEditMode = false;
  editingLeaveTypeId?: number;
  searchTerm = '';
  filterActive: string = 'all'; // 'all', 'active', 'inactive'

  constructor(
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder
  ) {
    this.leaveTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      maxDaysPerYear: [null, [Validators.min(0), Validators.max(365)]],
      isPaid: [true],
      requiresApproval: [true],
      requiresAttachment: [false],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadLeaveTypes();
  }

  loadLeaveTypes(): void {
    this.isLoading = true;
    this.leaveTypeService.getAll().subscribe({
      next: (data) => {
        this.leaveTypes = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading leave types:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.leaveTypes];

    // Apply active filter
    if (this.filterActive === 'active') {
      filtered = filtered.filter(lt => lt.isActive === true);
    } else if (this.filterActive === 'inactive') {
      filtered = filtered.filter(lt => lt.isActive === false);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(lt =>
        lt.name.toLowerCase().includes(term) ||
        lt.description?.toLowerCase().includes(term)
      );
    }

    this.filteredLeaveTypes = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingLeaveTypeId = undefined;
    this.leaveTypeForm.reset({
      isPaid: true,
      requiresApproval: true,
      requiresAttachment: false,
      isActive: true
    });
    this.showModal = true;
  }

  openEditModal(leaveType: LeaveType): void {
    this.isEditMode = true;
    this.editingLeaveTypeId = leaveType.id;
    this.leaveTypeForm.patchValue({
      name: leaveType.name,
      description: leaveType.description,
      maxDaysPerYear: leaveType.maxDaysPerYear,
      isPaid: leaveType.isPaid,
      requiresApproval: leaveType.requiresApproval,
      requiresAttachment: leaveType.requiresAttachment,
      isActive: leaveType.isActive
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.leaveTypeForm.reset();
  }

  saveLeaveType(): void {
    if (this.leaveTypeForm.invalid) return;

    this.isLoading = true;
    const formValue = this.leaveTypeForm.value;

    if (this.isEditMode && this.editingLeaveTypeId) {
      const updateDto: LeaveTypeUpdateDto = {
        id: this.editingLeaveTypeId,
        name: formValue.name,
        description: formValue.description,
        maxDaysPerYear: formValue.maxDaysPerYear,
        isPaid: formValue.isPaid,
        requiresApproval: formValue.requiresApproval,
        requiresAttachment: formValue.requiresAttachment,
        isActive: formValue.isActive
      };

      this.leaveTypeService.update(updateDto).subscribe({
        next: () => {
          this.loadLeaveTypes();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating leave type:', error);
          alert('Error updating leave type. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      const createDto: LeaveTypeCreateDto = {
        name: formValue.name,
        description: formValue.description,
        maxDaysPerYear: formValue.maxDaysPerYear,
        isPaid: formValue.isPaid,
        requiresApproval: formValue.requiresApproval,
        requiresAttachment: formValue.requiresAttachment,
        isActive: formValue.isActive
      };

      this.leaveTypeService.create(createDto).subscribe({
        next: () => {
          this.loadLeaveTypes();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating leave type:', error);
          alert('Error creating leave type. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

  deleteLeaveType(id: number, name: string): void {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    this.isLoading = true;
    this.leaveTypeService.delete(id).subscribe({
      next: () => {
        this.loadLeaveTypes();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting leave type:', error);
        alert('Error deleting leave type. Please try again.');
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getActiveCount(): number {
    return this.leaveTypes.filter(lt => lt.isActive === true).length;
  }

  getInactiveCount(): number {
    return this.leaveTypes.filter(lt => lt.isActive === false).length;
  }
}