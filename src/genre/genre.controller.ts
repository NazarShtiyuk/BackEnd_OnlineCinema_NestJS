import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param, Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { GenreService } from './genre.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { CreateGenreDto } from './createGenre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genresService: GenreService) {}

  @Get('bySlug/:slug')
  async getGenreBySlug(@Param('slug') slug: string) {
    return this.genresService.bySlug(slug);
  }

  @Get('collections')
  async getCollections() {
    return this.genresService.getCollections();
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.genresService.getAll(searchTerm);
  }

  @Get(':_id')
  @Auth('admin')
  async getGenre(@Param('_id', IdValidationPipe) _id: string) {
    return this.genresService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  @Put(':_id')
  async update(
    @Param('_id', IdValidationPipe) _id: string,
    @Body() dto: CreateGenreDto,
  ) {
    return this.genresService.update(_id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  @Post()
  async create() {
    return this.genresService.create();
  }

  @HttpCode(200)
  @Auth('admin')
  @Delete(':_id')
  async delete(@Param('_id') _id: string) {
    return this.genresService.delete(_id);
  }
}
