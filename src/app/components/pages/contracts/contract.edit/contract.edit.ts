import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../../services/contract.service';
import { ContractDto, ContractPointCreateDto, ContractPointDto,ContractType } from '../../../../interfaces/Contrac.interface';

@Component({
  selector: 'app-edit-contract',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract.edit.html',
  styleUrl: './contract.edit.css'
})
export class EditContractComponent implements OnInit {
  contractTypes = Object.values(ContractType);

  contract: ContractDto = {
    id: 0,
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
    isActive: true,
    status: '',
    points: []
  };

  // Temporary fields for new point
  newPoint: ContractPointCreateDto = { header: '', description: '' };
  contractId: number = 0;

  constructor(
    private service: ContractService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.contractId = +this.route.snapshot.params['id'];
    this.loadContract();
  }

  loadContract() {
    this.service.getContractById(this.contractId).subscribe(res => {
      this.contract = res;
    });
  }

  // Add new point to existing contract
  addPoint() {
    if (!this.newPoint.header || !this.newPoint.description) {
      alert('Please enter header and description for the point.');
      return;
    }

    this.service.addPoint(this.contractId, this.newPoint).subscribe(res => {
      this.contract.points.push(res);
      this.newPoint = { header: '', description: '' };
      alert('Point added successfully!');
    });
  }

  // Remove existing point
  removePoint(pointId: number, index: number) {
    if (!confirm('Are you sure you want to remove this point?')) return;

    this.service.removePoint(pointId).subscribe(() => {
      this.contract.points.splice(index, 1);
      alert('Point removed successfully!');
    });
  }

  submit() {
    this.service.updateContract(this.contract).subscribe(() => {
      alert('Contract updated successfully!');
      this.router.navigate(['/contracts']);
    });
  }

  cancel() {
    this.router.navigate(['/contracts']);
  }
}