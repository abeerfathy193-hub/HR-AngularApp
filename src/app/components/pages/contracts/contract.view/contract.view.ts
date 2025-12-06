  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ActivatedRoute, Router } from '@angular/router';
  import { ContractService } from '../../../../services/contract.service';
  import { ContractDto } from '../../../../interfaces/Contrac.interface';

  @Component({
    selector: 'app-view-contract',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contract.view.html',
    styleUrl: './contract.view.css'
  })
  export class ViewContractComponent implements OnInit {

    contract: ContractDto | null = null;
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

    goBack() {
      this.router.navigate(['/contracts']);
    }

    editContract() {
      this.router.navigate(['/contracts/edit', this.contractId]);
    }

    deleteContract() {
      if (!confirm('Are you sure you want to delete this contract?')) return;

      this.service.deleteContract(this.contractId).subscribe(() => {
        alert('Contract deleted successfully!');
        this.router.navigate(['/contracts']);
      });
    }
  }