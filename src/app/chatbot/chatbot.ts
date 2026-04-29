import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent {

  // ✅ PAS besoin de @Inject ici
  constructor(private chatService: ChatService) {}

  isOpen = false;
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  userInput: string = '';

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // message utilisateur
    this.messages.push({ text: this.userInput, sender: 'user' });

    // appel backend
    this.chatService.sendMessage(this.userInput).subscribe({
      next: (res: string) => {
        this.messages.push({ text: res, sender: 'bot' });
      },
      error: () => {
        this.messages.push({
          text: "Erreur serveur ❌",
          sender: 'bot'
        });
      }
    });

    this.userInput = '';
  }
}