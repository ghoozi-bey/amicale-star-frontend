import { Component, OnInit } from '@angular/core';
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
export class MesEvenementsMembreAmicaleComponent implements OnInit {

  events$!: Observable<any[]>;
  loading = true;

  constructor(
    private eventService: EvenementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;

    // ✅ FIX ICI 🔥
    this.events$ = this.eventService.getEvenementsCrees();

    this.events$.subscribe({
      next: () => this.loading = false,
      error: (err) => {
        console.error(err); // 🔥 debug
        this.loading = false;
      }
    });
  }

  deleteEvent(id: number) {
    if (confirm("Supprimer cet événement ?")) {
      this.eventService.deleteEvenement(id).subscribe(() => {
        this.loadEvents();
      });
    }
  }

  editEvent(id: number) {
    this.router.navigate(['/modifier-evenement', id]);
  }
}