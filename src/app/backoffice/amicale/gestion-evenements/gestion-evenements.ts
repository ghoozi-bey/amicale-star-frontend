import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ IMPORTANT pour *ngIf
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EvenementService } from '../../../services/evenement';

@Component({
  selector: 'app-gestion-evenements',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ AJOUT ICI
  templateUrl: './gestion-evenements.html',
  styleUrls: ['./gestion-evenements.css']
})
export class GestionEvenementsComponent {

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

  constructor(
    private eventService: EvenementService,
    private router: Router
  ) {}

  // récupération du fichier
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createEvent() {

    const formData = new FormData();

    formData.append('typeEvenement', this.event.typeEvenement);
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
        console.log("Evénement créé :", res);
        alert("Evénement ajouté avec succès");
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error("Erreur création événement :", err);
        alert("Erreur lors de la création");
      }
    });

  }

}