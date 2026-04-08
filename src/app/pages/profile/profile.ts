import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  error = false;

  selectedFile: File | null = null;
  preview: string | null = null;

  showCurrent = false;
  showNew = false;

  passwordError = false;
  passwordMessage = '';

  photoError = false;
  photoMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
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
  this.loading = true;

  this.http.get<any>('http://localhost:8080/api/user/profile')
    .subscribe(data => {

      this.form.patchValue({
        nom: data?.nom ?? '',
        prenom: data?.prenom ?? '',
        email: data?.email ?? '',
        telephone: data?.telephone ?? ''
      });

      // 🔥 FIX IMAGE + ANTI CACHE
      if (data?.photoProfil) {
        this.preview = 'http://localhost:8080/uploads/' 
  + encodeURIComponent(data.photoProfil)
  + '?t=' + new Date().getTime();
      } else {
        this.preview = null;
      }

      this.loading = false;
      this.cdr.detectChanges();
    });
}

  toggleCurrent() {
    this.showCurrent = !this.showCurrent;
  }

  toggleNew() {
    this.showNew = !this.showNew;
  }

  // 🔥 PHOTO HANDLER
  onFileSelected(event: any) {

    this.photoError = false;
    this.photoMessage = '';

    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.photoError = true;
      this.photoMessage = "Veuillez choisir une image valide";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.photoError = true;
      this.photoMessage = "Image trop grande (max 2MB)";
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  // 🔥 UPDATE
  update() {

    const { currentPassword, newPassword } = this.form.value;

    this.passwordError = false;
    this.passwordMessage = '';

    if (currentPassword || newPassword) {

      if (!currentPassword || !newPassword) {
        this.passwordError = true;
        this.passwordMessage = "Remplissez les deux champs";
        return;
      }

      if (newPassword.length < 6) {
        this.passwordError = true;
        this.passwordMessage = "Minimum 6 caractères";
        return;
      }
    }

    const formData = new FormData();

    formData.append('nom', this.form.value.nom);
    formData.append('prenom', this.form.value.prenom);
    formData.append('email', this.form.value.email);
    formData.append('telephone', this.form.value.telephone);

    if (currentPassword) {
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.http.put('http://localhost:8080/api/user/profile', formData)
      .subscribe({
        next: () => {

          alert("Profil modifié avec succès");

          // 🔥 RESET PASSWORD
          this.form.patchValue({
            currentPassword: '',
            newPassword: ''
          });

          // 🔥 RESET FILE
          this.selectedFile = null;

          // 🔥 RELOAD PROFIL (IMPORTANT)
          this.loadProfile();
        },

        error: (err) => {

          const message = err?.error;

          if (message && message.includes("Mot de passe actuel incorrect")) {
            this.passwordError = true;
            this.passwordMessage = "Mot de passe actuel incorrect ❌";
            this.cdr.detectChanges();
          } else {
            alert("Erreur serveur");
          }
        }
      });
  }
}