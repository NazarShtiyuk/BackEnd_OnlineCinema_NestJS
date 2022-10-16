import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ActorService } from './actor.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { ActorDto } from './actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('bySlug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.actorService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm: string) {
    return this.actorService.getAll(searchTerm);
  }

  @Get(':_id')
  @Auth('admin')
  async get(@Param('_id', IdValidationPipe) _id: string) {
    return this.actorService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Auth('admin')
  @HttpCode(200)
  @Post()
  async create() {
    return this.actorService.create();
  }

  @UsePipes(new ValidationPipe())
  @Auth('admin')
  @HttpCode(200)
  @Put(':_id')
  async update(
    @Param('_id', IdValidationPipe) _id: string,
    @Body() dto: ActorDto,
  ) {
    return this.actorService.update(_id, dto);
  }

  @HttpCode(200)
  @Auth('admin')
  @Delete(':_id')
  async delete(@Param('_id', IdValidationPipe) _id: string) {
    return this.actorService.delete(_id);
  }
}
