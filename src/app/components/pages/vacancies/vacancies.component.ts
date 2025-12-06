// vacancies.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterModule } from '@angular/router';


import { VacancyService } from '../../../services/vacancy.service';

// Interfaces
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

interface JobPositionDTO {
  id?: number;
  title: string;
  description: string;
  departmentId: number;
  departmentName?: string;
}

interface ApplicantDTO {
  id?: number;
  currentJobTitle?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  linkedInUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  professionalSummary?: string;
  expectedSalary?: number;
  salaryCurrency?: string;
  availableFrom?: Date;
  noticePeriod?: string;
  isOpenToRelocation: boolean;
  preferredLocations?: string;
  cvPath?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  appliedDate?: Date;
  status?: string;
  vacancyId?: number;
  gender?: number;
  maritalStatus?: number;
  militaryStatus?: number;
}

interface Department {
  id: number;
  name: string;
}

@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  
  private vacancyService = inject(VacancyService);
  private fb = inject(FormBuilder);
  
  // Data Properties
  vacancies: VacancyDto[] = [];
  filteredVacancies: VacancyDto[] = [];
  applicants: ApplicantDTO[] = [];
  departments: Department[] = [];
  positions: JobPositionDTO[] = [];
  applications: any[] = [];
  loadingApps = false;
  
  // Selected Items
  selectedVacancy: VacancyDto | null = null;
  selectedVacancyApplicants: ApplicantDTO[] = [];
  selectedVacancyApplications: ApplicantDTO[] = [];
  
  // Forms
  filterForm!: FormGroup;
  vacancyForm!: FormGroup;
  
  // Loading States
  isLoading = false;
  isSaving = false;
  
  // Modal Control
  showVacancyModal = false;
  showDeleteConfirm = false;
  isEditMode = false;
  
  // Dropdown Options
  statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'Open', name: 'Open' },
    { id: 'Closed', name: 'Closed' },
    { id: 'Draft', name: 'Draft' }
  ];
  
  employmentTypes = [
    { id: 'Full-time', name: 'Full-time' },
    { id: 'Part-time', name: 'Part-time' },
    { id: 'Contract', name: 'Contract' },
    { id: 'Internship', name: 'Internship' }
  ];
  
  experienceLevels = [
    { id: 'Entry', name: 'Entry Level' },
    { id: 'Mid', name: 'Mid Level' },
    { id: 'Senior', name: 'Senior Level' },
    { id: 'Lead', name: 'Lead' }
  ];

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadInitialData();
    
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

  private initializeForms(): void {
    this.filterForm = this.fb.group({
      department: ['all'],
      status: ['all'],
      position: ['all'],
      employmentType: ['all'],
      search: ['']
    });
    
    this.vacancyForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required]],
      requirements: [''],
      responsibilities: [''],
      employmentType: ['Full-time', [Validators.required]],
      experienceLevel: ['Mid'],
      minSalary: [null],
      maxSalary: [null],
      location: [''],
      isRemote: [false],
      numberOfOpenings: [1, [Validators.required, Validators.min(1)]],
      status: ['Open', [Validators.required]],
      postedDate: [new Date()],
      closingDate: [null],
      jobPositionId: [1, [Validators.required]],
      departmentId: [1, [Validators.required]]
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    this.vacancyService.getAllVacancies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vacancies) => {
          this.vacancies = vacancies;
          this.filteredVacancies = [...vacancies];
          
          if (this.vacancies.length > 0) {
            this.selectVacancy(this.vacancies[0]);
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading vacancies:', error);
          this.isLoading = false;
        }
      });
  }

  private loadApplicationsForVacancy(vacancyId: number): void {
    console.log('Loading applications for vacancy ID:', vacancyId);
    this.applications = [];

    this.vacancyService.getApplicationsForVacancy(vacancyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (apps) => {
          console.log('Applications received:', apps);
          this.applications = apps;
        },
        error: (err) => {
          console.error('Error loading applications:', err);
        }
      });
  }

  selectVacancy(vacancy: VacancyDto): void {
    console.log('Selected vacancy:', vacancy);
    this.selectedVacancy = vacancy;
    
    if (vacancy && vacancy.id !== undefined && vacancy.id !== null) {
      console.log('Vacancy ID is valid:', vacancy.id);
      this.loadApplicationsForVacancy(vacancy.id);
    } else {
      console.warn('Vacancy ID is undefined or null');
      this.applications = [];
    }
  }

  private filterApplicantsForSelectedVacancy(): void {
    if (this.selectedVacancy && this.selectedVacancy.id) {
      this.selectedVacancyApplicants = this.applicants.filter(
        applicant => applicant.vacancyId === this.selectedVacancy!.id
      );
    } else {
      this.selectedVacancyApplicants = [];
    }
  }

  private applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredVacancies = this.vacancies.filter(vacancy => {
      if (filters.department !== 'all' && vacancy.departmentId) {
        if (vacancy.departmentId !== parseInt(filters.department)) {
          return false;
        }
      }
      
      if (filters.status !== 'all' && vacancy.status !== filters.status) {
        return false;
      }
      
      if (filters.position !== 'all' && vacancy.jobPositionId) {
        if (vacancy.jobPositionId !== parseInt(filters.position)) {
          return false;
        }
      }
      
      if (filters.employmentType !== 'all' && vacancy.employmentType !== filters.employmentType) {
        return false;
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = vacancy.title?.toLowerCase().includes(searchTerm) || false;
        const descMatch = vacancy.description?.toLowerCase().includes(searchTerm) || false;
        const locationMatch = vacancy.location?.toLowerCase().includes(searchTerm) || false;
        
        if (!titleMatch && !descMatch && !locationMatch) {
          return false;
        }
      }
      
      return true;
    });
    
    if (this.selectedVacancy && !this.filteredVacancies.includes(this.selectedVacancy)) {
      if (this.filteredVacancies.length > 0) {
        this.selectVacancy(this.filteredVacancies[0]);
      } else {
        this.selectedVacancy = null;
        this.selectedVacancyApplicants = [];
      }
    }
  }

  addNewVacancy(): void {
    this.isEditMode = false;
    this.vacancyForm.reset({
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      isRemote: false,
      numberOfOpenings: 1,
      status: 'Open',
      postedDate: new Date(),
      jobPositionId: 4,
      departmentId: 5
    });
    this.showVacancyModal = true;
  }

  editVacancy(): void {
    if (!this.selectedVacancy) return;
    
    this.isEditMode = true;
    this.vacancyForm.patchValue({
      ...this.selectedVacancy,
      departmentId: this.selectedVacancy.departmentId || 1,
      jobPositionId: this.selectedVacancy.jobPositionId || 1
    });
    this.showVacancyModal = true;
  }

  saveVacancy(): void {
    if (this.vacancyForm.invalid) {
      this.markFormGroupTouched(this.vacancyForm);
      return;
    }
    
    if (this.isEditMode) {
      this.updateVacancy();
    } else {
      this.createVacancy();
    }
  }

  private createVacancy(): void {
    this.isSaving = true;
    const vacancyData = this.vacancyForm.value;
    
    this.vacancyService.createVacancy(vacancyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newVacancy) => {
          // إعادة تحميل كل الـ vacancies عشان نجيب الـ data الكاملة
          this.vacancyService.getAllVacancies()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (vacancies) => {
                this.vacancies = vacancies;
                this.filteredVacancies = [...vacancies];
                
                // اختيار الـ vacancy الجديدة
                const createdVacancy = vacancies.find(v => v.id === newVacancy.id);
                if (createdVacancy) {
                  this.selectVacancy(createdVacancy);
                }
                
                this.showVacancyModal = false;
                this.isSaving = false;
              },
              error: (error) => {
                console.error('Error reloading vacancies:', error);
                this.isSaving = false;
              }
            });
        },
        error: (error) => {
          console.error('Error creating vacancy:', error);
          this.isSaving = false;
        }
      });
  }

  private updateVacancy(): void {
    if (!this.selectedVacancy?.id) return;
    
    this.isSaving = true;
    const vacancyData = this.vacancyForm.value;
    
    this.vacancyService.updateVacancy(this.selectedVacancy.id, vacancyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedVacancy) => {
          // إعادة تحميل كل الـ vacancies عشان نجيب الـ data المحدثة
          this.vacancyService.getAllVacancies()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (vacancies) => {
                this.vacancies = vacancies;
                this.filteredVacancies = [...vacancies];
                
                // اختيار الـ vacancy المحدثة
                const updated = vacancies.find(v => v.id === this.selectedVacancy!.id);
                if (updated) {
                  this.selectedVacancy = updated;
                }
                
                this.showVacancyModal = false;
                this.isSaving = false;
              },
              error: (error) => {
                console.error('Error reloading vacancies:', error);
                this.isSaving = false;
              }
            });
        },
        error: (error) => {
          console.error('Error updating vacancy:', error);
          this.isSaving = false;
        }
      });
  }

  confirmDeleteVacancy(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteVacancy(): void {
    if (!this.selectedVacancy?.id) return;
    
    this.isLoading = true;
    this.showDeleteConfirm = false;
    
    this.vacancyService.deleteVacancy(this.selectedVacancy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Remove from local arrays
          this.vacancies = this.vacancies.filter(v => v.id !== this.selectedVacancy!.id);
          this.filteredVacancies = this.filteredVacancies.filter(v => v.id !== this.selectedVacancy!.id);
          
          // Select next vacancy or clear selection
          if (this.filteredVacancies.length > 0) {
            this.selectVacancy(this.filteredVacancies[0]);
          } else {
            this.selectedVacancy = null;
            this.selectedVacancyApplicants = [];
          }
          
          this.isLoading = false;
          this.showVacancyModal = false;
        },
        error: (error) => {
          console.error('Delete error details:', error);
          // Even if there's a parsing error, the delete might have succeeded
          // Check if it's just a parsing issue with 200 status
          if (error.status === 200 || error.message?.includes('200')) {
            console.log('Delete likely succeeded despite parsing error');
            // Proceed with removal from UI
            this.vacancies = this.vacancies.filter(v => v.id !== this.selectedVacancy!.id);
            this.filteredVacancies = this.filteredVacancies.filter(v => v.id !== this.selectedVacancy!.id);
            
            if (this.filteredVacancies.length > 0) {
              this.selectVacancy(this.filteredVacancies[0]);
            } else {
              this.selectedVacancy = null;
              this.selectedVacancyApplicants = [];
            }
            this.showVacancyModal = false;
          }
          this.isLoading = false;
        }
      });
  }

  closeModal(): void {
    this.showVacancyModal = false;
    this.vacancyForm.reset();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getGenderText(gender: number): string {
    switch (gender) {
      case 0: return 'Male';
      case 1: return 'Female';
      default: return 'Not Specified';
    }
  }

  getMaritalStatusText(status: number): string {
    switch (status) {
      case 0: return 'Single';
      case 1: return 'Married';
      case 2: return 'Divorced';
      case 3: return 'Widowed';
      default: return 'Not Specified';
    }
  }

  getMilitaryStatusText(status: number): string {
    switch (status) {
      case 0: return 'Exempt';
      case 1: return 'Completed';
      case 2: return 'Postponed';
      case 3: return 'Not Applicable';
      default: return 'Not Specified';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open': return 'status-open';
      case 'closed': return 'status-closed';
      case 'draft': return 'status-draft';
      default: return '';
    }
  }

  getApplicantStatusClass(status: string): string {
    switch (status) {
      case 'new': return 'status-new';
      case 'reviewed': return 'status-reviewed';
      case 'interview': return 'status-interview';
      case 'hired': return 'status-hired';
      case 'rejected': return 'status-rejected';
      default: return '';
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

  getPositionTitle(positionId: number): string {
    const position = this.positions.find(p => p.id === positionId);
    return position?.title || 'N/A';
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(d => d.id === departmentId);
    return department?.name || 'N/A';
  }

  formatApplicationStatus(status: string): string {
    if (!status) return 'Pending';
    return status.replace(/([A-Z])/g, ' $1').trim();
  }

  getApplicationStatusClass(status: string): string {
    if (!status) return 'status-pending';
    
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'underreview': return 'status-reviewed';
      case 'pending': return 'status-new';
      case 'accepted':
      case 'approved': return 'status-hired';
      case 'rejected': return 'status-rejected';
      case 'interview':
      case 'interviewing': return 'status-interview';
      default: return 'status-new';
    }
  }

  get title() { return this.vacancyForm.get('title'); }
  get description() { return this.vacancyForm.get('description'); }
  get employmentType() { return this.vacancyForm.get('employmentType'); }
  get numberOfOpenings() { return this.vacancyForm.get('numberOfOpenings'); }
  get status() { return this.vacancyForm.get('status'); }
  get jobPositionId() { return this.vacancyForm.get('jobPositionId'); }
  get departmentId() { return this.vacancyForm.get('departmentId'); }
}