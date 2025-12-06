import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { ApplicationService, ApplicationDto, ApplicationStatus  } from '../../../services/application.service';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './application-details.html',
  styleUrls: ['./application-details.css']
})
export class ApplicationDetails implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  applicationId!: number;
  application: ApplicationDto | null = null;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  success: string | null = null;

  
  
  // Status dropdown options
  statusOptions = Object.values(ApplicationStatus);
  
  // Editable status control
  statusControl = new FormControl<string>('');
  
  // Current status for comparison
  currentStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.applicationId = +params['id'];
        if (this.applicationId) {
          this.loadApplication();
        } else {
          this.error = 'Invalid application ID';
        }
      });
  }

  loadApplication(): void {
    this.isLoading = true;
    this.error = null;
    this.success = null;
    
    this.applicationService.getByIdWithDetails(this.applicationId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.isLoading = false;
          this.error = err.error?.message || 'Failed to load application details';
          return of(null);
        })
      )
      .subscribe(application => {
        this.isLoading = false;
        if (application) {
          this.application = application;
          this.currentStatus = application.applicationStatus;
          this.statusControl.setValue(application.applicationStatus);
        }
      });
  }

  onStatusChange(): void {
    const newStatus = this.statusControl.value;
    console.log('Application ID:', this.applicationId);
    console.log('New Status:', newStatus);
    console.log('Current Status:', this.currentStatus);
    if (!newStatus || newStatus === this.currentStatus || !this.applicationId) {
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.success = null;

    // تأكد إن البيانات صحيحة قبل الإرسال
    console.log('Updating status:', { id: this.applicationId, status: newStatus });

    this.applicationService.updateStatus(this.applicationId, newStatus)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.isSaving = false;
          // اطبع الـ error كله علشان تشوف التفاصيل
   // ✅ اطبع كل التفاصيل
          console.error('Full Error Response:', err.error);
          console.error('Validation Errors:', err.error?.errors);
          console.error('Error Title:', err.error?.title); 
          
          
          // ✅ اعرض رسالة أوضح
          const validationErrors = err.error?.errors;

  
  // ✅ اطبع كل error لوحده
  if (validationErrors) {
    console.log('$ errors:', validationErrors.$);
    console.log('status errors:', validationErrors.status);
  }
  
          let errorMessage = 'Failed to update status';          this.error = err.error?.message || err.message || 'Failed to update status';
          this.statusControl.setValue(this.currentStatus, { emitEvent: false });
          return of(null);
        })
      )
      .subscribe(updatedApplication => {
        this.isSaving = false;
        if (updatedApplication) {
          this.application = updatedApplication;
          this.currentStatus = updatedApplication.applicationStatus;
          this.success = 'Application status updated successfully';
          
          setTimeout(() => {
            this.success = null;
          }, 3000);
        }
      });
}

  onAddInterview(): void {
    if (!this.applicationId) return;
    
    // Call openAddInterview if it exists on the service
    const service = this.applicationService as any;
    if (typeof service.openAddInterview === 'function') {
      service.openAddInterview(this.applicationId);
    }
    
    // Navigate to interview creation
    this.router.navigate(['/schedule-interview', this.applicationId]);
  }

  getApplicationSourceDisplay(source: string): string {
    switch (source) {
      case 'LinkedIn': return 'LinkedIn';
      case 'Indeed': return 'Indeed';
      case 'CompanyWebsite': return 'Company Website';
      case 'Referral': return 'Referral';
      case 'Other': return this.application?.otherSource || 'Other';
      default: return source;
    }
  }

  getFormattedDate(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCurrencySymbol(currency?: string): string {
    if (!currency) return '';
    switch (currency.toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'EGP': return 'E£';
      default: return currency;
    }
  }
  getGenderText(gender: number): string {
      switch (gender) {
        case 0:
          return 'Male';
        case 1:
          return 'Female';
        default:
          return 'Not Specified';
      }
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}