import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Finish NestJS Project 1',
    description: 'Task title',
  })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @ApiPropertyOptional({ example: 'Complete CRUD, validation, and tests' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ example: '2026-08-20' })
  @IsDateString()
  dueDate: string;
}
