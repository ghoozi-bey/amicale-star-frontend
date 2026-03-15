import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  isAmicale = false;
  showEventsMenu = false;

  user: any = {};

  constructor(private userService: UserService) {}

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    const role = this.user.typeAdherent;

    if (role === 'AMICALE') {
      this.isAmicale = true;
    }

  }

  toggleEvents() {
    this.showEventsMenu = !this.showEventsMenu;
  }

}