import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-employees-data',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employees-data.component.html',
  styleUrl: './employees-data.component.css'
})
export class EmployeesDataComponent {
}

