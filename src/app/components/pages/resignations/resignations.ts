import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestsService } from '../../../services/requests.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resignations',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resignations.html',
  styleUrl: './resignations.css',
})
export class Resignations {
  resignationForm: FormGroup;
  attachmentBase64: string | null = null;
  name: string = 'Ahmed';

  constructor(
    private fb: FormBuilder,
    private resignationService: RequestsService,
    private location: Location
  ) {
    this.resignationForm = this.fb.group({
      requestedById: [6],
      reason: ['', Validators.required],
      proposedLastWorkingDay: ['', Validators.required],
      attachment: [''],
      firstApproveId: [null, Validators.required],
      secondApproveId: [''], // optional
    });
  }

  submitForm() {
    const f = this.resignationForm.value;
    const payload = {
      requestedById: Number(f.requestedById),
      reason: f.reason,
      proposedLastWorkingDay:
        f.proposedLastWorkingDay?.trim() === '' ? null : f.proposedLastWorkingDay,
      attachment: f.attachment?.trim() === '' ? null : f.attachment,
      firstApproveId: Number(f.firstApproveId),
      secondApproveId:
        f.secondApproveId?.toString().trim() === '' ? null : Number(f.secondApproveId),
      createdBy: this.name,
    };

    this.resignationService.createResignationRequest({ ...payload }).subscribe(() => {});
    this.goBack();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.attachmentBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  goBack() {
    this.location.back();
  }
}
