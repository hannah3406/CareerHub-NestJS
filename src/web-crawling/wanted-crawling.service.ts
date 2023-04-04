import { Injectable, Query } from '@nestjs/common';
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

  CACHED = {};

  constructor(
    @InjectModel(WebCrawling.name)
    private readonly webCrawlingModel: Model<userDocument>,
  ) {}

  async crawl() {
    // const browser = await puppeteer.launch({
    //   headless: false,
    //   waitForInitialPage: true,
    // });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await Promise.all([page.waitForNavigation(), page.goto(this.url)]);

    const articles = await page.$$(
      '#__next > div.JobList_cn__t_THp > div > div > div.List_List_container__JnQMS > ul > li',
    );

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      try {
        console.log(this.CACHED, 'wanted');
        const url = await article
          .$('a')
          .then((a) => a.getProperty('href'))
          .then((href) => href.jsonValue());
        if (this.CACHED[url]) {
          console.log(this.CACHED, 'wanted=========true');
          continue;
        }
        this.CACHED[url] = true;

        const page = await browser.newPage();
        await Promise.all([
          page.waitForNavigation(),
          page.goto(url, { waitUntil: 'networkidle0' }),
        ]);
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
          'section.JobDescription_JobDescription__VWfcb',
        );
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
          'section.JobDescription_JobDescription__VWfcb',
        );
        const _majorTasks = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(2) > span',
        );
        const majorTasks = _majorTasks
          ? await _majorTasks
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // experience
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb',
        );
        const _experience = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(3) > span',
        );
        const experience = _experience
          ? await _experience
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // preferential
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb',
        );
        const _preferential = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(4) > span',
        );
        const preferential = _preferential
          ? await _preferential
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // welfare
        await page.waitForSelector(
          'section.JobDescription_JobDescription__VWfcb',
        );
        const _welfare = await page.$(
          'section.JobDescription_JobDescription__VWfcb > p:nth-of-type(5) > span',
        );
        const welfare = _welfare
          ? await _welfare
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // skill
        await page.waitForSelector(
          'div.JobDescription_JobDescription_skill_wrapper__9EdFE > div.SkillItem_SkillItem__E2WtM',
        );

        const skills = await page.$$(
          'div.JobDescription_JobDescription_skill_wrapper__9EdFE > div.SkillItem_SkillItem__E2WtM',
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
          'section.JobHeader_className__HttDA > div.JobHeader_mobileLocationContainer__DyxUQ',
        );
        const _location = await page.$(
          'section.JobHeader_className__HttDA > div.JobHeader_mobileLocationContainer__DyxUQ',
        );
        const location = _location
          ? await _location
              .getProperty('innerText')
              .then((el) => el.jsonValue() as unknown as string)
          : '';

        // locationDetail
        // let locationDetail = '';
        // try {
        //   await page.waitForSelector(
        //     'section.JobWorkPlace_className__ra6rp > div:nth-child(2) > span.body',
        //   );
        //   const _locationDetail = await page.$(
        //     'section.JobWorkPlace_className__ra6rp > div:nth-child(2) > span.body',
        //   );
        //   console.log(_locationDetail, '_locationDetail');
        //   locationDetail = _locationDetail
        //     ? await _locationDetail
        //         .getProperty('innerText')
        //         .then((el) => el.jsonValue() as unknown as string)
        //     : ''; // 에러가 발생하면 빈 문자열을 할당
        // } catch (error) {
        //   console.error(
        //     `================근무지역!!!!!!!!======= ${i + 1}: ${
        //       error.message
        //     }`,
        //   );
        // }

        const webcrawlingData = {
          url,
          title,
          description,
          majorTasks,
          experience,
          preferential,
          welfare,
          location,
          // locationDetail,
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
    this.CACHED = {};
  }

  async getList(page: number): Promise<userDocument[]> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = this.webCrawlingModel.find().skip(skip).limit(limit);
    const result = await query.exec();

    return result;
  }
}
