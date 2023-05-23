import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import puppeteer from 'puppeteer';
import { userDocument } from 'src/user/schema/user.schema';
import { WebCrawling } from './schema/web-crawling.schema';

@Injectable()
export class WantedCrawlingService {
  private readonly url: string =
    'https://www.wanted.co.kr/wdlist/518?country=kr&job_sort=company.response_rate_order&years=-1&locations=all';

  CACHED = [];

  constructor(
    @InjectModel(WebCrawling.name)
    private readonly webCrawlingModel: Model<userDocument>,
  ) {}

  async crawl() {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1200, height: 900 },
      headless: false,
      waitForInitialPage: true,
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    // const browser = await puppeteer.launch({ headless: true });

    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.setUserAgent(
    //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
    // );
    // await page.setUserAgent(
    //   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    // );
    await Promise.all([page.waitForNavigation(), page.goto(this.url)]);
    const type = 'wanted';
    const articles = await page.$$(
      '#__next > div.JobList_cn__t_THp > div > div > div.List_List_container__JnQMS > ul > li',
    );
    console.log(type);
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      try {
        console.log(this.CACHED, 'wanted');
        const url = await article
          .$('a')
          .then((a) => a.getProperty('href'))
          .then((href) => href.jsonValue());
        if (this.CACHED.includes(url)) {
          console.log(this.CACHED, 'wanted=========true');
          continue;
        }
        this.CACHED.push(url);

        const page = await browser.newPage();
        await Promise.all([
          page.waitForNavigation(),
          page.goto(url, { waitUntil: 'networkidle0' }),
        ]);
        await page.setUserAgent(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
        );

        console.log('body');

        // title
        await page.waitForSelector('section.JobHeader_className__HttDA > h2');
        const _title = await page.$('section.JobHeader_className__HttDA > h2');
        const title = _title
          ? await _title
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        // company
        await page.waitForSelector(
          'section.JobHeader_className__HttDA > div:nth-child(2) > h6 > a',
        );
        const _company = await page.$(
          'section.JobHeader_className__HttDA > div:nth-child(2) > h6 > a',
        );
        const company = _company
          ? await _company
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // description
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(1) > span',
        );
        await pageDown(page);
        const _description = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(1) > span',
        );
        const description = _description
          ? await _description
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // majorTasks
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(2) > span',
        );
        const _majorTasks = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(2) > span',
        );
        const maj = _majorTasks
          ? await _majorTasks
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const majorTasks = maj.replace(/\n\n/gi, '\n');

        // experience
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(3) > span',
        );
        const _experience = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(3) > span',
        );
        const exp = _experience
          ? await _experience
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const experience = exp.replace(/\n\n/gi, '\n');
        // preferential
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(4) > span',
        );
        const _preferential = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(4) > span',
        );
        const pre = _preferential
          ? await _preferential
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const preferential = pre.replace(/\n\n/gi, '\n');
        // welfare
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(5) > span',
        );
        const _welfare = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(5) > span',
        );
        const wel = _welfare
          ? await _welfare
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';
        const welfare = wel.replace(/\n\n/gi, '\n');
        // skill
        const skill = [];
        try {
          await page.waitForSelector(
            'div.JobDescription_JobDescription_skill_wrapper__9EdFE > div.SkillItem_SkillItem__E2WtM',
            { timeout: 1000 },
          );

          const skills = await page.$$(
            'div.JobDescription_JobDescription_skill_wrapper__9EdFE > div.SkillItem_SkillItem__E2WtM',
          );
          for (let k = 1; k < skills.length; k++) {
            const _skill = skills[k];
            const sk = _skill
              ? await _skill
                  .getProperty('innerText')
                  .then((el) => el.jsonValue() as unknown as string)
              : '';
            skill.push(sk);
          }
        } catch (error) {
          console.error('skill 요소 잡지 못함:', error);
        }

        // location
        let location = null;
        try {
          await page.waitForSelector(
            'section.JobHeader_className__HttDA > div.JobHeader_mobileLocationContainer__DyxUQ',
          );
          const _location = await page.$(
            'section.JobHeader_className__HttDA > div.JobHeader_mobileLocationContainer__DyxUQ',
          );
          location = _location
            ? await _location
                .getProperty('innerText')
                .then((el) => el.jsonValue() as unknown as string)
            : '';
        } catch (error) {
          console.error('location 요소 잡지 못함:', error);
        }

        // closingdate
        let closingdate = null;
        try {
          await page.waitForSelector(
            'section.JobWorkPlace_className__ra6rp > div:nth-child(1) > span.body',
          );
          const _closingdate = await page.$(
            'section.JobWorkPlace_className__ra6rp > div:nth-child(1) > span.body',
          );
          // console.log(_closingdate, '_closingdate');
          closingdate = _closingdate
            ? await _closingdate
                .getProperty('innerText')
                .then((el) => el.jsonValue() as unknown as string)
            : '';
        } catch (error) {
          console.error('closingdate 요소 잡지 못함:', error);
        }

        // locationDetail
        let locationDetail = null;
        try {
          await page.waitForSelector(
            'section.JobWorkPlace_className__ra6rp > div:nth-child(2) > span.body',
          );
          const _locationDetail = await page.$(
            'section.JobWorkPlace_className__ra6rp > div:nth-child(2) > span.body',
          );
          console.log(_locationDetail, '_locationDetail');
          locationDetail = _locationDetail
            ? await _locationDetail
                .getProperty('innerText')
                .then((el) => el.jsonValue() as unknown as string)
            : '';
        } catch (error) {
          console.error('locationDetail 요소 잡지 못함:', error);
        }

        const webcrawlingData = {
          url,
          type,
          title,
          description,
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

  @Cron(CronExpression.EVERY_2ND_HOUR)
  async crawlEveryHour() {
    await this.crawl();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearCache() {
    this.CACHED = [];
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
