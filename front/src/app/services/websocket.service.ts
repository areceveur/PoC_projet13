import { Injectable } from '@angular/core';
import {Client, Message} from '@stomp/stompjs';
import {BehaviorSubject, Observable} from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:3000/chat',
      webSocketFactory: () => new SockJS('http://localhost:3000/chat'),
      reconnectDelay: 5000
    });
  }

  connect(): void {
    this.client.onConnect = () => {
      this.client.subscribe('/topic/message', (message: Message) => {
        this.messageSubject.next(message.body);
      });
    };
    this.client.activate();
  }

  sendMessage(message: any): void {
    this.client.publish({
      destination: 'app/message',
      body: message
    });
  }

  getMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.client.active) {
      this.client.deactivate();
    }
  }
}
