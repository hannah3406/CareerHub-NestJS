import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JumpitCrawlingService } from './jumpit-crawling.service';
import { TestCrawlingService } from './test-crawling.service';
import { WantedCrawlingService } from './wanted-crawling.service';
import { WebCrawlingService } from './web-crawling.service';

@ApiTags('WebCrawling')
@Controller('web-crawling')
export class WebCrawlingController {
  constructor(
    private readonly webService: WebCrawlingService,
    private readonly wantedService: WantedCrawlingService,
    private readonly jumpitService: JumpitCrawlingService,
    private readonly testService: TestCrawlingService,
  ) {}

  @Get('/getList')
  async getList(@Query() query) {
    return this.webService.getList(query);
  }
  @Post('wanted')
  async wantedcrawling() {
    return this.wantedService.crawl();
  }
  @Post('jumpit')
  async jumpitcrawling() {
    return this.jumpitService.crawl();
  }
  @Post('test')
  async testcrawling() {
    return this.testService.crawl();
  }
}
