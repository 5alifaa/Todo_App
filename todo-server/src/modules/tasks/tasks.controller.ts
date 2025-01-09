import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @User() user: { userId: number; email: string },
  ) {
    return this.tasksService.create(createTaskDto, user.userId);
  }

  @Get()
  findAll(@User() user: any) {
    return this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: any) {
    return this.tasksService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() user: any,
  ) {
    return this.tasksService.update(+id, updateTaskDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.tasksService.remove(+id, user.userId);
  }
}
