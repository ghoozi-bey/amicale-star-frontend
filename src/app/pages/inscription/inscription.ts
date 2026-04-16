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
  styleUrls: ['./inscription.css'],
  templateUrl: './inscription.html'
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
    matricule: '',
    cin: ''
  };

  // FAMILLE
  hasWife = false;
  hasChildren = false;

  wife: any = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    cin: '',
    telephone: '',
    file: null
  };

  nbEnfants = 1;
  children: any[] = [];

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
        this.user = data;
        this.cdr.detectChanges();
      }
    });

    this.updateChildren();
  }

  updateChildren() {
    this.children = [];
    for (let i = 0; i < this.nbEnfants; i++) {
      this.children.push({
        nom: '',
        prenom: '',
        dateNaissance: '',
        file: null
      });
    }
  }

  onFileChange(event: any, type: string, index?: number) {
    const file = event.target.files[0];

    if (type === 'wife') this.wife.file = file;
    if (type === 'child' && index !== undefined) {
      this.children[index].file = file;
    }
  }

  isVoyageType(): boolean {
    return true; // adapte plus tard
  }

  inscrire(): void {

  const data = {
    matricule: this.user.matricule,
    evenementId: this.eventId,
    modePaiement: this.modePaiement,

    conjoint: this.hasWife ? {
      nom: this.wife.nom,
      prenom: this.wife.prenom,
      dateNaissance: this.wife.dateNaissance,
      cin: this.wife.cin,
      telephone: this.wife.telephone
    } : null,

    enfants: this.hasChildren ? this.children.map(c => ({
      nom: c.nom,
      prenom: c.prenom,
      dateNaissance: c.dateNaissance
    })) : []
  };

  this.eventService.createInscription(data).subscribe({
    next: () => alert("Inscription envoyée ✅"),
    error: (err) => {
      console.error(err);
      alert("Erreur ❌");
    }
  });
}
  onWifeChange() {
  if (!this.hasWife) {
    this.hasChildren = false;
    this.children = [];
  }
}
}