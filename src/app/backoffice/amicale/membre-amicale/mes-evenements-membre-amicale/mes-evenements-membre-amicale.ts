import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../../../services/evenement';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

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

  this.events$ = this.eventService.getEvenementsCrees().pipe(
    map((events: any[]) => {

      const statutOrder: any = {
        'ACTIF': 1,
        'EN_ATTENTE': 2,
        'TERMINE': 3,
        'ARCHIVE': 4
      };

      // ✅ TRI
      const sorted = events.sort((a, b) => {

        if (statutOrder[a.statut] !== statutOrder[b.statut]) {
          return statutOrder[a.statut] - statutOrder[b.statut];
        }

        return new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime();
      });

      // ✅ BADGE RECENT
      let count = 0;
      sorted.forEach(e => {
        if (e.statut === 'ACTIF' && count < 3) {
          e.isRecent = true;
          count++;
        } else {
          e.isRecent = false;
        }
      });

      return sorted;
    })
  );

  this.loading = false;
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
  goToInscriptions(id: number) {
  this.router.navigate(['/inscriptions-evenement', id]);
}
archiver(id: number) {
  if (confirm("Archiver cet événement ?")) {
    this.eventService.archiverEvent(id).subscribe({
      next: () => {
        alert("✅ Événement archivé");
        location.reload(); // ou refresh propre si tu veux
      },
      error: () => alert("❌ Erreur archivage")
    });
  }
}
}