import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
  loading = true;

  userPhoto: string | null = null;
  selectedFile: File | null = null;
  preview: string | null = null;

  showCurrent = false;
  showNew = false;

  passwordError = false;
  passwordMessage = '';

  photoError = false;
  photoMessage = '';

  photoDeleted: boolean = false;

  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private loadingService: LoadingService
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

  this.http.get<any>('http://localhost:8080/api/user/profile')
    .subscribe({
      next: (data) => {

        this.form.patchValue({
          nom: data?.nom ?? '',
          prenom: data?.prenom ?? '',
          email: data?.email ?? '',
          telephone: data?.telephone ?? ''
        });

        if (data?.photoUrl) {
          this.userPhoto = data.photoUrl;
          this.authService.setUserPhoto(data.photoUrl);
        } else {
          this.userPhoto = null;
          this.authService.setUserPhoto(null);
        }

        this.preview = null;

        this.loading = false;
      },

      error: () => {
        this.loading = false;
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

    this.photoError = false;
    this.photoMessage = '';

    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.photoError = true;
      this.photoMessage = "Image invalide";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.photoError = true;
      this.photoMessage = "Max 2MB";
      return;
    }

    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        const blob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });

        this.selectedFile = new File([blob as Blob], 'converted.jpg', {
          type: 'image/jpeg'
        });

      } catch {
        this.photoError = true;
        this.photoMessage = "Erreur HEIC";
        return;
      }

    } else {
      this.selectedFile = file;
    }

    if (!this.selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.preview = reader.result as string;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(this.selectedFile);
  }

  update() {

  if (!this.form.valid) return;

  const formData = new FormData();

  formData.append('nom', this.form.value.nom || '');
  formData.append('prenom', this.form.value.prenom || '');
  formData.append('email', this.form.value.email || '');
  formData.append('telephone', this.form.value.telephone || '');

  if (this.form.value.currentPassword) {
    formData.append('currentPassword', this.form.value.currentPassword);
  }

  if (this.form.value.newPassword) {
    formData.append('newPassword', this.form.value.newPassword);
  }

  if (this.selectedFile) {
    formData.append('photo', this.selectedFile);
  }

  // 🔥 SHOW LOADER
  this.loadingService.show();

  // 🔥 IMPORTANT → laisser Angular afficher loader
  setTimeout(() => {

    this.http.put('http://localhost:8080/api/user/profile', formData)
      .subscribe({

        next: () => {

          // 🔥 laisser le spinner visible un peu
          setTimeout(() => {
            this.loadingService.hide();
          }, 500);

          // ✅ MESSAGE PRO
          this.successMessage = "Profil modifié avec succès ✅";

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);

          // 🔄 reset form partiel
          this.form.patchValue({
            currentPassword: '',
            newPassword: ''
          });

          this.selectedFile = null;

          // 🔄 reload data
          setTimeout(() => {
            this.loadProfile();
          }, 300);

          // 🔄 update sidebar
          window.dispatchEvent(new Event('profileUpdated'));
        },

        error: (err) => {

          this.loadingService.hide();

          console.log("ERROR:", err);

          // 🔥 éviter faux erreur si backend OK
          if (err.status !== 200) {
            alert("Erreur serveur");
          }
        }

      });

  }, 50);
}

  removePhoto(event: Event) {
    event.stopPropagation();

    this.preview = null;
    this.userPhoto = null;
    this.photoDeleted = true;
  }

  hasRealPhoto(): boolean {
    return !!this.userPhoto && this.userPhoto !== 'assets/default-pfp.jpg';
  }
}