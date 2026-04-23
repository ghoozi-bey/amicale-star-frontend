import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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

  nbPlaces: number = 0;
  isLoading = false;
  avance: number = 0;
modePaiementAvance: string = '';
nombreMois: number = 1;
dateDebutPaiement: string = '';
  

  // 🔥 PASSEPORT LOGIC
  isPassportRequired: boolean = false;

  modePaiement: string = 'VIREMENT';

  // ✅ MODAL
  showModal = false;
  modalMessage = "";
  isSuccess = true;
  event: any = {};

  user: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    matricule: '',
    cin: ''
  };

  adherentFile: File | null = null;

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
    private cdr: ChangeDetectorRef,
    private zone: NgZone
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
    this.loadNbPlaces();
    this.loadEventDetails(); // 🔥 IMPORTANT
  }

  // =========================
  // 🔥 LOAD EVENT (LOGIQUE FIX)
  // =========================
  loadEventDetails() {
  this.eventService.getEvenementById(this.eventId).subscribe({
    next: (event: any) => {

      this.event = event; // 🔥 LA LIGNE QUI MANQUE

      console.log("EVENT LOADED =", event); // 🔥 DEBUG

      const typeId = event.typeEvenementId;
      const isInternational = event.isInternational === true;

      const isVoyage = typeId === 2;
      const isOmraHaj = typeId === 1;

      this.isPassportRequired =
        isOmraHaj || (isVoyage && isInternational);

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Erreur chargement event", err);
    }
  });
}

  // =========================
  // LOAD PLACES
  // =========================
  loadNbPlaces() {
    this.eventService.getNbPlaces(this.eventId).subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.nbPlaces = data;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.nbPlaces = 0;
      }
    });
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

  onAdherentFileChange(event: any) {
    const file = event.target.files[0];
    if (file) this.adherentFile = file;
  }

  onFileChange(event: any, type: string, index?: number) {
    const file = event.target.files[0];

    if (type === 'wife') this.wife.file = file;
    if (type === 'child' && index !== undefined) this.children[index].file = file;
  }

  // =========================
  // INSCRIPTION
  // =========================
  inscrire(): void {

  if (this.isLoading) return;

  if (this.nbPlaces === 0) {
    this.modalMessage = "Événement complet ❌";
    this.isSuccess = false;
    this.showModal = true;
    return;
  }

  if (this.isPassportRequired && !this.adherentFile) {
    this.modalMessage = "Passeport obligatoire ❌";
    this.isSuccess = false;
    this.showModal = true;
    return;
  }

  this.isLoading = true;

  const formData = new FormData();

  const data = {

    matricule: this.user.matricule,
    evenementId: this.eventId,
    modePaiement: this.modePaiement,

    // 🔥 PRIX
    prixTotal: this.calculatePrix(),

    // 🔥 AJOUT IMPORTANT (PAIEMENT)
    avance: this.avance,
    modePaiementAvance: this.modePaiementAvance,
    nombreMois: this.nombreMois,
    dateDebutPaiement: this.dateDebutPaiement,

    // 👩 conjoint
    conjoint: this.hasWife ? {
      nom: this.wife.nom,
      prenom: this.wife.prenom,
      dateNaissance: this.wife.dateNaissance,
      cin: this.wife.cin,
      telephone: this.wife.telephone
    } : null,

    // 👶 enfants
    enfants: this.hasChildren ? this.children.map(c => ({
      nom: c.nom,
      prenom: c.prenom,
      dateNaissance: c.dateNaissance
    })) : []
  };

  console.log("🔥 DATA INSCRIPTION =", data);

  formData.append("data", new Blob(
    [JSON.stringify(data)],
    { type: "application/json" }
  ));

  if (this.adherentFile) {
    formData.append("adherentFile", this.adherentFile);
  }

  if (this.hasWife && this.wife.file) {
    formData.append("conjointFile", this.wife.file);
  }

  if (this.hasChildren) {
    this.children.forEach(c => {
      if (c.file) formData.append("enfantsFiles", c.file);
    });
  }

  this.eventService.createInscription(formData).subscribe({
    next: () => {
      this.zone.run(() => {
        this.modalMessage = "Inscription réussie ✅";
        this.isSuccess = true;
        this.showModal = true;

        this.loadNbPlaces();

        this.isLoading = false;
        this.cdr.detectChanges();
      });
    },
    error: (err) => {
      this.zone.run(() => {
        console.error(err);

        let message = "Erreur lors de l'inscription ❌";

        if (typeof err?.error === 'string') {
          message = err.error;
        } else if (err?.error?.message) {
          message = err.error.message;
        } else if (err?.message) {
          message = err.message;
        }

        this.modalMessage = message;
        this.isSuccess = false;
        this.showModal = true;

        this.isLoading = false;
        this.cdr.detectChanges();
      });
    }
  });
}

  onWifeChange() {
    if (!this.hasWife) {
      this.hasChildren = false;
      this.children = [];
    }
  }
  getAge(date: string): number {
  if (!date) return 0;

  const birth = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
  getRemiseMessage(child: any): string {

  if (!child.dateNaissance || !this.event) return '';

  const age = this.getAge(child.dateNaissance);

  if (this.event.remiseEnfant12Active && age <= 12) {
    return `✔ Remise ${this.event.remiseEnfant12Pourcentage}% (moins de 12 ans)`;
  }

  if (this.event.remiseEnfant18Active && age <= 18) {
    return `✔ Remise ${this.event.remiseEnfant18Pourcentage}% (moins de 18 ans)`;
  }

  return '';
}
getRemiseCouple(): string {

  if (!this.event || !this.hasWife) return '';

  if (this.event.remiseCoupleActive) {
    return `✔ Remise couple ${this.event.remiseCouplePourcentage}% appliquée`;
  }

  return '';
}calculatePrix(): number {

  if (!this.event) return 0;

  let prix = Number(this.event?.prix) || 0;

  // 👥 nombre de personnes
  let nbPersonnes = 1;

  if (this.hasWife) nbPersonnes += 1;
  if (this.hasChildren) nbPersonnes += this.children.length;

  let total = prix * nbPersonnes;

  // =====================
  // 👶 REMISE ENFANTS
  // =====================
  this.children.forEach(child => {

    if (!child.dateNaissance) return;

    const age = this.getAge(child.dateNaissance);

    if (this.event.remiseEnfant12Active && age <= 12) {
      total -= prix * (this.event.remiseEnfant12Pourcentage / 100);
    }

    else if (this.event.remiseEnfant18Active && age <= 18) {
      total -= prix * (this.event.remiseEnfant18Pourcentage / 100);
    }

  });

  // =====================
  // 👩 REMISE COUPLE
  // =====================
  if (this.hasWife && this.event.remiseCoupleActive) {
    total -= prix * (this.event.remiseCouplePourcentage / 100);
  }

  return total < 0 ? 0 : total;
}
  
}