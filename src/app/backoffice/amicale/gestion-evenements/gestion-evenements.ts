import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EvenementService } from '../../../services/evenement';

@Component({
  selector: 'app-gestion-evenements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-evenements.html',
  styleUrls: ['./gestion-evenements.css']
})
export class GestionEvenementsComponent implements OnInit {

  event: any = {
    societe: "",
    agence: "",
    destination: "",
    titre: "",
    lieu: "",
    dateDebut: "",
    dateFin: "",
    nbPlaces: 0,
    prix: 0,
    description: ""
  };

  selectedFile!: File;

  typeEvenementId: number | null = null;

  constructor(
    private eventService: EvenementService,
    private router: Router
  ) {}

  ngOnInit() {

    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("JWT PAYLOAD =", payload);

      // 🔥 IMPORTANT : correspond au backend
      this.typeEvenementId = payload.type_evenement_id;
    }

    console.log("TYPE EVENT ID =", this.typeEvenementId);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createEvent() {

    if (!this.typeEvenementId) {
      alert("Type d'événement introuvable !");
      return;
    }

    const formData = new FormData();

    // 🔥 FIX PRINCIPAL (nom attendu par backend)
    formData.append('typeEvenement', this.typeEvenementId.toString());

    formData.append('titre', this.event.titre || '');
    formData.append('lieu', this.event.lieu || '');
    formData.append('description', this.event.description || '');

    // sauf CONVENTION (id = 3)
    if (this.typeEvenementId !== 3) {

      if (this.event.dateDebut) {
        formData.append('dateDebut', this.event.dateDebut);
      }

      if (this.event.dateFin) {
        formData.append('dateFin', this.event.dateFin);
      }

      formData.append('prix', (this.event.prix || 0).toString());
    }

    // VOYAGE (2) + OMRA & HAJ (1)
    if (this.typeEvenementId === 1 || this.typeEvenementId === 2) {
      formData.append('nbPlaces', (this.event.nbPlaces || 0).toString());
    }

    // CONVENTION (3)
    if (this.typeEvenementId === 3) {
      formData.append('societe', this.event.societe || '');
    }

    // OMRA & HAJ (1)
    if (this.typeEvenementId === 1) {
      formData.append('agence', this.event.agence || '');
    }

    // VOYAGE (2)
    if (this.typeEvenementId === 2) {
      formData.append('destination', this.event.destination || '');
    }

    // image
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    console.log("FORM DATA READY 🚀");

    this.eventService.createEvenement(formData).subscribe({
      next: () => {
        alert("Evénement ajouté avec succès");
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("ERREUR BACK :", err);
        alert("Erreur lors de la création");
      }
    });
  }
}