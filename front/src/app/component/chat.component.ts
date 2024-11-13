import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {WebsocketService} from '../services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = '';
  messages: string[] = [];

  constructor(private webSocketService: WebsocketService, private messageSubscription: Subscription) {}

  ngOnInit(): void {
    this.webSocketService.connect();
    this.messageSubscription = this.webSocketService.getMessage().subscribe(msg => {
      this.messages.push(msg);
    });
  }

  sendMessage(): void {
    if (this.message) {
      this.webSocketService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    if (this.message) {
      this.messageSubscription.unsubscribe();
    }
  }
}
