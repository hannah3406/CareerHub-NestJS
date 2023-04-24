import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebCrawling, WebCrawlingSchema } from './schema/web-crawling.schema';
import { WebCrawlingController } from './web-crawling.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { JumpitCrawlingService } from './jumpit-crawling.service';
import { WantedCrawlingService } from './wanted-crawling.service';
import { WebCrawlingService } from './web-crawling.service';
import { TestCrawlingService } from './test-crawling.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: WebCrawling.name, schema: WebCrawlingSchema },
    ]),
  ],
  controllers: [WebCrawlingController],
  providers: [
    JumpitCrawlingService,
    WantedCrawlingService,
    WebCrawlingService,
    TestCrawlingService,
  ],
})
export class WebCrawlingModule {}
