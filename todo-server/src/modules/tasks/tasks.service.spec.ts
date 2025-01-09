import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { TaskSerializer } from './serializers/task.serialize';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;
  let serialize: TaskSerializer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        TaskSerializer,
        {
          provide: PrismaService,
          useValue: {
            tasks: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            task_tags: {
              findMany: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
    serialize = module.get<TaskSerializer>(TaskSerializer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        tags: ['1', '2'],
      };
      const { tags, ...data } = createTaskDto;
      const user_id = 1;
      const task = {
        id: 1,
        ...createTaskDto,
        user_id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (prisma.tasks.create as jest.Mock).mockResolvedValue(task);

      const result = await service.create(createTaskDto, user_id);
      expect(result).toEqual(task);
      expect(prisma.tasks.create).toHaveBeenCalledWith({
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
    });
  });

  describe('findAll', () => {
    it('🚧 Not Implemented - should return all tasks for a user', async () => {
      expect(true).toBe(true);
    });
  });

  // describe('update', () => {
  //   it('should update a task', async () => {
  //     const id = 1;
  //     const user_id = 1;
  //     const updateTaskDto = {
  //       title: 'Updated Task',
  //       tags: ['1', '2'],
  //       is_completed: false,
  //     };
  //     const task = {
  //       id,
  //       title: 'Test Task',
  //       user_id,
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     };

  //     (prisma.tasks.findFirst as jest.Mock).mockResolvedValue(task);
  //     (prisma.tasks.update as jest.Mock).mockResolvedValue({
  //       ...task,
  //       ...updateTaskDto,
  //     });

  //     const result = await service.update(id, updateTaskDto, user_id);
  //     expect(result).toEqual({ ...task, ...updateTaskDto });
  //     expect(prisma.tasks.update).toHaveBeenCalledWith({
  //       where: { id },
  //       data: {
  //         ...updateTaskDto,
  //         task_tags: {
  //           createMany: {
  //             data: updateTaskDto.tags.map((tag) => ({
  //               task_id: id,
  //               tag_id: parseInt(tag, 10),
  //             })),
  //           },
  //         },
  //       },
  //       include: {
  //         task_tags: {
  //           include: {
  //             tags: true,
  //           },
  //         },
  //       },
  //     });
  //   });

  //   it('should throw a NotFoundException if the task does not exist', async () => {
  //     const id = 1;
  //     const user_id = 1;
  //     const updateTaskDto = { title: 'Updated Task', tags: ['1', '2'] };

  //     prisma.tasks.findFirst.mockResolvedValue(null);

  //     await expect(service.update(id, updateTaskDto, user_id)).rejects.toThrow(
  //       NotFoundException,
  //     );
  //     expect(prisma.tasks.findFirst).toHaveBeenCalledWith({
  //       where: { id, user_id },
  //     });
  //   });

  //   it('should throw a BadRequestException if no data is provided to update', async () => {
  //     const id = 1;
  //     const user_id = 1;
  //     const updateTaskDto = {};

  //     await expect(service.update(id, updateTaskDto, user_id)).rejects.toThrow(
  //       BadRequestException,
  //     );
  //   });
  // });

  describe('remove', () => {
    it('should remove a task', async () => {
      const id = 1;
      const user_id = 1;

      (prisma.task_tags.deleteMany as jest.Mock).mockResolvedValue({
        count: 1,
      });
      (prisma.tasks.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.tasks.findFirst as jest.Mock).mockResolvedValue({ id, user_id });

      const result = await service.remove(id, user_id);
      expect(result).toEqual({ count: 1 });
      expect(prisma.task_tags.deleteMany).toHaveBeenCalledWith({
        where: { task_id: id },
      });
      expect(prisma.tasks.deleteMany).toHaveBeenCalledWith({
        where: { id, user_id },
      });
    });

    it('should throw a NotFoundException if the task does not exist', async () => {
      const id = 1;
      const user_id = 1;

      (prisma.tasks.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(id, user_id)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.tasks.deleteMany).not.toHaveBeenCalled();
    });
  });
});
