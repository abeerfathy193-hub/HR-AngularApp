import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { CompanyDataComponent } from './components/pages/company-data/company-data.component';
import { CompanyInfoComponent } from './components/pages/company-info/company-info.component';
import { DepartmentsComponent } from './components/pages/departments/departments.component';
import { PositionsComponent } from './components/pages/positions/positions.component';
import { LeavesHolidaysComponent } from './components/pages/leaves-holidays/leaves-holidays.component';
import { EmployeesDataComponent } from './components/pages/employees-data/employees-data.component';
import { PayrollComponent } from './components/pages/payroll/payroll.component';
import { ContractsComponent } from './components/pages/contracts/contracts.component';
import { AttendanceComponent } from './components/pages/attendance/attendance.component';
import { VacanciesComponent } from './components/pages/vacancies/vacancies.component';
import { LoginComponent } from './components/pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { OpenVacancies } from './components/pages/open-vacancies/open-vacancies';
import { ApplyForm } from './components/pages/apply-form/apply-form';
import { MyApplications } from './components/pages/my-applications/my-applications';
import { ApplicationDetails } from './components/pages/application-details/application-details';
import { Interview } from './components/pages/interview/interview';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'openvacancies', component: OpenVacancies },
  { path: 'apply/:id', component: ApplyForm },
  { path: 'my-applications', component: MyApplications },


  {
    path: '',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'company-data', component: CompanyDataComponent, children: [
        {path: 'company-info', component: CompanyInfoComponent},
        {path: 'departments', component: DepartmentsComponent},
        {path: 'positions', component: PositionsComponent}
      ]},
      { path: 'contracts', component: ContractsComponent },
      { path: 'leaves-holidays', component: LeavesHolidaysComponent },
      { path: 'employees-data', component: EmployeesDataComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'vacancies', component: VacanciesComponent },
      { path: 'application-details/:id', component: ApplicationDetails },
      { path: 'schedule-interview/:applicationId', component: Interview }



    ]
    
  }
  
];
