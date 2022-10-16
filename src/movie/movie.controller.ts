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
import { MovieService } from './movie.service';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { Types } from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorator';
import { MovieDto } from './movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('bySlug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('byActor/:actorId')
  async byActorId(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
    return this.movieService.byActor(actorId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('byGenres/:genres')
  async byGenres(@Body('genresIds') genresIds: Types.ObjectId[]) {
    return this.movieService.byGenres(genresIds);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm: string) {
    return this.movieService.getAll(searchTerm);
  }

  @Get('mostPopular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @HttpCode(200)
  @Put('updateCountOpened')
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Auth('admin')
  @Get(':_id')
  async get(@Param('_id') _id: string) {
    return this.movieService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  @Post()
  async create() {
    return this.movieService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth('admin')
  @Put(':_id')
  async update(@Param('_id') _id: string, @Body() dto: MovieDto) {
    return this.movieService.update(_id, dto);
  }

  @HttpCode(200)
  @Auth('admin')
  @Delete(':_id')
  async delete(@Param('_id') _id: string) {
    return this.movieService.delete(_id);
  }
}
