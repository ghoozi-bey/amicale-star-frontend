import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    const role = this.user?.typeAdherent;

    // ✅ IMPORTANT : accepte MEMBRE_AMICALE ou AMICALE
    this.isAmicale = role === 'MEMBRE_AMICALE' || role === 'AMICALE';
  }

  toggleEvents() {
    this.showEventsMenu = !this.showEventsMenu;
  }

}