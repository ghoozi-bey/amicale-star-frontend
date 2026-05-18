import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

import heic2any from 'heic2any';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})

export class ProfileComponent implements OnInit {

  form!: FormGroup;

  loading = false;

  userPhoto: string | null = null;
  selectedFile: File | null = null;
  preview: string | null = null;

  avatarVersion: number = Date.now();

  removePhotoFlag = false;

  showCurrent = false;
  showNew = false;

  validationErrors: any = {};

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({

      nom: [
        '',
        [
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
        ]
      ],

      prenom: [
        '',
        [
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
        ]
      ],

      email: [
        '',
        [
          Validators.email
        ]
      ],

      telephone: [
        '',
        [
          Validators.pattern(/^\d{8}$/)
        ]
      ],

      currentPassword: [''],

      newPassword: [
        '',
        [
          Validators.minLength(6)
        ]
      ]
    });

    this.loadProfile();
  }

  loadProfile() {

    queueMicrotask(() => this.loadingService.show());

    this.http.get<any>('http://localhost:8080/api/user/profile')
      .subscribe({

        next: (data) => {

          this.form.patchValue({
            nom: data?.nom ?? '',
            prenom: data?.prenom ?? '',
            email: data?.email ?? '',
            telephone: data?.telephone ?? ''
          });

          this.authService.setUser({
            nom: data?.nom ?? '',
            prenom: data?.prenom ?? '',
            email: data?.email ?? ''
          });

          if (data?.hasPhoto && data?.photoUrl) {

            this.userPhoto =
              data.photoUrl + '?t=' + Date.now();

          } else {

            this.userPhoto = null;
          }

          this.authService.setUserPhoto(this.userPhoto);

          this.preview = null;
          this.removePhotoFlag = false;

          queueMicrotask(() => this.loadingService.hide());
        },

        error: () => {
          queueMicrotask(() => this.loadingService.hide());
        }
      });
  }

  toggleCurrent() {
    this.showCurrent = !this.showCurrent;
  }

  toggleNew() {
    this.showNew = !this.showNew;
  }

  async onFileSelected(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) return;

    if (file.size > 2 * 1024 * 1024) return;

    if (
      file.type === 'image/heic' ||
      file.name.toLowerCase().endsWith('.heic')
    ) {

      try {

        const blob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });

        this.selectedFile = new File(
          [blob as Blob],
          'converted.jpg',
          {
            type: 'image/jpeg'
          }
        );

      } catch {
        return;
      }

    } else {

      this.selectedFile = file;
    }

    this.removePhotoFlag = false;

    const reader = new FileReader();

    reader.onload = () => {
      this.preview = reader.result as string;
    };

    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }

    event.target.value = '';
  }

  update() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();
      return;
    }

    this.validationErrors = {};
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();

    // ================= INFOS =================

    if (this.form.value.nom?.trim()) {

      formData.append(
        'nom',
        this.form.value.nom.trim()
      );
    }

    if (this.form.value.prenom?.trim()) {

      formData.append(
        'prenom',
        this.form.value.prenom.trim()
      );
    }

    if (this.form.value.email?.trim()) {

      formData.append(
        'email',
        this.form.value.email.trim()
      );
    }

    if (this.form.value.telephone?.trim()) {

      formData.append(
        'telephone',
        this.form.value.telephone.trim()
      );
    }

    // ================= PASSWORDS =================

    if (this.form.value.currentPassword?.trim()) {

      formData.append(
        'currentPassword',
        this.form.value.currentPassword.trim()
      );
    }

    if (this.form.value.newPassword?.trim()) {

      formData.append(
        'newPassword',
        this.form.value.newPassword.trim()
      );
    }

    // ================= DELETE PHOTO =================

    if (this.removePhotoFlag) {

      formData.append('removePhoto', 'true');
    }

    // ================= UPLOAD PHOTO =================

    else if (this.selectedFile) {

      formData.append(
        'photoProfil',
        this.selectedFile
      );
    }

    queueMicrotask(() => this.loadingService.show());

    this.http.put(
      'http://localhost:8080/api/user/profile',
      formData,
      {
        observe: 'response'
      }
    )
    .subscribe({

      next: (res: any) => {

        queueMicrotask(() => this.loadingService.hide());

        this.successMessage =
          res.body?.message ||
          'Profil modifié avec succès ✅';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

        // ================= RESET PASSWORDS =================

        this.form.patchValue({
          currentPassword: '',
          newPassword: ''
        });

        // ================= RESET TEMP VALUES =================

        this.selectedFile = null;
        this.removePhotoFlag = false;

        // ================= UPDATE USER =================

        this.authService.updateUser({
          nom: this.form.value.nom,
          prenom: this.form.value.prenom
        });

        // ================= RELOAD =================

        this.loadProfile();

        // ================= NOTIFY =================

        window.dispatchEvent(
          new Event('profileUpdated')
        );
      },

      error: (err) => {

        queueMicrotask(() => this.loadingService.hide());

        console.log('REAL ERROR:', err);

        // ================= BACKEND VALIDATION =================

        if (
          err.status === 400 &&
          typeof err.error === 'object'
        ) {

          this.validationErrors = err.error;

          return;
        }

        // ================= GENERIC ERROR =================

        this.errorMessage =

          err.error?.message ||
          err.error?.error ||
          'Erreur serveur';

        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }

    });
  }

  removePhoto(event: Event) {

    event.stopPropagation();

    this.preview = null;
    this.userPhoto = null;
    this.selectedFile = null;

    this.removePhotoFlag = true;
  }

  hasRealPhoto(): boolean {
    return !!this.userPhoto;
  }

  getAvatarUrl(): string {

    if (this.preview) {
      return this.preview;
    }

    if (this.userPhoto) {
      return this.userPhoto + '?v=' + this.avatarVersion;
    }

    return 'assets/default-pfp.jpg';
  }

  openFilePicker(event: Event, input: HTMLInputElement) {

    event.stopPropagation();

    input.click();
  }

  openImagePreview() {

    if (!this.preview && !this.userPhoto) {
      return;
    }

    window.open(
      this.preview || this.userPhoto || '',
      '_blank'
    );
  }

}