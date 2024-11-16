import { TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { WebsocketService } from '../services/websocket.service';
import { of } from 'rxjs';
import { ChatMessage } from '../interface/chatMessage.interface';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let websocketService: WebsocketService;
  let mockMessage: ChatMessage;

  beforeEach(() => {
    mockMessage = { content: 'Hello', sender: 'Client', role: 'Client', timestamp: '2024-11-16' };

    global.prompt = jest.fn().mockImplementation(() => 'Test value');

    TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      providers: [
        {
          provide: WebsocketService,
          useValue: {
            disconnect: jest.fn(),
            getMessages: jest.fn().mockReturnValue(of(mockMessage)),
            connect: jest.fn().mockReturnValue(of(mockMessage)),
            sendMessage: jest.fn().mockReturnValue(of(mockMessage)),
          }
        }
      ]
    });

    component = TestBed.createComponent(ChatComponent).componentInstance;
    websocketService = TestBed.inject(WebsocketService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should push a message to the messages array when a new message is received', () => {
    component.ngOnInit();
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].content).toBe('Hello');
  });

  it('should send a message correctly', () => {
    component.role = 'Client';
    component.sender = 'TestSender';
    component.message = 'Test message';
    component.sendMessage();

    expect(websocketService.sendMessage).toHaveBeenCalledWith({
      role: 'Client',
      sender: 'TestSender',
      content: 'Test message',
      timestamp: ''
    });
  });
});
