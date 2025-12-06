import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InterviewService } from '../../../services/interview.service';
import { ApplicationService } from '../../../services/application.service';
import { Subject, takeUntil, catchError, of } from 'rxjs';



@Component({
  selector: 'app-interview',
  standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],

  templateUrl: './interview.html',
  styleUrls: ['./interview.css']
})
export class Interview implements OnInit {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private interviewService = inject(InterviewService);
  private applicationService = inject(ApplicationService);

  interviewForm!: FormGroup;
  applicationId!: number;
  isLoading = false;
  errorMessage = '';
  showSuccessModal = false;


  ngOnInit(): void {
    // Get applicantId from route params
    this.applicationId = Number(this.route.snapshot.paramMap.get('applicationId'));
    
    this.initForm();
  }

  private initForm(): void {
    this.interviewForm = this.fb.group({
      applicationId: [this.applicationId, Validators.required],
      interviewerId: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      location: ['', Validators.required],
      interviewType: ['', Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.interviewForm.invalid) {
      this.markFormGroupTouched(this.interviewForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Combine date and time
    const formValue = this.interviewForm.value;
    const scheduledDateTime = `${formValue.scheduledDate}T${formValue.scheduledTime}`;

    const interviewData = {
      applicationId: formValue.applicationId,
      interviewerId: formValue.interviewerId,
      scheduledDate: scheduledDateTime,
      location: formValue.location,
      interviewType: formValue.interviewType,
      notes: formValue.notes
    };

    console.log(interviewData);


    this.interviewService.scheduleInterview(interviewData).subscribe({
      next: (response) => {
      this.isLoading = false;
      this.showSuccessModal = true; // ⬅️ Changed from successMessage
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to schedule interview. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/vacancies']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.interviewForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
  onSuccessModalClose(): void {
  this.showSuccessModal = false;
  this.router.navigate(['/application-details', this.applicationId]);
}

onStatusChange(): void {
    const newStatus = "InterviewScheduled";
   
    // Call updateStatus method on the service
    this.applicationService.updateStatus(this.applicationId, newStatus)
      .pipe(
        takeUntil(this.destroy$),
        
      )
      .subscribe(updatedApplication => {
        if (updatedApplication) {
          this.applicationId = updatedApplication.id;
         
          
          
        }
      });
 }
}