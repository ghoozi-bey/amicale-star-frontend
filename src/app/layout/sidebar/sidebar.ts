import { Component } from '@angular/core';
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
export class SidebarComponent {

isAmicale = false;
showEventsMenu = false;   // menu fermé par défaut

constructor(private userService: UserService) {}

ngOnInit() {
  const role = this.userService.getRole();

  if (role === 'amicale') {
    this.isAmicale = true;
  }
}

toggleEvents() {
  this.showEventsMenu = !this.showEventsMenu;
}


}