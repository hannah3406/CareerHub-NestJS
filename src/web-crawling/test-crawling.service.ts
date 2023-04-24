import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import puppeteer from 'puppeteer';

import { WebCrawling, WebCrawlingDocument } from './schema/web-crawling.schema';

@Injectable()
export class TestCrawlingService {
  private readonly url: string =
    'https://news.kbs.co.kr/news/view.do?ncd=7635202&amp;ref=DA';

  CACHED = [];

  constructor(
    @InjectModel(WebCrawling.name)
    private readonly webCrawlingModel: Model<WebCrawlingDocument>,
  ) {}

  async crawl() {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      waitForInitialPage: true,
    });
    const page = await browser.newPage();

    await Promise.all([page.waitForNavigation(), page.goto(this.url)]);
    await pageDown(page);
    const iframeElement = await page.$('#msg > div.reply > div > iframe');
    const iframe = await iframeElement.contentFrame();
    console.log(iframe, 'iframe');
    await iframe.waitForNavigation();
    await iframe.waitForSelector('div.reply-wrapper');
    const list = await iframe.$$('div.reply-wrapper');
    console.log(list, 'list');
    const replay = list
      ? await list[0]
          .getProperty('innerText')
          .then((el) => el.jsonValue() as unknown as string)
      : '';
    console.log(replay, 'list');
    await browser.close();
  }
}

const pageDown = async (page) => {
  const scrollHeight = 'document.body.scrollHeight';
  const previousHeight = await page.evaluate(scrollHeight);
  await page.evaluate(`window.scrollTo(0, ${scrollHeight})`);
  await page.waitForFunction(`${scrollHeight} > ${previousHeight}`, {
    timeout: 30000,
  });
};
