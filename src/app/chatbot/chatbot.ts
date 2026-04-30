import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent {

  constructor(
    private chatService: ChatService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  isOpen = false;

  messages: {
    text?: string;
    sender: 'user' | 'bot';
    type: 'text' | 'events';
    events?: any[];
  }[] = [];

  userInput: string = '';
  isTyping = false;

  @ViewChild('chatBody') chatBody!: ElementRef;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // 🔥 USER MESSAGE (immutable update)
    this.messages = [
      ...this.messages,
      {
        text: this.userInput,
        sender: 'user',
        type: 'text'
      }
    ];

    this.isTyping = true;

    const msg = this.userInput;
    this.userInput = '';

    this.chatService.sendMessage(msg).subscribe({

      next: (res: any) => {

        this.isTyping = false;

        // 🔥 EVENTS
        if (res.type === 'events') {
          this.messages = [
            ...this.messages,
            {
              sender: 'bot',
              type: 'events',
              events: res.events
            }
          ];
        }

        // 🔥 TEXT
        else if (res.type === 'text') {
          this.messages = [
            ...this.messages,
            {
              text: res.message,
              sender: 'bot',
              type: 'text'
            }
          ];
        }

        // ✅ FORCE REFRESH UI
        this.cd.detectChanges();

        this.scrollToBottom();
      },

      error: () => {

        this.isTyping = false;

        this.messages = [
          ...this.messages,
          {
            text: "Erreur serveur ❌",
            sender: 'bot',
            type: 'text'
          }
        ];

        this.cd.detectChanges();
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop =
          this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  goToEvent(id: number) {
    this.router.navigate(['/evenement', id]);
  }
}