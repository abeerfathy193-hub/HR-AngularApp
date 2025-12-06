export interface ResignationRequest {
  id: number;
  reason: string;
  proposedLastWorkingDay: string;
  attachment: string | null;
  status: string;
  createdOn: string;
  firstApproveId: number;
  secondApproveId: number | null;
  createdBy: string;
}
