import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestsService } from '../../../services/requests.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hrletters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hrletters.html',
  styleUrl: './hrletters.css',
})
export class Hrletters {
  hrLetterForm: FormGroup;
  attachmentBase64: string | null = null;
  attachmentFile: File | null = null;
  name: string = 'Ahmed';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private hrService: RequestsService,
    private location: Location
  ) {
    this.hrLetterForm = this.fb.group({
      requestedById: [1],
      sentTo: ['', Validators.required],
      reason: ['', Validators.required],
      extraDetails: [''],
      attachment: [''],
      firstApproveId: [null, Validators.required],
      secondApproveId: [null],
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.attachmentFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.attachmentBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearFile() {
    this.attachmentFile = null;
    this.attachmentBase64 = null;
  }

  submitForm() {
    if (this.hrLetterForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;
    const f = this.hrLetterForm.value;
    const formData = new FormData();

    formData.append('requestedById', String(f.requestedById));
    formData.append('sentTo', f.sentTo);
    formData.append('reason', f.reason);
    formData.append('extraDetails', f.extraDetails?.trim() || '');
    formData.append('firstApproveId', f.firstApproveId);
    formData.append('secondApproveId', f.secondApproveId || '');
    formData.append('createdBy', this.name);

    if (this.attachmentFile) {
      formData.append('attachment', this.attachmentFile, this.attachmentFile.name);
    } else {
      formData.append('attachment', '');
    }

    this.hrService.createHRLetterRequest(formData).subscribe({
      next: () => {
        alert('HR Letter request submitted successfully!');
        this.isSubmitting = false;
        this.goBack();
      },
      error: (err) => {
        console.error(err);
        alert('Error submitting HR Letter request');
        this.isSubmitting = false;
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
