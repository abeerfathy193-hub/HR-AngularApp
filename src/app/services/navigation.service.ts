import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadcrumbItem } from '../interfaces/breadcrumb.interface';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _currentPageTitle = signal<string>('Dashboard');
  private _breadcrumbs = signal<BreadcrumbItem[]>([]);

  currentPageTitle = this._currentPageTitle.asReadonly();
  breadcrumbs = this._breadcrumbs.asReadonly();

  private routeTitleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/company-data': 'Company Data',
    '/company-data/company-info': 'Company Info',
    '/company-data/departments': 'Departments',
    '/company-data/positions': 'Positions',
    '/contracts': 'Contracts',

    '/leaves-holidays': 'Leaves & Holidays',
    '/employees-data': 'Employees Data',
    '/employees-data/employees': 'Employees Info',

    '/payroll': 'Payroll',
    '/attendance': 'Attendance',
    '/vacancies': 'Vacancies',
    '/reports': 'Reports',
    '/requests': 'Request',
    '/requests/leaves': 'Leaves',
    '/requests/resignations': 'Resignations',
    '/requests/hrletters': 'HR Letters',
    '/requests/view/:id': 'View Request',
  };

  constructor(private router: Router) {
    const currentUrl = this.router.url || '/dashboard';
    this.updateBreadcrumbs(currentUrl);
    this.updatePageTitle(currentUrl);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs(event.url);
        this.updatePageTitle(event.url);
      }
    });
  }

  private updatePageTitle(url: string): void {
    const title = this.routeTitleMap[url] || 'Dashboard';
    this._currentPageTitle.set(title);
  }

  private updateBreadcrumbs(url: string): void {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', url: '/dashboard' }, // start From Dashboard
    ];

    if (url !== '/dashboard') {
      const segments = url.split('/').filter((segment) => segment);
      let currentPath = '';

      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const label = this.routeTitleMap[currentPath] || this.formatLabel(segment);
        breadcrumbs.push({ label, url: currentPath });
      });
    }

    this._breadcrumbs.set(breadcrumbs);
  }

  private formatLabel(segment: string): string {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
