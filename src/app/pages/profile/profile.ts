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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log("PROFILE INIT");

    this.form = this.fb.group({
      email: [''],
      telephone: [''],
      currentPassword: [''],
      newPassword: ['']
    });

    this.loadProfile();
  }

  // 🔥 LOAD PROFILE
  loadProfile() {
    this.loading = true;
    this.error = false;

    this.http.get<any>('http://localhost:8080/api/user/profile')
      .subscribe(
        (data) => {

          console.log("DATA RECEIVED:", data);

          this.form.patchValue({
            email: data?.email ?? '',
            telephone: data?.telephone ?? ''
          });

          if (data?.photoProfil) {
            this.preview = 'http://localhost:8080/uploads/' + data.photoProfil;
          }

          this.loading = false;
          this.cdr.detectChanges(); // 🔥 FIX AFFICHAGE
        },
        (err) => {
          console.error("ERROR:", err);
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
        }
      );
  }

  // 👁️ toggle password
  toggleCurrent() {
    this.showCurrent = !this.showCurrent;
  }

  toggleNew() {
    this.showNew = !this.showNew;
  }

  // 📸 IMAGE
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // 🚀 UPDATE
  update() {

    const { currentPassword, newPassword } = this.form.value;

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        alert("Veuillez remplir les deux champs de mot de passe");
        return;
      }

      if (newPassword.length < 6) {
        alert("Mot de passe min 6 caractères");
        return;
      }
    }

    const formData = new FormData();

    formData.append('email', this.form.value.email);
    formData.append('telephone', this.form.value.telephone);

    if (currentPassword) {
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.http.put('http://localhost:8080/api/user/update', formData)
      .subscribe({
        next: () => {
          alert("Profil modifié avec succès");

          this.form.patchValue({
            currentPassword: '',
            newPassword: ''
          });
        },
        error: () => {
          alert("Erreur ou mot de passe incorrect");
        }
      });
  }
}