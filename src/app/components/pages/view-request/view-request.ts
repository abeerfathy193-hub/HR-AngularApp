import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from '../../../services/requests.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveTypeService } from '../../../services/leavetype.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-request',
  imports: [DatePipe, CommonModule],
  templateUrl: './view-request.html',
  styleUrl: './view-request.css',
})
export class ViewRequest implements OnInit {
  requestData: any;
  leaveTypeName: any;
  requestType!: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private requestsService: RequestsService,
    private leaveTypesService: LeaveTypeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const type = this.route.snapshot.paramMap.get('type');

    this.requestType = type!;
    switch (type) {
      case 'Leave':
        this.requestsService.getLeaveRequestById(id).subscribe((r) => {
          this.requestData = r.result;
          this.leaveTypesService
            .getById(this.requestData.typeId)
            .subscribe((r) => (this.leaveTypeName = r.name));
        });
        break;
      case 'Resignation':
        this.requestsService
          .getResignationRequestById(id)
          .subscribe((r) => (this.requestData = r.result));
        break;
      case 'HR Letter':
        this.requestsService
          .getHRLetterRequestById(id)
          .subscribe((r) => (this.requestData = r.result));
        break;
    }
  }

  statusMap: any = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Cancelled',
  };

  goBack() {
    this.location.back();
  }
}
