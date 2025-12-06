import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContractService } from '../../../../services/contract.service';
import { ContractCreateDto, ContractPointCreateDto,ContractType } from '../../../../interfaces/Contrac.interface';

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-contract.html',
  styleUrl: './create-contract.css'
})
export class CreateContractComponent {
contractTypes = Object.values(ContractType);

  dto: ContractCreateDto = {
    title: '',
    contractType: '',
    startDate: '',
    endDate: '',
    baseSalary: 0,
    employeeId: 0,
    workingHoursPerDay: '',
    annualLeaveDays: 0,
    probationPeriodDays: 0,
    noticePeriodDays: 0,
    points: []
  };

  // Temporary fields for new point
  newPoint: ContractPointCreateDto = { header: '', description: '' };

  constructor(
    private service: ContractService,
    private router: Router
  ) {}

  // Add point to the points list
  addPoint() {
    if (!this.newPoint.header || !this.newPoint.description) {
      alert('Please enter header and description for the point.');
      return;
    }
    this.dto.points!.push({ ...this.newPoint });
    this.newPoint = { header: '', description: '' }; // reset input fields
  }

  removePoint(index: number) {
    this.dto.points!.splice(index, 1);
  }

  submit() {
    this.service.addContract(this.dto).subscribe(() => {
      alert('Contract created successfully!');
      this.router.navigate(['/contracts']);
    });
  }
}
