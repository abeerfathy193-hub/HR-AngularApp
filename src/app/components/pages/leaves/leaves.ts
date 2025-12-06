import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestsService } from '../../../services/requests.service';
import { Location } from '@angular/common';
import { LeaveTypeService } from '../../../services/leavetype.service';

@Component({
  selector: 'app-leaves',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './leaves.html',
  styleUrl: './leaves.css',
})
export class Leaves implements OnInit {
  attachmentBase64: string | null = null;
  leaveTypes: any[] = [];
  form: FormGroup;
  name: string = 'Ahmed';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private service: RequestsService,
    private leaveService: LeaveTypeService
  ) {
    this.form = this.fb.group({
      requestedById: [1], // will get from auth later
      startDate: ['', Validators.required],
      numberOfDays: ['', Validators.required],
      leaveType: [null, Validators.required],
      reason: ['', Validators.required],
      attachment: [''],
      isPaid: [false],
      firstApproveId: ['', Validators.required],
      secondApproveId: [''],
    });
  }
  ngOnInit(): void {
    this.leaveService.getAll().subscribe((type) => {
      const names = type.map((t) => ({ id: t.id, name: t.name }));
      this.leaveTypes = names;
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

  submit() {
    // const formData = new FormData();
    //   formData.append('id', this.companyId ? this.companyId.toString() : '0');
    //   Object.keys(this.CompanyForm.value).forEach(key => {
    //     const val = this.CompanyForm.value[key as keyof typeof this.CompanyForm.value];
    //     if (val !== null) formData.append(key, val ? val.toString().trim() : '');
    //   });
    //   if (this.selectedLogo)
    //     formData.append('logoFile', this.selectedLogo, this.selectedLogo.name);
    debugger;
    const formValue = this.form.value;
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

    if (this.attachmentBase64) {
      // If API expects: IFormFile => send file
      const file = this.base64ToFile(this.attachmentBase64, 'attachment.png');
      formData.append('attachment', file);
    } else {
      formData.append('attachment', '');
    }

    this.service.addLeaveRequest(formData).subscribe({
      next: () => this.goBack(),
      error: (err) => console.error(err),
    });
  }

  base64ToFile(base64: string, filename: string) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }
  goBack() {
    this.location.back();
  }
}
