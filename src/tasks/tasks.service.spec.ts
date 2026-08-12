import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskPriority, TaskStatus } from './enums';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTask: Task = {
    id: 1,
    title: 'Test task',
    description: 'Test description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2026-08-20'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new task', async () => {
      const createDto = {
        title: 'Test task',
        priority: TaskPriority.MEDIUM,
        dueDate: '2026-08-20',
      };

      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createDto as any);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks with filters applied', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTask], 1]);

      const result = await service.findAll({
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        sortOrder: 'ASC',
        page: 1,
        limit: 10,
      });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
        order: { dueDate: 'ASC' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: [mockTask],
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it('should return all tasks when no filters are provided', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockTask], 1]);

      const result = await service.findAll({ page: 1, limit: 10 } as any);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { dueDate: 'ASC' },
        skip: 0,
        take: 10,
      });
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a task if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue({ ...mockTask, title: 'Updated' });

      const result = await service.update(1, { title: 'Updated' } as any);

      expect(result.title).toBe('Updated');
    });

    it('should throw NotFoundException when updating a non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete the task', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing a non-existent task', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
