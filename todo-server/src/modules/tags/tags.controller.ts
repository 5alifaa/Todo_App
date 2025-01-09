import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto, @User() user: { userId: number }) {
    return this.tagsService.create(createTagDto, user.userId);
  }

  @Get()
  findAll(@User() user: { userId: number }) {
    return this.tagsService.findAll(user.userId);
  }

  @Get(':id')
  findTasksByTag(@Param('id') id: string, @User() user: { userId: number }) {
    return this.tagsService.findTasksByTag(+id, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: { userId: number }) {
    return this.tagsService.remove(+id, user.userId);
  }
}
