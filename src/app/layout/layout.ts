import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar/navbar';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {}