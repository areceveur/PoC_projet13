import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {WebsocketService} from '../services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  message = '';
  messages: string[] = [];
  messageSubscription!: Subscription;

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private webSocketService: WebsocketService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.webSocketService.connect();
    this.messageSubscription = this.webSocketService.getMessages().subscribe(msg => {
      console.log("Message reçu :", msg);
      this.messages.push(msg);
      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      console.log("Message envoyé depuis le composant:", this.message);
      this.webSocketService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.scrollToBottom();
      } else {
        console.log('messageContainer is undefined');
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
