import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private router: Router,
    private cdr: ChangeDetectorRef // 🔥 important
  ) {}

  ngOnInit(): void {

  this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.loading = true;

  this.eventService.getEvenementById(this.id).subscribe({
    next: (data: any) => {

      console.log("DATA:", data);

      this.evenement = data;
      this.loading = false;
    },
    error: (err: any) => {
      console.error("ERREUR:", err);
      this.loadFallback();
    }
  });

  // 🔥 sécurité anti blocage
  setTimeout(() => {
    if (this.loading) {
      console.log("⏳ fallback auto");
      this.loadFallback();
    }
  }, 3000);
}

  // 🔥 fallback si backend bug
  loadFallback() {
    this.eventService.getAllEvenements().subscribe({
      next: (data: any[]) => {
        this.evenement = data.find(e => e.id == this.id);
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 fix affichage
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
}