import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ChatbotComponent } from './chatbot/chatbot'; 
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [
    CommonModule,
    RouterOutlet,
    ChatbotComponent // 🔥 AJOUT ICI
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  showChatbot = true;

  protected readonly title = signal('amicale-frontend');

 constructor(
  public loadingService: LoadingService,
  private router: Router
) {
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {

      const url = event.urlAfterRedirects; // 🔥 IMPORTANT

      // 🔥 plus robuste
      this.showChatbot = !url.includes('/login');

    });
}
}