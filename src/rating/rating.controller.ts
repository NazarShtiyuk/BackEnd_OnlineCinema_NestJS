import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../user/decorators/user.decorator';
import { Types } from 'mongoose';
import { SetRatingDto } from './dto/setRating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Auth()
  @Get(':movieId')
  async getMovieValueByUser(
    @Param('movieId') movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId,
  ) {
    return this.ratingService.getMovieValueByUser(movieId, _id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('setRating')
  async setRating(@User('_id') _id: Types.ObjectId, @Body() dto: SetRatingDto) {
    return this.ratingService.setRating(_id, dto);
  }
}
