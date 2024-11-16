import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Observable, Subject} from 'rxjs';
import {ChatMessage} from '../interface/chatMessage.interface';

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
      onConnect: () => {
        this.stompClient?.subscribe('/topic/chat', (message) => {
          this.messageSubject.next(message.body);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
      },
    });
    this.stompClient.activate();
  }

  sendMessage(message: ChatMessage): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(message),
      });
    } else {
      console.error("Websocket not connected");
    }
  }

  getMessages(): Observable<ChatMessage> {
    return new Observable<ChatMessage>((observer) => {
      this.messageSubject.subscribe((message: string) => {
        try {
          const parsedMessage = JSON.parse(message) as ChatMessage;
          observer.next(parsedMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
