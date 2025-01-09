import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto, user_id: number) {
    const existingTag = await this.prisma.tags.findUnique({
      where: { name_user_id: { name: createTagDto.name, user_id } },
    });

    if (existingTag) {
      throw new ConflictException('Tag already exists for this user');
    }
    return this.prisma.tags.create({
      data: {
        ...createTagDto,
        user_id,
      },
    });
  }

  async findAll(user_id: number) {
    const tags = await this.prisma.tags.findMany({
      where: { user_id },
    });

    return {
      results: tags.length,
      data: tags,
    };
  }

  async findTasksByTag(id: number, user_id: number) {
    const tag = await this.prisma.tags.findUnique({
      where: { id, user_id },
      include: { tasks: true },
    });

    if (!tag) {
      throw new NotFoundException('Tag does not exist for this user');
    }

    const tasks = await this.prisma.task_tags.findMany({
      where: { tag_id: id },
      include: {
        tasks: true,
      },
    });

    return tasks.map((task) => task.tasks);
  }

  async remove(id: number, user_id: number) {
    const tag = await this.prisma.tags.findUnique({
      where: { id, user_id },
    });

    if (!tag) {
      throw new ConflictException('Tag does not exist for this user');
    }

    await this.prisma.task_tags.deleteMany({
      where: { tag_id: id },
    });

    return await this.prisma.tags.delete({
      where: { id, user_id },
    });
  }
}
