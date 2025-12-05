import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { CompanyDataComponent } from './components/pages/company-data/company-data.component';
import { DepartmentsComponent } from './components/pages/departments/departments.component';
import { PositionsComponent } from './components/pages/positions/positions.component';
import { LeavesHolidaysComponent } from './components/pages/leaves-holidays/leaves-holidays.component';
import { EmployeesDataComponent } from './components/pages/employees-data/employees-data.component';
import { PayrollComponent } from './components/pages/payroll/payroll.component';
import { ContractsComponent } from './components/pages/contracts/contracts.component';
import { AttendanceComponent } from './components/pages/attendance/attendance.component';
import { VacanciesComponent } from './components/pages/vacancies/vacancies.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { Leaves } from './components/pages/leaves/leaves';
import { Requests } from './components/pages/requests/requests';
import { Resignations } from './components/pages/resignations/resignations';
import { Hrletters } from './components/pages/hrletters/hrletters';
import { ViewRequest } from './view-request/view-request';
import { CreateContractComponent } from './components/pages/contracts/create.contract/create-contract';
import { ViewContractComponent } from './components/pages/contracts/contract.view/contract.view';
import { EditContractComponent } from './components/pages/contracts/contract.edit/contract.edit';
import { EmployeeComponent } from './components/pages/employee-component/employee-component';
import { AddEmployeeComponent } from './components/pages/employee-component/add-employee/add-employee.component';
import { LeaveTypeComponent } from './components/pages/leavetypscomponant/leavetypscomponant';
import { CompanyInfoComponent } from './components/pages/company-info/company-info.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'company-data',
        component: CompanyDataComponent,
        children: [
          { path: 'company-info', component: CompanyInfoComponent },
          { path: 'departments', component: DepartmentsComponent },
          { path: 'positions', component: PositionsComponent },
        ],
      },
      { path: 'contracts', component: ContractsComponent },
      { path: 'contracts/create', component: CreateContractComponent },
      { path: 'contracts/view/:id', component: ViewContractComponent },
      { path: 'contracts/edit/:id', component: EditContractComponent },
      { path: 'leaves-holidays', component: LeavesHolidaysComponent },
      {
        path: 'employees-data',
        component: EmployeesDataComponent,
        children: [
          { path: 'employees', component: EmployeeComponent },
          { path: 'employees/create', component: AddEmployeeComponent },
        ],
      },
      { path: 'payroll', component: PayrollComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'vacancies', component: VacanciesComponent },
       { path: 'Leavetyps', component: LeaveTypeComponent }
    ]
  }
      { path: 'requests', component: Requests },
      { path: 'requests/leaves', component: Leaves },
      { path: 'requests/resignations', component: Resignations },
      { path: 'requests/hrletters', component: Hrletters },
      { path: 'requests/view/:id/:type', component: ViewRequest },
    ],
  },
];
