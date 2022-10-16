import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { of } from 'rxjs';
import { Types } from 'mongoose';
import { MovieDto } from './movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
  ) {}

  async bySlug(slug: string) {
    const movie = await this.movieModel
      .findOne({ slug })
      .populate('actors genres')
      .exec();

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.movieModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec();
  }

  async byId(_id: string) {
    const movie = await this.movieModel.findById(_id);

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async byActor(actorId: Types.ObjectId) {
    const movie = await this.movieModel.find({ actors: actorId }).exec();

    if (!movie) {
      throw new NotFoundException('Movies not found');
    }

    return movie;
  }

  async byGenres(genresIds: Types.ObjectId[]) {
    const movie = await this.movieModel
      .find({ genres: { $in: genresIds } })
      .exec();

    if (!movie) {
      throw new NotFoundException('Movies not found');
    }

    return movie;
  }

  async getMostPopular() {
    return this.movieModel
      .find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec();
  }

  async updateCountOpened(slug: string) {
    const updateCountMovie = await this.movieModel
      .findOne(
        { slug },
        {
          $inc: { countOpened: 1 },
        },
        {
          new: true,
        },
      )
      .exec();

    if (!updateCountMovie) {
      throw new NotFoundException('Movie not found');
    }

    return updateCountMovie;
  }

  async create() {
    const defaultValue = {
      poster: '',
      bigPoster: '',
      actors: [],
      genres: [],
      description: '',
      title: '',
      videoUrl: '',
      slug: '',
    };

    const movie = await this.movieModel.create(defaultValue);

    return movie._id;
  }

  async update(_id: string, dto: MovieDto) {
    const updateMovie = await this.movieModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec();

    if (!updateMovie) {
      throw new NotFoundException('Movie not found');
    }

    return updateMovie;
  }

  async delete(_id: string) {
    const deleteMovie = await this.movieModel.findByIdAndDelete(_id);

    if (!deleteMovie) {
      throw new NotFoundException('Movie not found');
    }

    return deleteMovie;
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.movieModel
      .findByIdAndUpdate(
        id,
        {
          rating: newRating,
        },
        {
          new: true,
        },
      )
      .exec();
  }


}
