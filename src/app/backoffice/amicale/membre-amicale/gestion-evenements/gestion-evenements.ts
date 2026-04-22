import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EvenementService } from '../../../../services/evenement';

@Component({
  selector: 'app-gestion-evenements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-evenements.html',
  styleUrls: ['./gestion-evenements.css']
})
export class GestionEvenementsComponent implements OnInit {

  eventForm!: FormGroup;
  selectedFile!: File;
  typeEvenementId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EvenementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();

    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.typeEvenementId = payload.type_evenement_id;
    }

    this.applyDynamicValidation();
  }

  initForm() {
  this.eventForm = this.fb.group({
    titre: ['', Validators.required],
    lieu: [''],
    destination: [''],
    agence: [''],
    societe: [''],
    dateDebut: [''],
    dateFin: [''],
    nbPlaces: [null],
    prix: [null],
    description: ['', Validators.required],
    isInternational: [false],

    // 🔥 AJOUT OBLIGATOIRE
    remiseEnfant12Active: [false],
    remiseEnfant12Pourcentage: [0],

    remiseEnfant18Active: [false],
    remiseEnfant18Pourcentage: [0],

    remiseCoupleActive: [false],
    remiseCouplePourcentage: [0],
  });
}

  get f() {
    return this.eventForm.controls;
  }

  applyDynamicValidation() {

    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.clearValidators();
    });

    this.f['titre'].setValidators([Validators.required]);
    this.f['description'].setValidators([Validators.required]);

    if (this.typeEvenementId === 2) {
      this.f['destination'].setValidators([Validators.required]);
    }

    if (this.typeEvenementId === 1) {
      this.f['agence'].setValidators([Validators.required]);
    }

    if (this.typeEvenementId === 3) {
      this.f['societe'].setValidators([Validators.required]);
    }

    this.eventForm.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      console.log("FILE OK:", file);
    }
  }

  // 🔥 RESET REMISES SI NON ACTIVES
  cleanRemises(data: any) {
    if (!data.remiseEnfant12Active) data.remiseEnfant12Pourcentage = 0;
    if (!data.remiseEnfant18Active) data.remiseEnfant18Pourcentage = 0;
    if (!data.remiseCoupleActive) data.remiseCouplePourcentage = 0;
  }

  createEvent() {

  if (this.eventForm.invalid) {
    this.eventForm.markAllAsTouched();
    alert("Formulaire invalide ❌");
    return;
  }

  if (!this.typeEvenementId) {
    alert("Type événement invalide ❌");
    return;
  }

  const data = this.eventForm.value;

  // 🔥 CLEAN REMISES
  this.cleanRemises(data);

  const formData = new FormData();

  formData.append('typeEvenement', String(this.typeEvenementId));
  formData.append('titre', data.titre);
  formData.append('description', data.description);
  formData.append('lieu', data.lieu || '');

  if (data.dateDebut) formData.append('dateDebut', data.dateDebut);
  if (data.dateFin) formData.append('dateFin', data.dateFin);

  if (data.nbPlaces) formData.append('nbPlaces', String(data.nbPlaces));
  if (data.prix) formData.append('prix', String(data.prix));

  // =========================
  // 🔥 LOGIQUE MÉTIER
  // =========================

  if (this.typeEvenementId === 3) {
    formData.append('societe', data.societe || '');
    formData.append('isInternational', 'false');
  }

  if (this.typeEvenementId === 1) {
    formData.append('agence', data.agence || '');
    formData.append('isInternational', 'true');
  }

  if (this.typeEvenementId === 2) {
    formData.append('destination', data.destination || '');
    formData.append('isInternational', String(data.isInternational));
  }

  // =========================
  // 🔥 CORRECTION REMISES (IMPORTANT)
  // =========================

  formData.append(
    'remiseEnfant12Active',
    data.remiseEnfant12Active ? 'true' : 'false'
  );

  formData.append(
    'remiseEnfant12Pourcentage',
    String(data.remiseEnfant12Pourcentage || 0)
  );

  formData.append(
    'remiseEnfant18Active',
    data.remiseEnfant18Active ? 'true' : 'false'
  );

  formData.append(
    'remiseEnfant18Pourcentage',
    String(data.remiseEnfant18Pourcentage || 0)
  );

  formData.append(
    'remiseCoupleActive',
    data.remiseCoupleActive ? 'true' : 'false'
  );

  formData.append(
    'remiseCouplePourcentage',
    String(data.remiseCouplePourcentage || 0)
  );
  

  // =========================

  if (this.selectedFile) {
    formData.append('photo', this.selectedFile);
  }

  this.eventService.createEvenement(formData).subscribe({
    next: () => {
      alert("✅ Evénement créé");
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error("❌ ERROR:", err);
      alert(err.error || "Erreur création ❌");
    }
    
  });
  console.log("DATA =", data);
}
}