import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

// Create this DTO first (or use the existing one)
export class CreateMessageDto {
  content: string;
  chatRoomId: number;
  userId: number;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Allow frontend connections
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  // Handle when a client sends a message
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('Received message:', data);
      
      // Save message to database
      const message = await this.chatService.createMessage(data);
      
      // Broadcast to ALL connected clients
      this.server.emit('receiveMessage', message);
      
      console.log('Message saved and broadcasted:', message);
      return { success: true, message };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle when a client joins a chat room
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Client joining room:', data.chatRoomId);
    
    // Join specific room for targeted messaging
    client.join(`room_${data.chatRoomId}`);
    
    // Get previous messages for this room
    const messages = await this.chatService.getMessages(data.chatRoomId);
    
    // Send chat history to this client only
    client.emit('roomMessages', messages);
    
    console.log('Sent room history:', messages.length, 'messages');
  }

  // Handle when a client leaves a chat room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Client leaving room:', data.chatRoomId);
    client.leave(`room_${data.chatRoomId}`);
  }

  // Optional: Handle client connection
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  // Optional: Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}