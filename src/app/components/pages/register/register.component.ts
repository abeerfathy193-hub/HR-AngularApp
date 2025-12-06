import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { GenderType, MaritalStatus, MilitaryStatus, CreatePerson, ApplicantCreate } from '../../../interfaces/register.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // File properties
  selectedImgFile: File | null = null;
  selectedCvFile: File | null = null;
  selectedMilitaryFile: File | null = null;
  selectedEducationFile: File | null = null;

  // Preview URLs
  imgPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
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

      // Person Files
      imgFile: [null],
      cvFile: [null],
      militaryFile: [null],
      educationFile: [null],

      // Applicant Data
      currentJobTitle: [''],
      currentCompany: [''],
      linkedInUrl: ['', Validators.pattern('https?://.*linkedin\.com.*')],
      portfolioUrl: ['', Validators.pattern('https?://.+')],
      githubUrl: ['', Validators.pattern('https?://.*github\.com.*')],
      professionalSummary: [''],

      // Account credentials
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  passwordStrengthValidator(control: any) {
    if (!control.value) {
      return null; // Don't validate empty values (use 'required' validator for that)
    }

    const password = control.value;
    const errors: any = {};

    // Check minimum length
    if (password.length < 8) {
      errors.minLength = true;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = true;
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.lowercase = true;
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      errors.number = true;
    }

    // Check for special character
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
        // Clear passwordMismatch error if passwords match
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

  onImgFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
this.selectedImgFile = input.files[0];
      this.registerForm.patchValue({ imgFile: this.selectedImgFile });

      // Create preview
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
      this.registerForm.patchValue({ cvFile: this.selectedCvFile });
    }
  }

  onMilitaryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedMilitaryFile = input.files[0];
      this.registerForm.patchValue({ militaryFile: this.selectedMilitaryFile });
    }
  }

  onEducationFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedEducationFile = input.files[0];
      this.registerForm.patchValue({ educationFile: this.selectedEducationFile });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Create FormData
      const formData = new FormData();

      // Append password
      formData.append('password', this.registerForm.value.password || '');

      // Append CreatePerson properties (nested object properties)

      formData.append('CreatePersonDto.FullName', this.registerForm.value.fullName? this.registerForm.value.fullName.toString().trim() : '');
      formData.append('CreatePersonDto.BirthDate', this.registerForm.value.birthDate? this.registerForm.value.birthDate.toString().trim() : '');
      formData.append('CreatePersonDto.Gender', this.registerForm.value.gender? this.registerForm.value.gender.toString().trim() : '');
      formData.append('CreatePersonDto.Address', this.registerForm.value.address? this.registerForm.value.address.toString().trim() : '');
      formData.append('CreatePersonDto.Country', this.registerForm.value.country? this.registerForm.value.country.toString().trim() : '');
      formData.append('CreatePersonDto.MaritalStatus', this.registerForm.value.maritalStatus? this.registerForm.value.maritalStatus.toString().trim() : '');
      formData.append('CreatePersonDto.Nationality', this.registerForm.value.nationality? this.registerForm.value.nationality.toString().trim() : '');
      formData.append('CreatePersonDto.Education', this.registerForm.value.education? this.registerForm.value.education.toString().trim() : '');
      formData.append('CreatePersonDto.MilitaryStatus',this.registerForm.value.militaryStatus? this.registerForm.value.militaryStatus.toString().trim() : '');
      formData.append('CreatePersonDto.Email',this.registerForm.value.email? this.registerForm.value.email.toString().trim() : '');
      formData.append('CreatePersonDto.PhoneNumber', this.registerForm.value.phoneNumber? this.registerForm.value.phoneNumber.toString().trim() : '');
      formData.append('CreatePersonDto.UserName', this.registerForm.value.userName? this.registerForm.value.userName.toString().trim() : '');

      // Append ApplicantCreate properties (nested object properties, all optional)
      const applicantData = {
        currentJobTitle: this.registerForm.value.currentJobTitle?.trim(),
        currentCompany: this.registerForm.value.currentCompany?.trim(),
        linkedInUrl: this.registerForm.value.linkedInUrl?.trim(),
        portfolioUrl: this.registerForm.value.portfolioUrl?.trim(),
        githubUrl: this.registerForm.value.githubUrl?.trim(),
        professionalSummary: this.registerForm.value.professionalSummary?.trim()
      };

      // Only append applicant properties that have values
      if (applicantData.currentJobTitle) {
        formData.append('applicantCreate.currentJobTitle', applicantData.currentJobTitle);
      }
      if (applicantData.currentCompany) {
        formData.append('applicantCreate.currentCompany', applicantData.currentCompany);
      }
      if (applicantData.linkedInUrl) {
        formData.append('applicantCreate.linkedInUrl', applicantData.linkedInUrl);
      }
      if (applicantData.portfolioUrl) {
        formData.append('applicantCreate.portfolioUrl', applicantData.portfolioUrl);
      }
      if (applicantData.githubUrl) {
        formData.append('applicantCreate.githubUrl', applicantData.githubUrl);
      }
      if (applicantData.professionalSummary) {
        formData.append('applicantCreate.professionalSummary', applicantData.professionalSummary);
      }

      // Append Person Files
      if (this.selectedImgFile) {
        formData.append('imgFile', this.selectedImgFile, this.selectedImgFile.name);
      }
      if (this.selectedCvFile) {
        formData.append('cvFile', this.selectedCvFile, this.selectedCvFile.name);
      }
      if (this.selectedMilitaryFile) {
        formData.append('militaryFile', this.selectedMilitaryFile, this.selectedMilitaryFile.name);
      }
      if (this.selectedEducationFile) {
        formData.append('educationFile', this.selectedEducationFile, this.selectedEducationFile.name);
      }

      // Debug: Log FormData contents (remove in production)
      // this.logFormData(formData);

      // Call the API
      this.authService.register(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || error.error?.error || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  // Getters for form controls
  get fullName() { return this.registerForm.get('fullName'); }
  get birthDate() { return this.registerForm.get('birthDate'); }
  get gender() { return this.registerForm.get('gender'); }
  get address() { return this.registerForm.get('address'); }
  get country() { return this.registerForm.get('country'); }
  get maritalStatus() { return this.registerForm.get('maritalStatus'); }
  get nationality() { return this.registerForm.get('nationality'); }
  get education() { return this.registerForm.get('education'); }
  get militaryStatus() { return this.registerForm.get('militaryStatus'); }
  get userName() { return this.registerForm.get('userName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get linkedInUrl() { return this.registerForm.get('linkedInUrl'); }
  get portfolioUrl() { return this.registerForm.get('portfolioUrl'); }
  get githubUrl() { return this.registerForm.get('githubUrl'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get professionalSummary() { return this.registerForm.get('professionalSummary'); }

  // Password validation helper methods
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

  // Helper method to log FormData (for debugging)
  private logFormData(formData: FormData): void {
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
  }
}

