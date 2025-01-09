import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Creating a testing module containing the TagsService and PrismaService providers to test the TagsService
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: PrismaService,
          useValue: {
            // Mocking the methods of prisma service of each table (tags, task_tags)
            tags: {
              // Mocking the methods of tags table
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            task_tags: {
              // Mocking the methods of task_tags table
              findMany: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    // Getting the TagsService and PrismaService instance in the testing module
    service = module.get<TagsService>(TagsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Testing the create method of TagsService
  describe('create', () => {
    it('should create a new tag', async () => {
      // Mocking the tag object and userId
      const createTagDto = { name: 'tag #1' };
      const user_id = 1;
      (prisma.tags.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.tags.create as jest.Mock).mockResolvedValue({
        ...createTagDto,
        user_id,
      });

      const result = await service.create(createTagDto, user_id);
      // Expecting the result to be the created tag object
      expect(result).toEqual({ ...createTagDto, user_id });

      // Expecting the prisma.tags.findUnique method to be called with the tag name and userId
      expect(prisma.tags.findUnique).toHaveBeenCalledWith({
        where: { name_user_id: { name: createTagDto.name, user_id } },
      });

      // Expecting the prisma.tags.create method to be called with the tag name and userId to create a new tag
      expect(prisma.tags.create).toHaveBeenCalledWith({
        data: {
          ...createTagDto,
          user_id,
        },
      });
    });
    it('should throw a ConflictException if the tag already exists', async () => {
      const createTagDto = { name: 'Test Tag' };
      const user_id = 1;
      (prisma.tags.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        ...createTagDto,
        user_id,
      });

      // Expecting the create method to throw a ConflictException if the tag already exists
      await expect(service.create(createTagDto, user_id)).rejects.toThrow(
        ConflictException,
      );

      // Expecting the prisma.tags.findUnique method to be called with the tag name and userId
      expect(prisma.tags.findUnique).toHaveBeenCalledWith({
        where: { name_user_id: { name: createTagDto.name, user_id } },
      });
      // Expecting the prisma.tags.create method not to be called
      expect(prisma.tags.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tags for a user', async () => {
      const user_id = 1;
      const tags = [{ id: 1, name: 'Test Tag', user_id }];
      (prisma.tags.findMany as jest.Mock).mockResolvedValue(tags);

      const result = await service.findAll(user_id);

      // Expecting the result to be an object containing the number of tags and the tags array
      expect(result).toEqual({ results: tags.length, data: tags });
      expect(prisma.tags.findMany).toHaveBeenCalledWith({ where: { user_id } });
    });
  });

  describe('findTasksByTag', () => {
    it('🚧 Not Implemented - should return all tasks for a tag', async () => {
      expect(true).toBe(true);
    });

    it('should throw a NotFoundException if the tag does not exist', async () => {
      const user_id = 1;
      const tag_id = 1;
      (prisma.tags.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findTasksByTag(tag_id, user_id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.tags.findUnique).toHaveBeenCalledWith({
        where: { id: tag_id, user_id },
        include: { tasks: true },
      });
    });
  });

  describe('remove', () => {
    it('should remove a tag and associated task tags', async () => {
      const id = 1;
      const user_id = 1;
      (prisma.tags.findUnique as jest.Mock).mockResolvedValue({ id, user_id });
      (prisma.task_tags.deleteMany as jest.Mock).mockResolvedValue({
        count: 1,
      });
      (prisma.tags.delete as jest.Mock).mockResolvedValue({ id, user_id });

      const result = await service.remove(id, user_id);
      expect(result).toEqual({ id, user_id });
      expect(prisma.task_tags.deleteMany).toHaveBeenCalledWith({
        where: { tag_id: id },
      });
      expect(prisma.tags.delete).toHaveBeenCalledWith({
        where: { id, user_id },
      });
    });

    it('should throw a NotFoundException if the tag does not exist', async () => {
      const id = 1;
      const user_id = 1;
      (prisma.tags.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(id, user_id)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.tags.delete).not.toHaveBeenCalled();
    });
  });
});
