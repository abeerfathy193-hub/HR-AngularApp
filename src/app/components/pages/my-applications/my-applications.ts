// my-applications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApplicationService, ApplicationDto } from '../../../services/application.service';

// Enums as strings
enum ApplicationStatus {
  Pending = 'Pending',
  UnderReview = 'UnderReview',
  Shortlisted = 'Shortlisted',
  Interviewing = 'Interviewing',
  Offered = 'Offered',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn'
}

enum ApplicationSource {
  Internal = 'Internal',
  External = 'External',
  Referral = 'Referral',
  Agency = 'Agency',
  Campus = 'Campus',
  Other = 'Other'
}

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.html',
  styleUrls: ['./my-applications.css']
})
export class MyApplications implements OnInit {
  applications: ApplicationDto[] = [];
  isLoading = true;
  errorMessage = '';
  applicantId = '97dd5fc3-2db5-4696-9528-94979a0656f0';

  // Summary counts
  totalApplications = 0;
  pendingCount = 0;
  interviewingCount = 0;
  offersCount = 0;

  // Status configurations for display
  statusConfig: { [key: string]: { label: string; class: string; icon: string } } = {
    'Pending': { label: 'Pending', class: 'status-pending', icon: 'fa-clock' },
    'UnderReview': { label: 'Under Review', class: 'status-review', icon: 'fa-search' },
    'Shortlisted': { label: 'Shortlisted', class: 'status-shortlisted', icon: 'fa-list-check' },
    'Interviewing': { label: 'Interviewing', class: 'status-interviewing', icon: 'fa-user-tie' },
    'Offered': { label: 'Offered', class: 'status-offered', icon: 'fa-gift' },
    'Accepted': { label: 'Accepted', class: 'status-accepted', icon: 'fa-circle-check' },
    'Rejected': { label: 'Rejected', class: 'status-rejected', icon: 'fa-circle-xmark' },
    'Withdrawn': { label: 'Withdrawn', class: 'status-withdrawn', icon: 'fa-ban' }
  };

  // Source configurations
  sourceConfig: { [key: string]: { label: string; icon: string } } = {
    'Internal': { label: 'Internal', icon: 'fa-building' },
    'External': { label: 'External', icon: 'fa-globe' },
    'Referral': { label: 'Referral', icon: 'fa-user-group' },
    'Agency': { label: 'Agency', icon: 'fa-briefcase' },
    'Campus': { label: 'Campus', icon: 'fa-graduation-cap' },
    'Other': { label: 'Other', icon: 'fa-ellipsis' }
  };

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get applicantId from JWT token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.parseJwt(token);
      //this.applicantId = payload.sub || payload.userId || payload.nameid || payload.id;
      this.applicantId = '97dd5fc3-2db5-4696-9528-94979a0656f0';

    }
    
    if (!this.applicantId) {
      // Fallback for testing - remove in production
      this.applicantId = '"97dd5fc3-2db5-4696-9528-94979a0656f0"';
      console.warn('Using test applicantId. Please implement proper authentication.');
    }
    
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.errorMessage = '';

    this.applicationService.getByApplicant(this.applicantId).subscribe({
      next: (data) => {
        this.applications = data.sort((a, b) => {
          // Sort by appliedAt descending (newest first)
          const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
          const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
          return dateB - dateA;
        });
        
        // Calculate summary counts
        this.calculateSummary();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Please login to view your applications.';
          this.router.navigate(['/login']);
        } else if (error.status === 404) {
          this.errorMessage = 'No applications found.';
          this.applications = [];
        } else {
          this.errorMessage = 'Error loading applications. Please try again later.';
        }
      }
    });
  }

  getStatusInfo(status: any) {
    const statusStr = typeof status === 'number' ? this.numberToStatus(status) : status;
    return this.statusConfig[statusStr] || { label: 'Unknown', class: 'status-unknown', icon: 'fa-question' };
  }

  getSourceInfo(source: any) {
    const sourceStr = typeof source === 'number' ? this.numberToSource(source) : source;
    return this.sourceConfig[sourceStr] || { label: 'Unknown', icon: 'fa-question' };
  }

  // Convert number to status string (for backward compatibility)
  private numberToStatus(num: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'UnderReview',
      2: 'Shortlisted',
      3: 'Interviewing',
      4: 'Offered',
      5: 'Accepted',
      6: 'Rejected',
      7: 'Withdrawn'
    };
    return statusMap[num] || 'Unknown';
  }

  // Convert number to source string (for backward compatibility)
  private numberToSource(num: number): string {
    const sourceMap: { [key: number]: string } = {
      0: 'Internal',
      1: 'External',
      2: 'Referral',
      3: 'Agency',
      4: 'Campus',
      5: 'Other'
    };
    return sourceMap[num] || 'Unknown';
  }

  // viewDetails(applicationId: number) {
  //   this.router.navigate(['/application-details', applicationId]);
  // }

  withdrawApplication(application: ApplicationDto) {
    const statusStr = typeof application.applicationStatus === 'number' 
      ? this.numberToStatus(application.applicationStatus as any) 
      : application.applicationStatus;

    if (statusStr === ApplicationStatus.Rejected || statusStr === ApplicationStatus.Withdrawn) {
      alert('This application has already been closed.');
      return;
    }

    const statusInfo = this.getStatusInfo(application.applicationStatus);
    const confirmMsg = `Are you sure you want to withdraw your application?\n\nStatus: ${statusInfo.label}`;
    
    if (confirm(confirmMsg)) {
      this.applicationService.deleteApplication(application.id!).subscribe({
        next: () => {
          alert('Application withdrawn successfully.');
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error withdrawing application:', error);
          alert('Error withdrawing application. Please try again.');
        }
      });
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatSalary(salary: number | undefined, currency: string | undefined): string {
    if (!salary) return 'Not specified';
    return `${salary.toLocaleString()} ${currency || ''}`;
  }

  canWithdraw(status: any): boolean {
    const statusStr = typeof status === 'number' ? this.numberToStatus(status) : status;
    return statusStr !== ApplicationStatus.Rejected && statusStr !== ApplicationStatus.Withdrawn;
  }

  applyForNewJob() {
    this.router.navigate(['/openvacancies']);
  }

  calculateSummary() {
    this.totalApplications = this.applications.length;
    
    this.pendingCount = this.applications.filter(a => {
      const statusStr = typeof a.applicationStatus === 'number' 
        ? this.numberToStatus(a.applicationStatus as any) 
        : a.applicationStatus;
      return statusStr === ApplicationStatus.Pending || statusStr === ApplicationStatus.UnderReview;
    }).length;
    
    this.interviewingCount = this.applications.filter(a => {
      const statusStr = typeof a.applicationStatus === 'number' 
        ? this.numberToStatus(a.applicationStatus as any) 
        : a.applicationStatus;
      return statusStr === ApplicationStatus.Interviewing;
    }).length;
    
    this.offersCount = this.applications.filter(a => {
      const statusStr = typeof a.applicationStatus === 'number' 
        ? this.numberToStatus(a.applicationStatus as any) 
        : a.applicationStatus;
      return statusStr === ApplicationStatus.Offered || statusStr === ApplicationStatus.Accepted;
    }).length;
  }

  // Helper to parse JWT token
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return {};
    }
  }
  // Add this method to MyApplications class
getDaysSince(date: Date | string | undefined): string {
  if (!date) return 'N/A';
  
  const appliedDate = new Date(date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - appliedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Applied today';
  if (diffDays === 1) return 'Applied yesterday';
  if (diffDays < 7) return `Applied ${diffDays} days ago`;
  if (diffDays < 30) return `Applied ${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `Applied ${Math.floor(diffDays / 30)} months ago`;
  return `Applied ${Math.floor(diffDays / 365)} years ago`;
}

// Optional: Add color coding for timeline
getTimelineColor(date: Date | string | undefined): string {
  if (!date) return '#666';
  
  const appliedDate = new Date(date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - appliedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) return '#10b981'; // Green for recent
  if (diffDays < 30) return '#f59e0b'; // Yellow for medium
  return '#ef4444'; // Red for old applications
}
}