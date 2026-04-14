import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evenement-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evenement-details.html',
  styleUrls: ['./evenement-details.css']
})
export class EvenementDetailsComponent {

  event: any;
  private apiUrl = "http://localhost:8080/api/evenements";

  constructor(private router: Router) {

    const nav = this.router.getCurrentNavigation();

    if (nav?.extras?.state?.['event']) {
      this.event = nav.extras.state['event'];
    } else {
      // 🔥 FALLBACK (IMPORTANT)
      this.event = history.state.event;
    }

    console.log("EVENT:", this.event); // 🔍 DEBUG
  }

  getImage() {
    return `${this.apiUrl}/photo/${this.event?.id}`;
  }

  inscrire() {
    this.router.navigate(['/inscription', this.event.id]);
  }
  isValid(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}
showImage = false;

openImage() {
  this.showImage = true;
}

closeImage() {
  this.showImage = false;
}
}