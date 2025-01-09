import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findTasksByTag: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = { name: 'Test Tag' };
      const user = { userId: 1 };
      const result = {
        id: 1,
        ...createTagDto,
        user_id: user.userId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Mocking the create method of the TagsService
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createTagDto, user)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createTagDto, user.userId);
    });
  });

  describe('findAll', () => {
    it('should return all tags for a user', async () => {
      const user = { userId: 1 };
      const tags = [
        {
          id: 1,
          name: 'Test Tag',
          user_id: user.userId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      const result = {
        results: 1,
        data: tags,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(user)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(user.userId);
    });
  });

  describe('findTasksByTag', () => {
    it('should return all tasks for a tag', async () => {
      const user = { userId: 1 };
      const tagId = '1';
      const result = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          is_completed: false,
          due_date: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          user_id: user.userId,
        },
      ];

      jest.spyOn(service, 'findTasksByTag').mockResolvedValue(result);

      expect(await controller.findTasksByTag(tagId, user)).toEqual(result);
      expect(service.findTasksByTag).toHaveBeenCalledWith(+tagId, user.userId);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const user = { userId: 1 };
      const tagId = '1';
      const result = {
        id: 1,
        name: 'Test Tag',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user.userId,
      };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(tagId, user)).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(+tagId, user.userId);
    });
  });
});
