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
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class InscriptionComponent implements OnInit {

  eventId!: number;

  maxFileSize = 5 * 1024 * 1024;

  adherentFileError = false;
  wifeFileError = false;
  childrenFileErrors: boolean[] = [];

  adherentFile: File | null = null;

  nbPlaces: number = 0;
  isLoading = false;

  avance: number = 0;
  modePaiementAvance: string = '';
  nombreMois: number = 1;
  dateDebutPaiement: string = '';
  modePaiementEcheance: string = '';

  isPassportRequired: boolean = false;

  showModal = false;
  modalMessage = '';
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
    this.loadEventDetails();
  }

  // =========================
  // LOAD EVENT
  // =========================
  loadEventDetails() {

    this.eventService.getEvenementById(this.eventId).subscribe({

      next: (event: any) => {

        this.event = event;

        const typeId = event.typeEvenementId;
        const isInternational = event.isInternational === true;

        const isVoyage = typeId === 2;
        const isOmraHaj = typeId === 1;

        this.isPassportRequired =
          isOmraHaj || (isVoyage && isInternational);

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  // =========================
  // LOAD NB PLACES
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

  // =========================
  // UPDATE CHILDREN
  // =========================
  updateChildren() {

    //  Sauvegarder anciens enfants
    const oldChildren = [...this.children];

    this.children = [];

    for (let i = 0; i < this.nbEnfants; i++) {

      this.children.push({

        nom: oldChildren[i]?.nom || '',
        prenom: oldChildren[i]?.prenom || '',
        dateNaissance: oldChildren[i]?.dateNaissance || '',

        
        file: oldChildren[i]?.file || null
      });
    }
  }

  // =========================
  // ADHERENT FILE
  // =========================
  onAdherentFileChange(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    if (file.size > this.maxFileSize) {

      this.adherentFileError = true;
      return;
    }

    this.adherentFileError = false;

    this.adherentFile = file;
  }

  // =========================
  // WIFE / CHILD FILE
  // =========================
  onFileChange(event: any, type: string, index?: number) {

    const file = event.target.files[0];

    if (!file) return;

    // =========================
    // WIFE
    // =========================
    if (type === 'wife') {

      if (file.size > this.maxFileSize) {

        this.wifeFileError = true;
        return;
      }

      this.wifeFileError = false;

      this.wife.file = file;
    }

    // =========================
    // CHILD
    // =========================
    if (type === 'child') {

      if (file.size > this.maxFileSize) {

        if (index !== undefined) {
          this.childrenFileErrors[index] = true;
        }

        return;
      }

      if (index !== undefined) {
        this.childrenFileErrors[index] = false;
      }

      if (index !== undefined) {
        this.children[index].file = file;
      }
    }
  }

  // =========================
  // INSCRIPTION
  // =========================
  inscrire(): void {

    console.log("ADHERENT FILE =", this.adherentFile);
    console.log("WIFE FILE =", this.wife.file);
    console.log("CHILDREN =", this.children);

    if (this.isLoading) return;

    // =========================
    // EVENT COMPLET
    // =========================
    if (this.nbPlaces === 0) {

      this.modalMessage = "Événement complet ❌";
      this.isSuccess = false;
      this.showModal = true;
      return;
    }

    // =========================
    // PASSEPORT ADHERENT
    // =========================
    if (this.isPassportRequired && !this.adherentFile) {

      this.modalMessage = "Passeport adhérent obligatoire ❌";
      this.isSuccess = false;
      this.showModal = true;
      return;
    }

    // =========================
    // PASSEPORT CONJOINT
    // =========================
    if (this.hasWife && !this.wife.file) {

      this.modalMessage = "Passeport conjoint obligatoire ❌";
      this.isSuccess = false;
      this.showModal = true;
      return;
    }

    // =========================
    // PASSEPORT ENFANTS
    // =========================
    if (this.hasChildren) {

      for (let i = 0; i < this.children.length; i++) {

        if (!this.children[i].file) {

          this.modalMessage =
            `Passeport enfant ${i + 1} obligatoire ❌`;

          this.isSuccess = false;
          this.showModal = true;
          return;
        }
      }
    }

    // =========================
    // MODE PAIEMENT
    // =========================
    if (!this.modePaiementEcheance) {

      this.modalMessage =
        "Choisir mode paiement échéancier ❌";

      this.isSuccess = false;
      this.showModal = true;
      return;
    }

    // =========================
    // MODE AVANCE
    // =========================
    if (this.avance > 0 && !this.modePaiementAvance) {

      this.modalMessage =
        "Choisir mode paiement avance ❌";

      this.isSuccess = false;
      this.showModal = true;
      return;
    }

    this.isLoading = true;

    const formData = new FormData();

    const data = {

      matricule: this.user.matricule,

      evenementId: this.eventId,

      modePaiementEcheance:
        this.modePaiementEcheance,

      prixTotal: this.calculatePrix(),

      avance: this.avance,

      modePaiementAvance:
        this.modePaiementAvance,

      nombreMois: this.nombreMois,

      dateDebutPaiement:
        this.dateDebutPaiement,

      conjoint: this.hasWife ? {

        nom: this.wife.nom,
        prenom: this.wife.prenom,
        dateNaissance: this.wife.dateNaissance,
        cin: this.wife.cin,
        telephone: this.wife.telephone

      } : null,

      enfants: this.hasChildren ?

        this.children.map(c => ({

          nom: c.nom,
          prenom: c.prenom,
          dateNaissance: c.dateNaissance

        }))

        : []
    };

    formData.append(

      "data",

      new Blob(
        [JSON.stringify(data)],
        { type: "application/json" }
      )
    );

    // =========================
    // FILE ADHERENT
    // =========================
    if (this.adherentFile) {

      formData.append(
        "adherentFile",
        this.adherentFile
      );
    }

    // =========================
    // FILE CONJOINT
    // =========================
    if (this.hasWife && this.wife.file) {

      formData.append(
        "conjointFile",
        this.wife.file
      );
    }

    // =========================
    // FILE ENFANTS
    // =========================
    if (this.hasChildren) {

      this.children.forEach(c => {

        if (c.file) {

          formData.append(
            "enfantsFiles",
            c.file
          );
        }
      });
    }

    // =========================
    // CREATE INSCRIPTION
    // =========================
    this.eventService
  .createInscription(formData)
  .subscribe({

    next: () => {

      this.zone.run(() => {

        this.modalMessage =
          "Inscription réussie ✅";

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

        let message =
          "Erreur lors de l'inscription ❌";

        if (typeof err?.error === 'string') {
          message = err.error;
        }

        else if (err?.error?.message) {
          message = err.error.message;
        }

        else if (err?.message) {
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

  // =========================
  // CALCUL PRIX
  // =========================
  calculatePrix(): number {

    let total = this.event?.prix || 0;

    if (this.hasWife) {

      total +=
        this.event?.prixConjoint || 0;
    }

    if (this.hasChildren) {

      total +=
        this.nbEnfants *
        (this.event?.prixEnfant || 0);
    }

    return total;
  }
}