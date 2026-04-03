import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private eventService: EvenementService,
    private cdr: ChangeDetectorRef // 🔥 IMPORTANT
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getMesEvenements().subscribe({
      next: (data) => {
        this.events = data;

        // 🔥 FORCER REFRESH UI
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  deleteEvent(id: number) {
    if (confirm("Supprimer cet événement ?")) {
      this.eventService.deleteEvenement(id).subscribe(() => {
        this.events = this.events.filter(e => e.id !== id);
        this.cdr.detectChanges(); // 🔥 important aussi
      });
    }
  }
}