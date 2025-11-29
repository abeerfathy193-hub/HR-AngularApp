import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UserService } from '../../services/user.service';
import { CheckInOutComponent } from "../pages/check-in-out-component/check-in-out-component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, CheckInOutComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  @Output() toggleSidebar = new EventEmitter<void>();


  constructor(
    public navigationService: NavigationService,
    public userService: UserService
  ) { }

  
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }



  onLogout(): void {
    this.userService.logout();
  }
}

