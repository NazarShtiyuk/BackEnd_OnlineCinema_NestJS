import { ConfigService } from '@nestjs/config';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../../user/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ _id }: Pick<UserModel, '_id'>) {
    return this.userModel.findById(_id).exec();
  }
}
