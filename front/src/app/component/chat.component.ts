import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {WebsocketService} from '../services/websocket.service';
import {ChatMessage} from '../interface/chatMessage.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  message = '';
  messages: ChatMessage[] = [];
  role: string = '';
  sender: string = '';
  messageSubscription!: Subscription;
  timestamp: string = '';

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.role = prompt("Entrez votre rôle: Client/Service client: ") || "Client";
    this.sender = prompt("Entrez votre nom: ") || "Anonyme";

    this.webSocketService.connect();
    this.messageSubscription = this.webSocketService.getMessages().subscribe((msg: ChatMessage) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.webSocketService.sendMessage({
        role: this.role,
        sender: this.sender,
        content: this.message,
        timestamp: this.timestamp,
      });
      this.message = '';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.scrollToBottom();
      }
    }, 0);
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Scroll error', err);
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    if (this.message) {
      this.messageSubscription.unsubscribe();
    }
  }
}
