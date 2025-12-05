import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../../services/employee.service';
import { PositionService } from '../../../../services/position.service';
import { ContractService } from '../../../../services/contract.service';
import { GenderType, MaritalStatus, MilitaryStatus } from '../../../../interfaces/register.interface';
import { IPosition } from '../../../../interfaces/position.interface';
import { ContractDto } from '../../../../interfaces/Contrac.interface';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Dropdown data
  positions: IPosition[] = [];
  contracts: ContractDto[] = [];

  // File properties - Person Files
  selectedImgFile: File | null = null;
  selectedCvFile: File | null = null;
  selectedMilitaryFile: File | null = null;
  selectedEducationFile: File | null = null;

  // File properties - Employee Files
  selectedNationalIdFile: File | null = null;
  selectedPassportFile: File | null = null;
  selectedBirthCertificateFile: File | null = null;

  // Preview URLs
  imgPreview: string | null = null;

  // Enum values for dropdowns
  genderTypes = Object.values(GenderType);
  maritalStatuses = Object.values(MaritalStatus);
  militaryStatuses = Object.values(MilitaryStatus);

  // Role options
  roleOptions = ['Admin', 'HR', 'Manager', 'Employee', 'Applicant'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private contractService: ContractService,
    public router: Router
  ) {
    this.employeeForm = this.fb.group({
      // Personal Information
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      nationality: ['', Validators.required],
      education: ['', Validators.required],
      militaryStatus: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\-\\s]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3)]],

      // Employee Identification
      nationalId: [''],
      passPort: [''],
      ssnId: [''],
      personId: [null],
      contractId: [null],
      positionId: [null],

      // Role
      roleName: ['', Validators.required],

      // Password
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadPositions();
    this.loadContracts();
  }

  loadPositions(): void {
    this.positionService.getAllPositions().subscribe({
      next: (data) => {
        this.positions = data;
      },
      error: (error) => {
        console.error('Error loading positions:', error);
      }
    });
  }

  loadContracts(): void {
    this.contractService.getAllContracts().subscribe({
      next: (data) => {
        this.contracts = data;
      },
      error: (error) => {
        console.error('Error loading contracts:', error);
      }
    });
  }

  passwordStrengthValidator(control: any) {
    if (!control.value) {
      return null;
    }

    const password = control.value;
    const errors: any = {};

    if (password.length < 8) {
      errors.minLength = true;
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = true;
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = true;
    }
    if (!/[0-9]/.test(password)) {
      errors.number = true;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.specialChar = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        if (confirmPassword.errors && confirmPassword.errors['passwordMismatch']) {
          delete confirmPassword.errors['passwordMismatch'];
          if (Object.keys(confirmPassword.errors).length === 0) {
            confirmPassword.setErrors(null);
          }
        }
      }
    }
    return null;
  }

  // Person Files handlers
  onImgFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImgFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgPreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedImgFile);
    }
  }

  onCvFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCvFile = input.files[0];
    }
  }

  onMilitaryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedMilitaryFile = input.files[0];
    }
  }

  onEducationFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedEducationFile = input.files[0];
    }
  }

  // Employee Files handlers
  onNationalIdFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedNationalIdFile = input.files[0];
    }
  }

  onPassportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPassportFile = input.files[0];
    }
  }

  onBirthCertificateFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedBirthCertificateFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = new FormData();

      // Append password
      formData.append('password', this.employeeForm.value.password || '');

      // Append CreatePerson properties
      formData.append('CreatePerson.FullName', this.employeeForm.value.fullName?.trim() || '');
      formData.append('CreatePerson.BirthDate', this.employeeForm.value.birthDate || '');
      formData.append('CreatePerson.Gender', this.employeeForm.value.gender || '');
      formData.append('CreatePerson.Address', this.employeeForm.value.address?.trim() || '');
      formData.append('CreatePerson.Country', this.employeeForm.value.country?.trim() || '');
      formData.append('CreatePerson.MaritalStatus', this.employeeForm.value.maritalStatus || '');
      formData.append('CreatePerson.Nationality', this.employeeForm.value.nationality?.trim() || '');
      formData.append('CreatePerson.Education', this.employeeForm.value.education || '');
      formData.append('CreatePerson.MilitaryStatus', this.employeeForm.value.militaryStatus || '');
      formData.append('CreatePerson.Email', this.employeeForm.value.email?.trim() || '');
      formData.append('CreatePerson.PhoneNumber', this.employeeForm.value.phoneNumber?.trim() || '');
      formData.append('CreatePerson.UserName', this.employeeForm.value.userName?.trim() || '');

      // Append CreateEmployeeDto properties
      if (this.employeeForm.value.nationalId) {
        formData.append('CreateEmployeeDto.NationalId', this.employeeForm.value.nationalId.trim());
      }
      if (this.employeeForm.value.passPort) {
        formData.append('CreateEmployeeDto.PassPort', this.employeeForm.value.passPort.trim());
      }
      if (this.employeeForm.value.ssnId) {
        formData.append('CreateEmployeeDto.SSNId', this.employeeForm.value.ssnId.trim());
      }
      if (this.employeeForm.value.personId) {
        formData.append('CreateEmployeeDto.PersonId', this.employeeForm.value.personId.toString());
      }
      // if (this.employeeForm.value.contractId) {
      //   formData.append('CreateEmployeeDto.ContractId', this.employeeForm.value.contractId.toString());
      // }
      if (this.employeeForm.value.positionId) {
        formData.append('CreateEmployeeDto.PositionId', this.employeeForm.value.positionId.toString());
      }

      // Append Role
      formData.append('Role.Name', this.employeeForm.value.roleName?.trim() || '');

      // Append Person Files
      if (this.selectedImgFile) {
        formData.append('PersonFilesDto.ImgFile', this.selectedImgFile, this.selectedImgFile.name);
      }
      if (this.selectedCvFile) {
        formData.append('PersonFilesDto.CvFile', this.selectedCvFile, this.selectedCvFile.name);
      }
      if (this.selectedMilitaryFile) {
        formData.append('PersonFilesDto.MilitaryFile', this.selectedMilitaryFile, this.selectedMilitaryFile.name);
      }
      if (this.selectedEducationFile) {
        formData.append('PersonFilesDto.EducationFile', this.selectedEducationFile, this.selectedEducationFile.name);
      }

      // Append Employee Files
      if (this.selectedNationalIdFile) {
        formData.append('EmployeeFilesDto.NationalIdFile', this.selectedNationalIdFile, this.selectedNationalIdFile.name);
      }
      if (this.selectedPassportFile) {
        formData.append('EmployeeFilesDto.PassportFile', this.selectedPassportFile, this.selectedPassportFile.name);
      }
      if (this.selectedBirthCertificateFile) {
        formData.append('EmployeeFilesDto.BirthCertificateFile', this.selectedBirthCertificateFile, this.selectedBirthCertificateFile.name);
      }
debugger;
      // Call the API
      this.employeeService.addEmployee(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Employee added successfully! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/employees-data/employees']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || error.error?.error || 'Failed to add employee. Please try again.';
          console.error('Error adding employee:', error);
        }
      });
    } else {
      Object.keys(this.employeeForm.controls).forEach(key => {
        this.employeeForm.get(key)?.markAsTouched();
      });
    }
  }

  // Getters for form controls
  get fullName() { return this.employeeForm.get('fullName'); }
  get birthDate() { return this.employeeForm.get('birthDate'); }
  get gender() { return this.employeeForm.get('gender'); }
  get address() { return this.employeeForm.get('address'); }
  get country() { return this.employeeForm.get('country'); }
  get maritalStatus() { return this.employeeForm.get('maritalStatus'); }
  get nationality() { return this.employeeForm.get('nationality'); }
  get education() { return this.employeeForm.get('education'); }
  get militaryStatus() { return this.employeeForm.get('militaryStatus'); }
  get phoneNumber() { return this.employeeForm.get('phoneNumber'); }
  get email() { return this.employeeForm.get('email'); }
  get userName() { return this.employeeForm.get('userName'); }
  get roleName() { return this.employeeForm.get('roleName'); }
  get password() { return this.employeeForm.get('password'); }
  get confirmPassword() { return this.employeeForm.get('confirmPassword'); }

  // Password validation helpers
  hasMinLength(): boolean {
    const pwd = this.password?.value || '';
    return pwd.length >= 8;
  }

  hasUppercase(): boolean {
    const pwd = this.password?.value || '';
    return /[A-Z]/.test(pwd);
  }

  hasLowercase(): boolean {
    const pwd = this.password?.value || '';
    return /[a-z]/.test(pwd);
  }

  hasNumber(): boolean {
    const pwd = this.password?.value || '';
    return /[0-9]/.test(pwd);
  }

  hasSpecialChar(): boolean {
    const pwd = this.password?.value || '';
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
  }
}

