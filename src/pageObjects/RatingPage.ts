import Page from './page';
import Element from '../elements/Element';

/**
 * Cтраница c рейтингами
 */
class RatingPage extends Page {
  /**
   * Объявление селекторов до элементов
   */

  get ratingBlock() {
    const element = new Element({ name: 'Блок рейтинга', locator: '//div[@class="columns"]'});
    return browser.element(element);
  }

  get ratingLikesTable() {
    const element = new Element({ name: 'Таблица лайков', locator: '(//table[contains(@class, "rating-names_table")])[1]/tbody'});
    return browser.element(element);
  }

  async open() {
    const go = await super.open('rating');
    await this.waitForLoaded();
    return go;
  }
  waitForLoaded() {
    super.waitForLoaded();
    return browser.waitUntil(
      async () => {
        return (await this.ratingBlock).isExisting();
      },
      { timeoutMsg: 'Страница не загрузилась' }
    );
  }
}

export default new RatingPage('Страница рейтингов');
