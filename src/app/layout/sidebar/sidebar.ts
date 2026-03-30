import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  user: any = {};
  isAdmin = false;
  isAmicale = false;

  showEventsMenu = false;
  showUsersMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    const role = this.user?.role;

    // ✅ FIX ROLE
    this.isAdmin = role?.includes('ADMIN');
    this.isAmicale = role?.includes('MEMBRE_AMICALE');
  }

  toggleEvents() {
    this.showEventsMenu = !this.showEventsMenu;
  }

  toggleUsers() {
    this.showUsersMenu = !this.showUsersMenu;
  }
}