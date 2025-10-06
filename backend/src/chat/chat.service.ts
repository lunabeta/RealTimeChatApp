import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: { content: string; chatRoomId: number; userId: number }) {
    return this.prisma.message.create({ data });
  }

  async getMessages(chatRoomId: number) {
    return this.prisma.message.findMany({
      where: { chatRoomId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
