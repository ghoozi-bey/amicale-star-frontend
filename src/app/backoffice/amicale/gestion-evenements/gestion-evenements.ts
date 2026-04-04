import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EvenementService } from '../../../services/evenement';

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
      description: ['', Validators.required]
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
      this.f['dateDebut'].setValidators([Validators.required]);
      this.f['dateFin'].setValidators([Validators.required]);
      this.f['nbPlaces'].setValidators([Validators.required, Validators.min(1)]);
      this.f['prix'].setValidators([Validators.required, Validators.min(0)]);
    }

    if (this.typeEvenementId === 1) {
      this.f['agence'].setValidators([Validators.required]);
      this.f['dateDebut'].setValidators([Validators.required]);
      this.f['dateFin'].setValidators([Validators.required]);
      this.f['nbPlaces'].setValidators([Validators.required, Validators.min(1)]);
      this.f['prix'].setValidators([Validators.required, Validators.min(0)]);
    }

    if (this.typeEvenementId === 3) {
      this.f['societe'].setValidators([Validators.required]);
    }

    this.eventForm.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createEvent() {

    this.applyDynamicValidation();

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      alert("Formulaire invalide ❌");
      return;
    }

    if (!this.typeEvenementId) {
      alert("Type événement introuvable");
      return;
    }

    const data = this.eventForm.value;
    const formData = new FormData();

    formData.append('typeEvenement', this.typeEvenementId.toString());
    formData.append('titre', data.titre);
    formData.append('description', data.description);
    formData.append('lieu', data.lieu || '');

    if (this.typeEvenementId !== 3) {
      if (data.dateDebut) formData.append('dateDebut', data.dateDebut);
      if (data.dateFin) formData.append('dateFin', data.dateFin);
      formData.append('prix', (data.prix || 0).toString());
    }

    if (this.typeEvenementId === 1 || this.typeEvenementId === 2) {
      formData.append('nbPlaces', (data.nbPlaces || 0).toString());
    }

    if (this.typeEvenementId === 3) {
      formData.append('societe', data.societe);
    }

    if (this.typeEvenementId === 1) {
      formData.append('agence', data.agence);
    }

    if (this.typeEvenementId === 2) {
      formData.append('destination', data.destination);
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.eventService.createEvenement(formData).subscribe({
      next: () => {
        alert("Evénement ajouté ✔️");
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert("Erreur ❌");
      }
    });
  }
}