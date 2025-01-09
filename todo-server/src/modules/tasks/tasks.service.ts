import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { TaskSerializer } from './serializers/task.serialize';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  taskInclude = {
    task_tags: {
      select: {
        tag_id: true,
        task_id: true,
        tags: {
          select: {
            name: true,
          },
        },
      },
    },
  };

  async create(createTaskDto: CreateTaskDto, user_id: number) {
    const { tags, ...data } = createTaskDto;

    if (tags && tags.length === 0) {
      const existingTags = await this.prisma.tags.findMany({
        where: {
          id: {
            in: tags.map((tag: string) => parseInt(tag, 10)),
          },
        },
      });

      if (existingTags.length !== tags.length) {
        throw new NotFoundException('One or more tags do not exist');
      }
    }

    const task = await this.prisma.tasks.create({
      data: {
        ...data,
        user_id,
        ...(tags &&
          tags.length > 0 && {
            task_tags: {
              createMany: {
                data: tags.map((tag: string) => ({
                  tag_id: parseInt(tag, 10),
                })),
              },
            },
          }),
      },
    });
    return task;
  }

  async findAll(user_id: number) {
    const tasks = await this.prisma.tasks.findMany({
      where: { user_id },
      include: this.taskInclude,
    });

    return {
      results: tasks.length,
      data: TaskSerializer.serializeArray(tasks),
    };
  }

  async findOne(id: number, user_id: number) {
    const task = await this.prisma.tasks.findUnique({
      where: { id, user_id },
      include: {
        task_tags: {
          select: {
            tag_id: true,
            task_id: true,
            tags: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException();
    }
    return TaskSerializer.serialize(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user_id: number) {
    if (Object.keys(updateTaskDto).length === 0) {
      throw new BadRequestException('No data provided to update');
    }
    const { tags, ...data } = updateTaskDto;
    const task = await this.prisma.tasks.findFirst({
      where: { id, user_id },
    });

    if (!task) {
      throw new NotFoundException();
    }

    if (tags) {
      await this.prisma.task_tags.deleteMany({
        where: { task_id: id },
      });
      await this.prisma.task_tags.createMany({
        data: tags.map((tag: string) => ({
          task_id: id,
          tag_id: parseInt(tag, 10),
        })),
      });
    }
    const updatedTask = await this.prisma.tasks.update({
      where: { id },
      data: {
        ...data,
      },
      include: {
        task_tags: {
          include: {
            tags: true,
          },
        },
      },
    });

    return TaskSerializer.serialize(updatedTask);
  }

  async remove(id: number, user_id: number) {
    const task = await this.prisma.tasks.findFirst({
      where: { id, user_id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Delete all task tags associated with the task
    await this.prisma.task_tags.deleteMany({
      where: { task_id: id },
    });

    return await this.prisma.tasks.deleteMany({
      where: { id, user_id },
    });
  }
}
