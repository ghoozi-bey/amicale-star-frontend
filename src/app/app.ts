import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true, // 🔥 IMPORTANT
  imports: [CommonModule, RouterOutlet], // 🔥 FIX ngIf
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // 🔥 FIX
})
export class App {

  protected readonly title = signal('amicale-frontend');

  constructor(public loadingService: LoadingService) {}
}