export interface HRLetter {
  id: number;
  sentTo: string;
  reason: string;
  extraDetails: string | null;
  attachment: string | null;
  status: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  firstApproveId: string;
  secondApproveId: string | null;
}
