import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService, ApplicationSource, ApplyRequestDTO } from '../../../services/application.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-apply-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-form.html',
  styleUrls: ['./apply-form.css']
})
export class ApplyForm implements OnInit {

  applicationForm!: FormGroup;
  submitted = false;
  isLoading = false;
  vacancyId!: number;
  applicantId!: string;
  showSuccessModal = false;


  // Reference to enum for use in template
  ApplicationSource = ApplicationSource;

  // Dropdown options
  currencies = ['USD', 'EUR', 'GBP', 'EGP', 'SAR', 'AED'];
  noticePeriods = ['Immediate', '1 Week', '2 Weeks', '1 Month', '2 Months', '3 Months'];
  applicationSources = [
    { value: ApplicationSource.LinkedIn, label: 'LinkedIn' },
    { value: ApplicationSource.Indeed, label: 'Indeed' },
    { value: ApplicationSource.CompanyWebsite, label: 'Company Website' },
    { value: ApplicationSource.Referral, label: 'Referral' },
    { value: ApplicationSource.Other, label: 'Other' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get vacancyId from route params
    this.route.params.subscribe(params => {
      this.vacancyId = +params['id']; // Convert to number
    });

    // Get applicantId from local storage or auth service
   // this.applicantId = this.getApplicantId();
    this.applicantId = "9798fcb6-5cc8-41e4-82fd-152010e9db17"; // Temporary hardcoded for testing

    this.initializeForm();
  }

  initializeForm(): void {
    this.applicationForm = this.formBuilder.group({
      yearsOfExperience: [null, [Validators.required, Validators.min(0)]],
      expectedSalary: [null, [Validators.required, Validators.min(0)]],
      salaryCurrency: ['', Validators.required],
      availableFrom: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      isOpenToRelocation: [false],
      preferredLocations: [''],
      applicationSource: [ApplicationSource.CompanyWebsite, Validators.required],
      otherSource: ['']
    });

    // Add conditional validation for otherSource
    this.applicationForm.get('applicationSource')?.valueChanges.subscribe(value => {
      const otherSourceControl = this.applicationForm.get('otherSource');
      if (value === ApplicationSource.Other) {
        otherSourceControl?.setValidators([Validators.required]);
      } else {
        otherSourceControl?.clearValidators();
      }
      otherSourceControl?.updateValueAndValidity();
    });
  }

  // Convenience getter for form controls
  get f() {
    return this.applicationForm.controls;
  }

  getApplicantId(): string {
    // Replace this with your actual logic to get the logged-in user ID
    // This could be from localStorage, a auth service, etc.
    const userId = localStorage.getItem('userId');
    return userId || '';
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.applicationForm.invalid) {
      this.markFormGroupTouched(this.applicationForm);
      return;
    }

    this.isLoading = true;

    // Convert date string to ISO format for backend
    const availableFromDate = this.applicationForm.value.availableFrom 
      ? new Date(this.applicationForm.value.availableFrom).toISOString() 
      : undefined;

    // Prepare the request DTO matching backend expectations
    const request: ApplyRequestDTO = {
      applicantId: this.applicantId,
      vacancyId: this.vacancyId,
      expectedSalary: this.applicationForm.value.expectedSalary || undefined,
      salaryCurrency: this.applicationForm.value.salaryCurrency || undefined,
      availableFrom: availableFromDate,
      noticePeriod: this.applicationForm.value.noticePeriod || undefined,
      isOpenToRelocation: this.applicationForm.value.isOpenToRelocation || false,
      preferredLocations: this.applicationForm.value.preferredLocations || undefined,
      yearsOfExperience: this.applicationForm.value.yearsOfExperience || undefined,
      applicationSource: this.applicationForm.value.applicationSource,
      otherSource: this.applicationForm.value.otherSource || undefined,
      applicationStatus: 'UnderReview' // Set default status
    };

    // Debug logging
    console.log('Submitting application:', request);
    console.log('Applicant ID:', this.applicantId);
    console.log('Vacancy ID:', this.vacancyId);

    // Call the service
    this.applicationService.applyForVacancy(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccessModal = true; // ⬅️ Changed from successMessage

        // alert('Application submitted successfully!');
        // Navigate to applications list or success page
        this.router.navigate(['/my-applications']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting application:', error);
        console.error('Error details:', error.error);
        
        // Log validation errors if they exist
        if (error.error?.errors) {
          console.error('Validation errors:', error.error.errors);
          Object.keys(error.error.errors).forEach(key => {
            console.error(`${key}:`, error.error.errors[key]);
          });
        }
        
        // Extract the actual error message from backend
        let errorMsg = 'Failed to submit application. Please try again.';
        
        if (error.error) {
          // If there are validation errors, show them
          if (error.error.errors) {
            const errorMessages = Object.keys(error.error.errors)
              .map(key => `${key}: ${error.error.errors[key].join(', ')}`)
              .join('\n');
            errorMsg = `Validation Errors:\n${errorMessages}`;
          } else if (typeof error.error === 'string') {
            errorMsg = error.error;
          } else if (error.error.message) {
            errorMsg = error.error.message;
          } else if (error.error.title) {
            errorMsg = error.error.title;
          }
        }
        
        alert(errorMsg);
      }
    });
  }

  onCancel(): void {
    // Navigate back to vacancies list or previous page
    this.router.navigate(['/vacancies']);
  }

  // Helper method to mark all fields as touched to show validation errors
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onSuccessModalClose(): void {
  this.showSuccessModal = false;
  this.router.navigate(['/My-Applications']); }

}