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
      eventId: this.eventId,
      nbPersonnes: this.nbPersonnes,
      modePaiement: this.modePaiement,
      famille: {
        wife: this.hasWife ? this.wife : null,
        children: this.hasChildren ? this.children : []
      }
    };

    this.eventService.inscrire(this.eventId, data).subscribe({
      next: () => alert("Inscription envoyée ✅"),
      error: () => alert("Erreur ❌")
    });
  }
  onWifeChange() {
  if (!this.hasWife) {
    this.hasChildren = false;
    this.children = [];
  }
}
}