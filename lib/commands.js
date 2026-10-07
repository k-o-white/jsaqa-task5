module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },

  focusElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      const element = await page.$(selector);

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      await element.focus();
    } catch (error) {
      throw new Error(`Selector is not focusable: ${selector}`);
    }
  },

  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);

      return await page.$eval(
        selector,
        (element) => element.textContent.trim(),
      );
    } catch (error) {
      throw new Error(`Cannot get text from selector: ${selector}`);
    }
  },

  getElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);

      const element = await page.$(selector);

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      return element;
    } catch (error) {
      throw new Error(`Cannot find element: ${selector}`);
    }
  },

  getElements: async function (page, selector) {
    try {
      await page.waitForSelector(selector);

      return await page.$$(selector);
    } catch (error) {
      throw new Error(`Cannot find elements: ${selector}`);
    }
  },

  getPlaceCoordinates: async function (page, place) {
    try {
      return await page.evaluate((element) => {
        const row = element.parentElement;
        const wrapper = row.parentElement;

        const rowNumber =
          Array.from(wrapper.children).indexOf(row) + 1;

        const placeNumber =
          Array.from(row.children).indexOf(element) + 1;

        return {
          row: rowNumber,
          place: placeNumber,
        };
      }, place);
    } catch (error) {
      throw new Error("Cannot get place coordinates");
    }
  },

  getPlaceSelector: function (coordinates) {
    try {
      return `.buying-scheme__wrapper .buying-scheme__row:nth-child(${coordinates.row}) .buying-scheme__chair:nth-child(${coordinates.place})`;
    } catch (error) {
      throw new Error("Cannot create place selector");
    }
  },

  isElementTaken: async function (page, selector) {
    try {
      await page.waitForSelector(selector);

      return await page.$eval(
        selector,
        (element) =>
          element.classList.contains(
            "buying-scheme__chair_taken",
          ),
      );
    } catch (error) {
      throw new Error(`Cannot check element state: ${selector}`);
    }
  },

  isButtonDisabled: async function (page, selector) {
    try {
      await page.waitForSelector(selector);

      return await page.$eval(
        selector,
        (button) => button.disabled,
      );
    } catch (error) {
      throw new Error(`Cannot check button state: ${selector}`);
    }
  },
};