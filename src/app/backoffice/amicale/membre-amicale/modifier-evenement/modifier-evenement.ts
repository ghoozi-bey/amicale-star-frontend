import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementService } from '../../../../services/evenement';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modifier-evenement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modifier-evenement.html',
  styleUrls: ['./modifier-evenement.css']
})
export class ModifierEvenementComponent implements OnInit {

  evenement: any = null;
  id!: number;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EvenementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.eventService.getEvenementById(this.id).subscribe({
      next: (data: any) => { // ✅ corrigé
        this.evenement = data;
        this.loading = false;
      },
      error: (err: any) => { // ✅ corrigé
        console.error(err);
        this.loading = false;
      }
    });
  }

  updateEvent() {
    this.eventService.updateEvenement(this.id, this.evenement).subscribe({
      next: () => {
        alert("✅ Événement modifié avec succès");
        this.router.navigate(['/mes-evenements-amicale']);
      },
      error: (err: any) => { // ✅ corrigé
        console.error(err);
        alert("❌ Erreur lors de la modification");
      }
    });
  }
}