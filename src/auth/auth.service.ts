import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { use } from "passport";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userModel.findOne({ email: dto.email });

    if (oldUser) {
      throw new BadRequestException('User with this email is already exists');
    }

    const newUser = new this.userModel({
      email: dto.email,
      password: await hash(dto.password, 10),
    });

    const user = await newUser.save();

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto): Promise<UserModel> {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  async getNewTokens(dto: RefreshTokenDto) {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Please sign in');
    }

    const result = await this.jwtService.verifyAsync(dto.refreshToken);

    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!');
    }

    const user = await this.userModel.findById(result._id);

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }
}
