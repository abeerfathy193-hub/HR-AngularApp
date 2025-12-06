// open-vacancies.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


// Import Services
import { VacancyService } from '../../../services/vacancy.service';

// Interface
interface VacancyDto {
  id?: number;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  employmentType: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  isRemote: boolean;
  numberOfOpenings: number;
  status: string;
  postedDate?: Date;
  closingDate?: Date;
  jobPositionId: number;
  departmentName?: string;
  departmentId?: number;
  positionTitle?: string;
}

@Component({
  selector: 'app-open-vacancies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './open-vacancies.html',
  styleUrls: ['./open-vacancies.css']
})
export class OpenVacancies implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Inject Services
  private router = inject(Router);
  private vacancyService = inject(VacancyService);
  private fb = inject(FormBuilder);
  
  // Data Properties
  vacancies: VacancyDto[] = [];
  filteredVacancies: VacancyDto[] = [];
  selectedVacancy: VacancyDto | null = null;
  
  // Form
  filterForm!: FormGroup;
  
  // Loading State
  isLoading = false;
  
  // Dropdown Options
  employmentTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'Full-time', name: 'Full-time' },
    { id: 'Part-time', name: 'Part-time' },
    { id: 'Contract', name: 'Contract' },
    { id: 'Internship', name: 'Internship' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.loadVacancies();
    
    // Listen to filter changes
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      employmentType: ['all']
    });
  }

  loadVacancies(): void {
    this.isLoading = true;
    
    this.vacancyService.getAllVacancies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vacancies) => {
          this.vacancies = vacancies;
          this.filteredVacancies = [...vacancies];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading vacancies:', error);
          alert('Failed to load vacancies. Please try again.');
          this.isLoading = false;
        }
      });
  }

  searchVacancies(): void {
    const searchValue = this.filterForm.get('search')?.value;
    
    if (!searchValue || searchValue.trim() === '') {
      this.loadVacancies();
      return;
    }

    this.vacancyService.searchVacancies(searchValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.vacancies = data;
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error searching vacancies:', error);
          alert('Failed to search vacancies. Please try again.');
        }
      });
  }

  // تطبيق الفلاتر
  private applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredVacancies = this.vacancies.filter(vacancy => {
      // Search Filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = vacancy.title?.toLowerCase().includes(searchTerm) || false;
        const descMatch = vacancy.description?.toLowerCase().includes(searchTerm) || false;
        const locationMatch = vacancy.location?.toLowerCase().includes(searchTerm) || false;
        
        if (!titleMatch && !descMatch && !locationMatch) {
          return false;
        }
      }
      
      // Employment Type Filter
      if (filters.employmentType !== 'all' && vacancy.employmentType !== filters.employmentType) {
        return false;
      }
      
      return true;
    });
  }

  // Helper Methods
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'closed':
        return 'status-closed';
      case 'draft':
        return 'status-draft';
      default:
        return '';
    }
  }

  getVacancySalaryRange(vacancy: VacancyDto): string {
    if (vacancy.minSalary && vacancy.maxSalary) {
      return `${vacancy.minSalary} - ${vacancy.maxSalary} EGP`;
    } else if (vacancy.minSalary) {
      return `From ${vacancy.minSalary} EGP`;
    } else if (vacancy.maxSalary) {
      return `Up to ${vacancy.maxSalary} EGP`;
    } else {
      return 'Negotiable';
    }
  }

  getDaysRemaining(vacancy: VacancyDto): number | null {
    if (!vacancy.closingDate) return null;
    
    const closingDate = new Date(vacancy.closingDate);
    const today = new Date();
    const diffTime = closingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  getShortDescription(description: string): string {
    if (!description) return '';
    return description.length > 100 
      ? description.substring(0, 100) + '...' 
      : description;
  }

  // Check if filters are active
  hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return values.search || values.employmentType !== 'all';
  }

  // Clear all filters
  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      employmentType: 'all'
    });
  }

  // Apply for vacancy
  // ...existing code...
  applyForVacancy(vacancy: VacancyDto): void {
    console.log("BTN PRESSED - Vacancy ID:", vacancy?.id);

    // guard null/undefined (allow 0 only if you expect it)
    if (vacancy.id == null) {
      console.error('applyForVacancy: vacancy.id is null or undefined', vacancy);
      return;
    }

    // navigate using path param so ApplyForm can read paramMap (/apply/:id)
    this.router.navigate(['/apply', vacancy.id]);
  }
// ...existing code...

  // يمكنك إضافة هذه الدالة إذا أردت فتح نموذج في modal
  openApplicationForm(vacancy: VacancyDto): void {
    // منطق فتح نموذج التقديم
    console.log('Open application form for:', vacancy.title);
    // يمكنك إظهار modal أو التوجيه لصفحة منفصلة
  }
}