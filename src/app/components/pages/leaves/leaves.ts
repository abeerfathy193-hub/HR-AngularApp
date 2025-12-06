import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestsService } from '../../../services/requests.service';
import { Location } from '@angular/common';
import { LeaveTypeService } from '../../../services/leavetype.service';
import { LeaveType } from '../../../interfaces/leavetypes.interface';

@Component({
  selector: 'app-leaves',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './leaves.html',
  styleUrl: './leaves.css',
})
export class Leaves implements OnInit {
  attachmentBase64: string | null = null;
  attachmentFile: File | null = null; // Store the actual file object
  leaveTypes: any[] = [];
  leavesSettings: LeaveType[] = [];
  form: FormGroup;
  name: string = 'Ahmed';
  selectedLeaveType: LeaveType | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private service: RequestsService,
    private leaveService: LeaveTypeService
  ) {
    this.form = this.fb.group({
      requestedById: [1],
      startDate: ['', Validators.required],
      numberOfDays: ['', Validators.required],
      leaveType: [null, Validators.required],
      reason: ['', Validators.required],
      attachment: [''],
      isPaid: [{ value: false, disabled: false }],
      firstApproveId: ['', Validators.required],
      secondApproveId: [''],
    });
  }

  ngOnInit(): void {
    this.leaveService.getAll().subscribe((types) => {
      this.leaveTypes = types.map((t) => ({ id: t.id, name: t.name }));
      this.leavesSettings = types;
    });

    // Listen to leave type changes
    this.form.get('leaveType')?.valueChanges.subscribe((leaveTypeId) => {
      this.onLeaveTypeChange(leaveTypeId);
    });
  }

  onLeaveTypeChange(leaveTypeId: number) {
    this.selectedLeaveType = this.leavesSettings.find((t) => t.id == leaveTypeId) || null;

    if (this.selectedLeaveType) {
      const isPaidControl = this.form.get('isPaid');
      const secondApproveControl = this.form.get('secondApproveId');

      // Update isPaid field
      if (this.selectedLeaveType.isPaid) {
        isPaidControl?.setValue(true);
        isPaidControl?.disable();
      } else {
        isPaidControl?.enable();
        isPaidControl?.setValue(false);
      }

      // Update secondApproveId requirement
      if (this.selectedLeaveType.requiresApproval) {
        secondApproveControl?.setValidators([Validators.required]);
      } else {
        secondApproveControl?.clearValidators();
      }
      secondApproveControl?.updateValueAndValidity();
    }
  }

  // Show/hide second approver based on leave type
  showSecondApprover(): boolean {
    return this.selectedLeaveType?.requiresApproval ?? false;
  }

  // Show/hide attachment requirement notice
  showAttachmentRequired(): boolean {
    return this.selectedLeaveType?.requiresAttachment ?? false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Store the file object directly
    this.attachmentFile = file;

    // Also create base64 for UI feedback
    const reader = new FileReader();
    reader.onload = () => {
      this.attachmentBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) {
      console.error('Form is invalid');
      return;
    }

    // Validate attachment if required
    if (this.showAttachmentRequired() && !this.attachmentFile) {
      console.error('Attachment is required for this leave type');
      alert('Please select an attachment for this leave type');
      return;
    }

    this.isSubmitting = true;

    const formValue = this.form.getRawValue();
    const formData = new FormData();

    formData.append('requestedById', formValue.requestedById.toString());
    formData.append('startDate', formValue.startDate);
    formData.append('numberOfDays', formValue.numberOfDays.toString());
    formData.append('leaveType', formValue.leaveType.toString());
    formData.append('reason', formValue.reason);
    formData.append('isPaid', formValue.isPaid ? 'true' : 'false');
    formData.append('firstApproveId', formValue.firstApproveId.toString());

    if (formValue.secondApproveId) {
      formData.append('secondApproveId', formValue.secondApproveId.toString());
    }

    formData.append('createdBy', this.name);

    // Append the actual file object (not base64)
    if (this.attachmentFile) {
      formData.append('attachment', this.attachmentFile, this.attachmentFile.name);
    } else {
      formData.append('attachment', '');
    }

    console.log('FormData to be sent:', Array.from(formData.entries()));

    this.service.addLeaveRequest(formData).subscribe({
      next: (response) => {
        console.log('Leave request submitted successfully:', response);
        alert('Leave request submitted successfully!');
        this.isSubmitting = false;
        this.goBack();
      },
      error: (err) => {
        console.error('Error submitting leave request:', err);
        alert('Error submitting leave request. Please try again.');
        this.isSubmitting = false;
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
