import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvenementService } from '../../services/evenement';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class InscriptionComponent implements OnInit {

  eventId!: number;

  nbPersonnes: number = 1;
  modePaiement: string = '';

  user: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    matricule: ''
  };

  constructor(
    private route: ActivatedRoute,
    private eventService: EvenementService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getProfile().subscribe({
      next: (data: any) => {

        console.log("DATA BACK:", data);

        // 🔥 mapping SIMPLE (pas compliqué)
        this.user.nom = data.nom;
        this.user.prenom = data.prenom;
        this.user.email = data.email;
        this.user.telephone = data.telephone;
        this.user.matricule = data.matricule || '';
        this.user.cin = data.cin;

        // 🔥 FORCER REFRESH UI
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur récupération user:", err);
      }
    });
  }

  inscrire(): void {

    const data = {
      eventId: this.eventId,
      nbPersonnes: this.nbPersonnes,
      modePaiement: this.modePaiement
    };

    this.eventService.inscrire(this.eventId, data).subscribe({
      next: () => {
        alert("Inscription envoyée ✅");
      },
      error: (err) => {
        console.error(err);
        alert("Erreur inscription ❌");
      }
    });
  }
}