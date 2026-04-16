import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evenement-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evenement-details.html',
  styleUrls: ['./evenement-details.css']
})
export class EvenementDetailsComponent implements OnInit {

  event: any = null;
  private apiUrl = "http://localhost:8080/api/evenements";

  showImage = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef // 🔥 IMPORTANT
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadEvent(id);
    } else {
      console.error("❌ ID manquant dans l'URL");
    }
  }

  // 🔥 LOAD EVENT (FIX FINAL)
  loadEvent(id: string): void {
    this.http.get(`${this.apiUrl}/${id}`).subscribe({
      next: (data: any) => {
        this.event = data;
        console.log("✅ EVENT LOADED:", data);

        this.cd.detectChanges(); // 🔥 FIX UI
      },
      error: (err) => {
        console.error("❌ ERROR EVENT:", err);
      }
    });
  }

  getImage(): string {
    return this.event?.photoUrl || '';
  }

  inscrire(): void {
    if (this.event?.id) {
      this.router.navigate(['/inscription', this.event.id]);
    }
  }

  isValid(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  openImage(): void {
    this.showImage = true;
  }

  closeImage(): void {
    this.showImage = false;
  }
}