import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../../../services/evenement';

@Component({
  selector: 'app-mes-evenements-membre-amicale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-evenements-membre-amicale.html',
  styleUrls: ['./mes-evenements-membre-amicale.css']
})
export class MesEvenementsMembreAmicaleComponent implements OnInit {

  events: any[] = [];

  constructor(private eventService: EvenementService) {}

  ngOnInit() {
    this.eventService.getMesEvenements().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error(err)
    });
  }

  deleteEvent(id: number) {
    if (confirm("Supprimer cet événement ?")) {
      this.eventService.deleteEvenement(id).subscribe(() => {
        this.events = this.events.filter(e => e.id !== id);
      });
    }
  }
}