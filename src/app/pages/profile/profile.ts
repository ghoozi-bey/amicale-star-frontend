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
  loading = false;

  userPhoto: string | null = null;
  selectedFile: File | null = null;
  preview: string | null = null;

  // 🔥 FIX SUPPRESSION
  removePhotoFlag = false;

  showCurrent = false;
  showNew = false;

  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
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

    this.loadingService.show();

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

          this.userPhoto = data?.photoUrl || null;
          this.authService.setUserPhoto(this.userPhoto);

          this.preview = null;
          this.removePhotoFlag = false; // 🔥 RESET

          this.loadingService.hide();
          this.cdr.detectChanges();
        },

        error: () => {
          this.loadingService.hide();
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
        return;
      }
    } else {
      this.selectedFile = file;
    }

    // 🔥 si nouvelle image → annule suppression
    this.removePhotoFlag = false;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
      this.cdr.detectChanges();
    };

    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
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

    // 🔥 PRIORITÉ SUPPRESSION
    if (this.removePhotoFlag) {
      formData.append('removePhoto', this.removePhotoFlag ? 'true' : 'false');
    }

    // 🔥 upload image
    else if (this.selectedFile) {
      formData.append('photoProfil', this.selectedFile);
    }

    this.loadingService.show();

    this.http.put('http://localhost:8080/api/user/profile', formData, {
      observe: 'response'
    })
    .subscribe({

      next: (res) => {

        this.loadingService.hide();

        if (res.status === 200) {

          this.successMessage = "Profil modifié avec succès ✅";

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);

          this.form.patchValue({
            currentPassword: '',
            newPassword: ''
          });

          this.selectedFile = null;
          this.removePhotoFlag = false;

          this.authService.updateUser({
            nom: this.form.value.nom,
            prenom: this.form.value.prenom
          });

          this.loadProfile();

          window.dispatchEvent(new Event('profileUpdated'));
        }
      },

      error: (err) => {

        this.loadingService.hide();

        if (err.status === 200) {

          this.authService.updateUser({
            nom: this.form.value.nom,
            prenom: this.form.value.prenom
          });

          this.loadProfile();
          return;
        }

        console.log("REAL ERROR:", err);
        alert("Erreur serveur réelle");
      },

      complete: () => {
        this.loadingService.hide();
      }

    });
  }

  removePhoto(event: Event) {
    event.stopPropagation();

    this.preview = null;
    this.userPhoto = null;
    this.selectedFile = null;

    // 🔥 TRIGGER BACKEND DELETE
    this.removePhotoFlag = true;
  }

  hasRealPhoto(): boolean {
    return !!this.userPhoto && this.userPhoto !== 'assets/default-pfp.jpg';
  }
}