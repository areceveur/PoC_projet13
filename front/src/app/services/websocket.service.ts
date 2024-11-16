import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client | null = null;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() { }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/chat');
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {},
      debug: (str) => {
        console.log(str);
      },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);

        this.stompClient?.subscribe('/topic/chat', (message) => {
          console.log("Message reçu dans le service :", message.body);
          this.messageSubject.next(JSON.parse(message.body).content);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
      },
    });
    this.stompClient.activate();
  }

  sendMessage(message: string): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log("Envoi du message :", message);
      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify({ content: message, sender: 'expediteur' }),
      });
    } else {
      console.log("Le client WebSocket n'est pas connecté.");
    }
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log("Disconnected");
    }
  }
}
