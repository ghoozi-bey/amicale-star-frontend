import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementService } from '../../../../services/evenement';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modifier-evenement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modifier-evenement.html',
  styleUrls: [
    './modifier-evenement.css',
    '../gestion-evenements/gestion-evenements.css'
  ]
})
export class ModifierEvenementComponent implements OnInit {

  evenement: any = null;
  imageUrl: string = ''; // 🔥 IMPORTANT
  id!: number;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EvenementService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.eventService.getEvenementById(this.id).subscribe({
      next: (data: any) => {

        console.log("DATA:", data);

        this.evenement = data;

        // 🔥 FIX IMAGE (ANTI CACHE)
        if (this.evenement?.photoUrl) {
          this.imageUrl = this.evenement.photoUrl + '?t=' + new Date().getTime();
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("ERREUR:", err);
        this.loadFallback();
      }
    });

    // fallback sécurité
    setTimeout(() => {
      if (this.loading) {
        this.loadFallback();
      }
    }, 3000);
  }

  loadFallback() {
    this.eventService.getAllEvenements().subscribe({
      next: (data: any[]) => {
        this.evenement = data.find(e => e.id == this.id);

        if (this.evenement?.photoUrl) {
          this.imageUrl = this.evenement.photoUrl + '?t=' + new Date().getTime();
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateEvent() {
    this.eventService.updateEvenement(this.id, this.evenement).subscribe({
      next: () => {
        alert("✅ Événement modifié");
        this.router.navigate(['/mes-evenements-amicale']);
      },
      error: (err: any) => {
        console.error(err);
        alert("❌ Erreur modification");
      }
    });
  }
  goBack() {
  this.location.back();
}
}