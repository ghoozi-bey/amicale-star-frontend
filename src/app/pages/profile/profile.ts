import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
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
      nom: [''],
      prenom: [''],
      email: [''],
      telephone: [''],
      currentPassword: [''],
      newPassword: ['']
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

    if (!this.form.valid) return;

    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();

    formData.append('nom', this.form.value.nom || '');
    formData.append('prenom', this.form.value.prenom || '');
    formData.append('email', this.form.value.email || '');
    formData.append('telephone', this.form.value.telephone || '');

    // passwords

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

    // delete photo

    if (this.removePhotoFlag) {

      formData.append('removePhoto', 'true');
    }

    // upload photo

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
        observe: 'response',
        responseType: 'text'
      }
    )
    .subscribe({

      next: (res) => {

        queueMicrotask(() => this.loadingService.hide());

        // success only if REAL 200

        if (res.status === 200) {

          this.successMessage =
            'Profil modifié avec succès ✅';

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);

          // clear password fields

          this.form.patchValue({
            currentPassword: '',
            newPassword: ''
          });

          // reset temp values

          this.selectedFile = null;
          this.removePhotoFlag = false;

          // update navbar/sidebar user

          this.authService.updateUser({
            nom: this.form.value.nom,
            prenom: this.form.value.prenom
          });

          // reload profile

          this.loadProfile();

          // notify app

          window.dispatchEvent(
            new Event('profileUpdated')
          );
        }
      },

      error: (err) => {

        queueMicrotask(() => this.loadingService.hide());

        console.log('REAL ERROR:', err);

        // backend message

        this.errorMessage =

          typeof err.error === 'string'

            ? err.error

            : err.error?.message ||

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
}