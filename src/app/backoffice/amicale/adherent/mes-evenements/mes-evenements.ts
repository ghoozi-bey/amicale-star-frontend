import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../../../services/evenement';

@Component({
  selector: 'app-mes-evenements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-evenements.html',
  styleUrls: ['./mes-evenements.css']
})
export class MesEvenementsComponent implements OnInit {

  events: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private eventService: EvenementService) {}

  ngOnInit() {
    this.loadEvents();
  }

  // 🔥 🔥 CORRECTION ICI
  loadEvents() {
    this.eventService.getMesEvenements().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Erreur lors du chargement";
        this.loading = false;
      }
    });
  }
}