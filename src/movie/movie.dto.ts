import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from "class-validator";

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  country: string;
}

export class MovieDto {
  @IsString()
  poster: string;

  @IsString()
  bigPoster: string;

  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsObject ()
  parameters?: Parameters;

  @IsString()
  videoUrl: string;

  @IsString({ each: true })
  @IsArray()
  genres: string[];

  @IsString({ each: true })
  @IsArray()
  actors: string[];

  @IsBoolean()
  isSendTelegram?: boolean;
}
