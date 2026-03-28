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

  event = {
    typeEvenement: "",
    societe: "",
    titre: "",
    lieu: "",
    dateDebut: "",
    dateFin: "",
    nbPlaces: 0,
    prix: 0,
    description: ""
  };

  selectedFile!: File;

  user: any = {};
  userTypeEvent: string = "";

  constructor(
    private eventService: EvenementService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🔥 récupérer user connecté
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    // 🔥 récupérer type événement du backend
    this.userTypeEvent = this.user?.typeEvenement?.nom;

    // 🔥 assigner automatiquement
    this.event.typeEvenement = this.userTypeEvent;

    console.log("Type utilisateur :", this.userTypeEvent);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createEvent() {

    const formData = new FormData();

    // 🔥 important : envoyer ID ou NOM selon backend
    formData.append('typeEvenement', this.userTypeEvent);

    formData.append('societe', this.event.societe);
    formData.append('titre', this.event.titre);
    formData.append('lieu', this.event.lieu);
    formData.append('description', this.event.description);
    formData.append('dateDebut', this.event.dateDebut);
    formData.append('dateFin', this.event.dateFin);
    formData.append('nbPlaces', this.event.nbPlaces.toString());
    formData.append('prix', this.event.prix.toString());

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.eventService.createEvenement(formData).subscribe({
      next: (res: any) => {
        alert("Evénement ajouté avec succès");
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error(err);
        alert("Erreur lors de la création");
      }
    });
  }
}