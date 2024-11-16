import { TestBed } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../interface/chatMessage.interface';

jest.mock('sockjs-client');
jest.mock('@stomp/stompjs');

describe('WebsocketService', () => {
  let service: WebsocketService;
  let stompClientMock: jest.Mocked<Client>;

  beforeEach(() => {
    stompClientMock = {
      activate: jest.fn(),
      deactivate: jest.fn(),
      publish: jest.fn(),
      subscribe: jest.fn().mockImplementation((_destination, callback) => {
        callback({ body: '{"content":"Test message"}' });
      }),
      connected: true,
    } as unknown as jest.Mocked<Client>;

    (SockJS as unknown as jest.Mock).mockImplementation(() => ({} as WebSocket));

    TestBed.configureTestingModule({
      providers: [WebsocketService],
    });
    service = TestBed.inject(WebsocketService);

    service['stompClient'] = stompClientMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should connect to the WebSocket server', () => {
    service.connect();

    expect(SockJS).toHaveBeenCalledWith('http://localhost:8080/chat');
  });

  it('should send a message when connected', () => {
    const mockMessage: ChatMessage = {
      content: 'Hello, world!',
      sender: 'John',
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    service.sendMessage(mockMessage);

    expect(stompClientMock.publish).toHaveBeenCalledWith({
      destination: '/app/chat',
      body: JSON.stringify(mockMessage),
    });
  });

  it('should get messages from the WebSocket server', (done) => {
    service.getMessages().subscribe((message: ChatMessage) => {
      expect(message.content).toBe('Test message');
      done();
    });

    service['messageSubject'].next('{"content":"Test message"}');
  });

  it('should disconnect from the WebSocket server', () => {
    service.disconnect();

    expect(stompClientMock.deactivate).toHaveBeenCalled();
  });
});
