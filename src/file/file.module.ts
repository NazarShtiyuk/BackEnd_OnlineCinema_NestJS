import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
})
export class FileModule {}
