import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  allowedRoles: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnChanges{
  @Input() collapsed: boolean = false;
  expandedComponents: Record<string, boolean> = {};
  role: string = '';

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'bi bi-speedometer2', allowedRoles: ['Admin', 'HR'] },
    {
      label: 'Company Data',
      route: '/company-data',
      icon: 'bi bi-building',
      allowedRoles: ['Admin', 'HR'],
      children: [
        { label: 'Company Info', route: '/company-data/company-info', icon: 'bi bi-info-circle', allowedRoles: ['Admin', 'HR'] },
        { label: 'Departments', route: '/company-data/departments', icon: 'bi bi-diagram-3', allowedRoles: ['Admin', 'HR'] },
        { label: 'Positions', route: '/company-data/positions', icon: 'bi bi-briefcase', allowedRoles: ['Admin', 'HR'] },
      ]
    },
    { label: 'Contracts', route: '/contracts', icon: 'bi bi-file-earmark-text', allowedRoles: ['Admin', 'HR'] },
    { label: 'Leaves & Holidays', route: '/leaves-holidays', icon: 'bi bi-calendar2-week', allowedRoles: ['Admin', 'HR'] },
    { label: 'Employees Data', route: '/employees-data', icon: 'bi bi-people', allowedRoles: ['Admin', 'HR'],
      children:[
        { label: 'Employees', route: '/employees-data/employees', icon: 'bi bi-person-vcard', allowedRoles: ['Admin', 'HR'] },
      ],
     },
    { label: 'Payroll', route: '/payroll', icon: 'bi bi-cash-stack', allowedRoles: ['Admin', 'HR'] },
    { label: 'Attendance', route: '/attendance', icon: 'bi bi-clock-history', allowedRoles: ['Admin', 'HR'] },
    { label: 'Vacancies', route: '/vacancies', icon: 'bi bi-clipboard-check', allowedRoles: ['Admin', 'HR'] },
    { label: 'Reports', route: '/reports', icon: 'bi bi-bar-chart-line', allowedRoles: ['Admin', 'HR'] },
  ];

  constructor(private authService: AuthService) { 
    this.role = this.authService.getUserRole() || '';
    // this.menuItems = this.filterMenuItems(this.menuItems);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['collapsed'].firstChange){
      this.collapsed = changes['collapsed'].currentValue;
    }
  }
  filterMenuItems(items: MenuItem[]) {
  return items
    .filter(item => !item.allowedRoles || item.allowedRoles.includes(this.role))
    .map(item => {
      const newItem = { ...item };
      if (item.children) 
        newItem.children = this.filterMenuItems(item.children);
      return newItem;
    });
  }

  toggleSection(item: MenuItem): void {
    if (item.children) 
      this.expandedComponents[item.label] = !this.expandedComponents[item.label];
    
  }

  isExpanded(item: MenuItem): boolean {
    if (item.children)
      return this.expandedComponents[item.label];
    return false;
  }
}

