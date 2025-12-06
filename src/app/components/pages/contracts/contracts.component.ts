import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContractService } from '../../../services/contract.service';
import { ContractDto } from '../../../interfaces/Contrac.interface';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.css'
})
export class ContractsComponent implements OnInit {

  contracts: ContractDto[] = [];
  activeTab: 'all' | 'active' = 'all';

  constructor(
    private contractService: ContractService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    if (this.activeTab === 'all') {
      this.contractService.getAllContracts().subscribe(res => {
        this.contracts = res;
      });
    } else {
      this.contractService.getAllActiveContracts().subscribe(res => {
        this.contracts = res;
      });
    }
  }

  switchTab(tab: 'all' | 'active') {
    this.activeTab = tab;
    this.loadContracts();
  }

  addContract() {
    this.router.navigate(['/contracts/create']);
  }

  view(id: number) {
    this.router.navigate(['/contracts/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/contracts/edit', id]);
  }

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this contract?")) return;

    this.contractService.deleteContract(id).subscribe(() => {
      this.loadContracts();
    });
  }
}