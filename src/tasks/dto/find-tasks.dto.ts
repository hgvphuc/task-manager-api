import { IsOptional, IsEnum, IsIn, IsInt, Min, Max } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindTasksDto {
  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be one of TODO, IN_PROGRESS, DONE',
  })
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, example: TaskPriority.HIGH })
  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'Priority must be one of LOW, MEDIUM, HIGH',
  })
  priority?: TaskPriority;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC', example: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'sortOrder must be ASC or DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional({ default: 1, example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
