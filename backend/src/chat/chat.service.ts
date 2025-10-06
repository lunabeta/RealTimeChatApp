import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateMessageDto {
  content: string;
  chatRoomId: number;
  userId: number;
}

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Real-time chat methods
  async createMessage(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        userId: createMessageDto.userId,
        chatRoomId: createMessageDto.chatRoomId,
      },
      include: {
        user: true,
        chatRoom: true,
      },
    });
  }

  async getMessages(chatRoomId: number) {
    return this.prisma.message.findMany({
      where: { chatRoomId },
      include: {
        user: true,
        chatRoom: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getChatRooms() {
    return this.prisma.chatRoom.findMany({
      include: {
        messages: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async createChatRoom(name: string) {
    return this.prisma.chatRoom.create({
      data: { name },
    });
  }

  // CRUD methods for the generated controller
  async create(createChatDto: any) {
    return this.createChatRoom(createChatDto.name || 'default-room');
  }

  async findAll() {
    return this.getChatRooms();
  }

  async findOne(id: number) {
    return this.prisma.chatRoom.findUnique({
      where: { id },
      include: { messages: { include: { user: true } } },
    });
  }

  async update(id: number, updateChatDto: any) {
    return this.prisma.chatRoom.update({
      where: { id },
      data: updateChatDto,
    });
  }

  async remove(id: number) {
    return this.prisma.chatRoom.delete({
      where: { id },
    });
  }
}