export interface LeaveRequest {
  id: number;
  requestedById: number;
  startDate: string;
  numberOfDays: number;
  typeId: number;
  type: string;
  status: string;
  reason: string;
  attachment: string | null;
  isPaid: boolean;
  createdOn: string;
  createdBy: string;
  firstApproveId: number;
  secondApproveId: number | null;
}
