import { Controller, Get, Post, Query } from '@nestjs/common';
import { JumpitCrawlingService } from './jumpit-crawling.service';
import { WantedCrawlingService } from './wanted-crawling.service';

@Controller('web-crawling')
export class WebCrawlingController {
  constructor(
    private readonly wantedService: WantedCrawlingService,
    private readonly jumpitService: JumpitCrawlingService,
  ) {}

  @Get('/getList')
  async getList(@Query('page') page = 1) {
    return this.wantedService.getList(page);
  }
  @Post('wanted')
  async wantedcrawling() {
    return this.wantedService.crawl();
  }
  @Post('jumpit')
  async jumpitcrawling() {
    return this.jumpitService.crawl();
  }
}
