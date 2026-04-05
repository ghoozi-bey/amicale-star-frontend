import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../../../services/evenement';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mes-evenements-membre-amicale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-evenements-membre-amicale.html',
  styleUrls: ['./mes-evenements-membre-amicale.css']
})
export class MesEvenementsMembreAmicaleComponent {

  events$!: Observable<any[]>;

  constructor(
    private eventService: EvenementService,
    private router: Router
  ) {
    this.loadEvents();
  }

  loadEvents() {
    this.events$ = this.eventService.getEvenementsCrees();
  }

  deleteEvent(id: number) {
    if (confirm("Supprimer cet événement ?")) {
      this.eventService.deleteEvenement(id).subscribe(() => {
        this.loadEvents();
      });
    }
  }

  // 🔥 AJOUT IMPORTANT
  editEvent(id: number) {
    this.router.navigate(['/modifier-evenement', id]);
  }
}