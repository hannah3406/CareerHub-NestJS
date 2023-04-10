import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WebCrawlingModule } from './web-crawling/web-crawling.module';
import * as cors from 'cors';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UserModule,
    AuthModule,
    WebCrawlingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
