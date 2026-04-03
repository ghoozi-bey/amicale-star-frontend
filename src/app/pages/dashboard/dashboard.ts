import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  evenements: any[] = [];
  selectedEvent: any = null;

  constructor(private evenementService: EvenementService) {}

  ngOnInit(): void {
    this.loadEvenements();
  }

  // 🔥 IMPORTANT : utiliser ACTIFS uniquement
  loadEvenements(): void {
    this.evenementService.getEvenementsActifs().subscribe({
      next: (data) => {
        this.evenements = data;
      },
      error: (err) => {
        console.error('Erreur chargement événements:', err);
      }
    });
  }

  openDetails(e: any): void {
    this.selectedEvent = e;
  }

  closeDetails(): void {
    this.selectedEvent = null;
  }
}
