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
  name: string = 'Ahmed';

  constructor(
    private fb: FormBuilder,
    private hrService: RequestsService,
    private location: Location
  ) {
    this.hrLetterForm = this.fb.group({
      requestedById: [6],
      sentTo: ['', Validators.required],
      reason: ['', Validators.required],
      extraDetails: [''],
      attachment: [''],
      firstApproveId: [null, Validators.required],
      secondApproveId: [''],
    });
  }

  submitForm() {
    const f = this.hrLetterForm.value;

    const formData = new FormData();

    formData.append('requestedById', String(f.requestedById));
    formData.append('sentTo', f.letterType);
    formData.append('reason', f.reason);

    formData.append('extraDetails', f.extraDetails?.trim() === '' ? '' : f.extraDetails);
    formData.append('attachment', f.attachment?.trim() === '' ? '' : f.attachment);

    formData.append('firstApproveId', String(f.firstApproveId));

    if (f.secondApproveId?.toString().trim() !== '') {
      formData.append('secondApproveId', String(f.secondApproveId));
    } else {
      formData.append('secondApproveId', '');
    }

    formData.append('createdBy', this.name);
    this.hrService.createHRLetterRequest(formData).subscribe(() => {
      this.goBack();
    });
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
