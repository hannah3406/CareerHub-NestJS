import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import puppeteer from 'puppeteer';
import { userDocument } from 'src/user/schema/user.schema';
import { WebCrawling } from './schema/web-crawling.schema';

@Injectable()
export class JumpitCrawlingService {
  private readonly url: string = 'https://www.jumpit.co.kr/positions';

  CACHED = [];

  constructor(
    @InjectModel(WebCrawling.name)
    private readonly webCrawlingModel: Model<userDocument>,
  ) {}

  async crawl() {
    const browser = await puppeteer.launch({
      headless: true,
      waitForInitialPage: true,
    });
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await Promise.all([page.waitForNavigation(), page.goto(this.url)]);
    const type = 'jumpit';
    const articles = await page.$$(
      'main > div > div:nth-of-type(1) > section > div',
    );
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      try {
        console.log(this.CACHED, 'jumpit');
        const url = await article
          .$('a')
          .then((a) => a.getProperty('href'))
          .then((href) => href.jsonValue());
        if (this.CACHED.includes(url)) {
          console.log('jumpit=========true');
          continue;
        }
        this.CACHED.push(url);

        const page = await browser.newPage();
        await Promise.all([
          page.waitForNavigation(),
          page.goto(url, { waitUntil: 'networkidle0' }),
        ]);

        // title
        await page.waitForSelector(
          'main > div > div:nth-child(2) > div > section:nth-child(1)> h1',
        );
        const _title = await page.$(
          'main > div > div:nth-child(2) > div > section:nth-child(1)> h1',
        );
        const title = _title
          ? await _title
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // company
        await page.waitForSelector(
          'main > div > div:nth-child(2) > div > section:nth-child(1) > div > a',
        );
        const _company = await page.$(
          'main > div > div:nth-child(2) > div > section:nth-child(1) > div > a',
        );
        const company = _company
          ? await _company
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // majorTasks
        await page.waitForSelector(
          'main > div > div:nth-child(2) > div > section:nth-child(2) > dl:nth-of-type(2) > dd > pre',
        );
        const _majorTasks = await page.$(
          'main > div > div:nth-child(2) > div > section:nth-child(2) > dl:nth-of-type(2) > dd > pre',
        );
        const maj = _majorTasks
          ? await _majorTasks
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const majorTasks = maj.replace(/\n\n/gi, '\n');

        // experience
        await page.waitForSelector(
          'main > div > div:nth-child(2) > div > section:nth-child(2) > dl:nth-of-type(3) > dd > pre',
        );
        const _experience = await page.$(
          'main > div > div:nth-child(2) > div > section:nth-child(2) > dl:nth-of-type(3) > dd > pre',
        );
        const exp = _experience
          ? await _experience
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const experience = exp.replace(/\n\n/gi, '\n');

        // preferential
        await page.waitForSelector(
          'main > div > div:nth-child(2) > div > section:nth-child(2) >  dl:nth-of-type(4) > dd > pre',
        );
        const _preferential = await page.$(
          'main > div > div:nth-child(2) > div > section:nth-child(2) >  dl:nth-of-type(4) > dd > pre',
        );
        const pre = _preferential
          ? await _preferential
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const preferential = pre.replace(/\n\n/gi, '\n');

        // welfare
        await page.waitForSelector(
          'main > div > div:nth-child(2) > div > section:nth-child(2) >  dl:nth-of-type(5) > dd > pre',
        );
        const _welfare = await page.$(
          'main > div > div:nth-child(2) > div > section:nth-child(2) >  dl:nth-of-type(5) > dd > pre',
        );
        const wel = _welfare
          ? await _welfare
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const welfare = wel.replace(/\n\n/gi, '\n');
        // skill
        await page.waitForSelector(
          'main > div > div:nth-child(2) > div > section:nth-child(2) >  dl:nth-of-type(1) > dd > pre > div',
        );

        const skills = await page.$$(
          'main > div > div:nth-child(2) > div > section:nth-child(2) >  dl:nth-of-type(1) > dd > pre > div',
        );
        const skill = [];
        for (let k = 1; k < skills.length; k++) {
          const _skill = skills[k];
          const sk = _skill
            ? await _skill
                .getProperty('innerText')
                .then((el) => el.jsonValue() as unknown as string)
            : '';
          skill.push(sk);
        }
        // location
        await page.waitForSelector(
          'main > div > div:nth-child(2)> div > section:nth-child(3) > dl:nth-child(5) > dd > ul > li',
        );
        const _location = await page.$(
          'main > div > div:nth-child(2) > div > section:nth-child(3) > dl:nth-child(5) > dd > ul > li',
        );
        const lo = _location
          ? await _location
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        const location = lo.replace('\n\n지도보기·주소복사', '');

        // closingdate
        await page.waitForSelector(
          'main > div > div:nth-child(2)> div > section:nth-child(3) > dl:nth-child(4) > dd ',
        );
        const _closingdate = await page.$(
          'main > div > div:nth-child(2)> div > section:nth-child(3) > dl:nth-child(4) > dd ',
        );
        const closingdate = _closingdate
          ? await _closingdate
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const locationDetail = null;
        const webcrawlingData = {
          url,
          type,
          title,
          majorTasks,
          experience,
          preferential,
          welfare,
          location,
          closingdate,
          locationDetail,
          company,
          skill,
        };

        await this.webCrawlingModel.create(webcrawlingData);

        await page.close();
      } catch (error) {
        console.error(`오류! ${i + 1}: ${error.message}`);
      }
    }

    await page.close();
    await browser.close();
  }

  // @Cron(CronExpression.EVERY_3_HOURS)
  // async crawlEveryHour() {
  //   await this.crawl();
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async clearCache() {
  //   this.CACHED = [];
  // }
}
