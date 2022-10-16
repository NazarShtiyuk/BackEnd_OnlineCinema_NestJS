import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from '../user/user.model';
import { MovieModel } from '../movie/movie.model';

export interface RatingModel extends Base {}

export class RatingModel extends TimeStamps {
  @prop()
  value: number;

  @prop({ ref: () => UserModel })
  user: Ref<UserModel>;

  @prop({ ref: () => MovieModel })
  movie: Ref<MovieModel>;
}
