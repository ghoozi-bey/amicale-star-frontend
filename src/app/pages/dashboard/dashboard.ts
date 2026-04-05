import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  evenements$!: Observable<any[]>; // 🔥 Observable

  selectedEvent: any = null;

  constructor(private evenementService: EvenementService) {
    this.loadEvenements();
  }

  loadEvenements(): void {
    this.evenements$ = this.evenementService.getEvenementsActifs();
  }

  openDetails(e: any): void {
    this.selectedEvent = e;
  }

  closeDetails(): void {
    this.selectedEvent = null;
  }
}