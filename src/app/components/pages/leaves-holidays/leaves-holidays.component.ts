// src/app/components/pages/holiday/holiday.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HolidayService } from '../../../services/holiday.service';
import { Holiday, HolidayCreateDto, HolidayUpdateDto, PreviewHoliday } from '../../../interfaces/holiday.inyerfact';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './leaves-holidays.component.html',
  styleUrls: ['./leaves-holidays.component.css']
})
export class LeavesHolidaysComponent implements OnInit {
  holidays: Holiday[] = [];
  filteredHolidays: Holiday[] = [];
  holidayForm: FormGroup;
  previewHolidays: PreviewHoliday[] = [];
  
  isLoading = false;
  showModal = false;
  showPreviewModal = false;
  isEditMode = false;
  editingHolidayId?: number;
  searchTerm = '';
  selectedYear: number = new Date().getFullYear();
  syncYear: number = new Date().getFullYear();
  countryCode = 'EG';
  
  countryOptions = [
    { code: 'EG', name: 'Egypt' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'AE', name: 'UAE' },
  ];

  constructor(
    private holidayService: HolidayService,
    private fb: FormBuilder
  ) {
    this.holidayForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.isLoading = true;
    this.holidayService.getActive().subscribe({
      next: (data) => {
        this.holidays = data;
        this.filteredHolidays = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading holidays:', error);
        this.isLoading = false;
      }
    });
  }

  loadHolidaysByYear(): void {
    this.isLoading = true;
    this.holidayService.getByYear(this.selectedYear).subscribe({
      next: (data) => {
        this.holidays = data;
        this.filteredHolidays = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading holidays:', error);
        this.isLoading = false;
      }
    });
  }

  filterHolidays(): void {
    if (!this.searchTerm.trim()) {
      this.filteredHolidays = this.holidays;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredHolidays = this.holidays.filter(holiday =>
      holiday.name.toLowerCase().includes(term) ||
      holiday.description?.toLowerCase().includes(term)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingHolidayId = undefined;
    this.holidayForm.reset();
    this.showModal = true;
  }

  openEditModal(holiday: Holiday): void {
    this.isEditMode = true;
    this.editingHolidayId = holiday.id;
    this.holidayForm.patchValue({
      name: holiday.name,
      startDate: this.formatDateForInput(holiday.startDate),
      endDate: this.formatDateForInput(holiday.endDate),
      description: holiday.description
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.holidayForm.reset();
  }

  saveHoliday(): void {
    if (this.holidayForm.invalid) return;

    this.isLoading = true;
    const formValue = this.holidayForm.value;

    if (this.isEditMode && this.editingHolidayId) {
      const updateDto: HolidayUpdateDto = {
        name: formValue.name,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        description: formValue.description,
        updatedBy: 'Admin'
      };

      this.holidayService.update(this.editingHolidayId, updateDto).subscribe({
        next: () => {
          this.loadHolidays();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating holiday:', error);
          this.isLoading = false;
        }
      });
    } else {
      const createDto: HolidayCreateDto = {
        name: formValue.name,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        description: formValue.description,
        createdBy: 'Admin'
      };

      this.holidayService.add(createDto).subscribe({
        next: () => {
          this.loadHolidays();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding holiday:', error);
          this.isLoading = false;
        }
      });
    }
  }

  deleteHoliday(id: number, name: string): void {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    this.isLoading = true;
    this.holidayService.deactivate(id, 'Admin').subscribe({
      next: () => {
        this.loadHolidays();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting holiday:', error);
        this.isLoading = false;
      }
    });
  }

  previewSync(): void {
    this.isLoading = true;
    this.holidayService.previewApiHolidays(this.syncYear, this.countryCode).subscribe({
      next: (response) => {
        this.previewHolidays = response.holidays;
        this.showPreviewModal = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error previewing holidays:', error);
        alert('Error loading preview. Please check your API key and configuration.');
        this.isLoading = false;
      }
    });
  }

  syncHolidays(): void {
    if (!confirm(`Sync holidays for ${this.countryCode} - ${this.syncYear}?`)) return;

    this.isLoading = true;
    this.holidayService.syncFromApi(this.syncYear, this.countryCode, 'Admin').subscribe({
      next: (response) => {
        alert(response.message + `\nAdded ${response.addedCount} new holidays.`);
        this.loadHolidays();
        this.closePreviewModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error syncing holidays:', error);
        alert('Error syncing holidays. Please check your API configuration.');
        this.isLoading = false;
      }
    });
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewHolidays = [];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  getDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days === 1 ? '1 day' : `${days} days`;
  }
}