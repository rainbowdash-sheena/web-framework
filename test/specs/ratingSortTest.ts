import RatingPage from "../../src/pageObjects/RatingPage";
import allureReporter from "@wdio/allure-reporter";
import {beforeEach} from "mocha";

declare global{
    interface Array<T> {
        isFlatNumberEqual(arg: T): boolean;
    }
}

Array.prototype.isFlatNumberEqual = function(arg) {
    if(this.length !== arg.length) {
        return false;
    }

    for (let i = 0; i < this.length; i++) {
        if (this[i] !== arg[i]) {
            return false;
        }
    }

    return true;
}

describe('Проверка сортировки на странице с рейтингом', async () => {
  beforeEach('Открытие страницы с рейтингом', async () => {
    await RatingPage.open();
  });

  it('Проверка сортировки ЛАЙКОВ в рейтинге котов', async () => {
    const ratingLikesTable = await RatingPage.ratingLikesTable;
    const ratingLikesTableId = ratingLikesTable.elementId
    const likesRatingFactValues = [];
    const likesRatingExpectedValues = [];

    const ratingPositionsElements = await ratingLikesTable.findElementsFromElement(
        ratingLikesTableId,
        'xpath',
        '//tr/td[contains(@class, "has-text-success")]'
    );

    for(let i = 0; i < ratingPositionsElements.length; i++) {
        const ratingValue = Number(
            await ratingLikesTable.getElementText(
                Object.values(
                    ratingPositionsElements[i]
                )[0]
            )
        )
        likesRatingFactValues.push(ratingValue);
        likesRatingExpectedValues.push(ratingValue);
    }

    likesRatingExpectedValues.sort((a, b) => b - a); //от большего к меньшему

    const isSuccessTestResult = likesRatingFactValues.isFlatNumberEqual(likesRatingExpectedValues);

    allureReporter.startStep('Сравнение списка лайков с корректной сортировкой');
    allureReporter.addAttachment('Фактическое значение', JSON.stringify(likesRatingFactValues), 'text/plain');
    allureReporter.addAttachment('Ожидаемое значение', JSON.stringify(likesRatingExpectedValues), 'text/plain');
    expect(isSuccessTestResult).toEqual(true);
    allureReporter.endStep();
  });
});
