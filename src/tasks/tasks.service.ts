import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTaskDto, userId: string): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { userId },
    });
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException(
        'Tarefa não encontrada ou não pertence ao usuário.',
      );
    }

    return task;
  }

  async searchByTitle(
    title: string,
    userId: string,
  ): Promise<Task[] | Task | null> {
    if (!title) {
      return null;
    }
    return await this.prisma.task.findMany({
      where: {
        userId,
        title: {
          contains: title,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });
  }

  async findByCompleted(completed: boolean, userId: string): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { completed, userId },
    });
  }

  async update(id: string, data: UpdateTaskDto, userId: string): Promise<Task> {
    await this.findById(id, userId);
    if (!data.title && !data.description && data.completed === undefined) {
      throw new NotFoundException('Nenhum campo para atualizar foi fornecido.');
    }
    return await this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<Task> {
    return await this.prisma.task.delete({
      where: { id, userId },
    });
  }
}
