import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

class CreateMessageDto {
  content: string;
  chatRoomId: number;
  userId: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  async onModuleInit() {
    console.log('🔄 Initializing Redis adapter for WebSocket scaling...');
    
    try {
      // ✅ CHANGED: Use port 6380 for your existing Redis
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6380';
      console.log(`🔗 Connecting to Redis at: ${redisUrl}`);
      
      const pubClient = createClient({ url: redisUrl });
      const subClient = pubClient.duplicate();
      
      await pubClient.connect();
      await subClient.connect();
      
      this.server.adapter(createAdapter(pubClient, subClient));
      
      console.log('✅ Redis adapter connected - WebSockets are now scalable!');
    } catch (error) {
      console.error('❌ Redis connection failed:', error.message);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('📨 Received message via Redis-backed WebSocket:', data);
      
      const message = await this.chatService.createMessage(data);
      
      this.server.emit('receiveMessage', message);
      
      console.log('✅ Message broadcasted to all servers via Redis');
      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room_${data.chatRoomId}`);
    const messages = await this.chatService.getMessages(data.chatRoomId);
    client.emit('roomMessages', messages);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`room_${data.chatRoomId}`);
  }
}