const {
  clickElement,
  focusElement,
  getText,
  getElement,
  getElements,
  getPlaceCoordinates,
  getPlaceSelector,
  isElementTaken,
  isButtonDisabled,
} = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
});

afterEach(async () => {
  await page.close();
});

describe("Booking a movie test suit", () => {
  test("Successfully books a free seat", async () => {
    const daySelector = "a:nth-child(3)";
    const movieSelector =
      "img[alt='Need for Speed: Жажда скорости (2014) постер']";
    const timeSelector = ".movie-seances__time[href='#'][data-seance-id='242']";
    const freePlaceSelector =
      ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)";
    const bookingButton = ".acceptin-button";
    const checkTitle = ".ticket__check-title";
    const checkTicketDetails = ".ticket__details.ticket__chairs";

    await clickElement(page, daySelector);
    await focusElement(page, movieSelector);
    await clickElement(page, timeSelector);
    const freePlace = await getElement(page, freePlaceSelector);
    const coordinates = await getPlaceCoordinates(page, freePlace);
    await freePlace.click();
    await clickElement(page, bookingButton);
    
    const actualTitle = await getText(page, checkTitle);
    expect(actualTitle).toEqual("Вы выбрали билеты:");
    const actualPlace = await getText(page, checkTicketDetails);
    expect(actualPlace).toEqual(`${coordinates.row}/${coordinates.place}`);
  });

  test("Successfully books multiple free seats", async () => {
    const daySelector = "a:nth-child(3)";
    const movieSelector = "img[alt='Достать ножи постер']";
    const timeSelector = "a[href='#'][data-seance-id='240']";
    const freePlaceSelector =
      ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)";
    const bookingButton = ".acceptin-button";
    const checkTitle = ".ticket__check-title";
    const checkTicketDetails = ".ticket__details.ticket__chairs";

    await clickElement(page, daySelector);
    await focusElement(page, movieSelector);
    await clickElement(page, timeSelector);
    const freePlaces = await getElements(page, freePlaceSelector);
    expect(freePlaces.length).toBeGreaterThanOrEqual(5);
    const placesToBook = freePlaces.slice(0, 5);
    const coordinates = [];

    for (const place of placesToBook) {
      const placeCoordinates = await getPlaceCoordinates(page, place);
      coordinates.push(placeCoordinates);
      await place.click();
    }

    await clickElement(page, bookingButton);

    const actualTitle = await getText(page, checkTitle);
    expect(actualTitle).toEqual("Вы выбрали билеты:");
    const expectedPlaces = coordinates
      .map(({ row, place }) => `${row}/${place}`)
      .join(", ");
    const actualPlaces = await getText(page, checkTicketDetails);
    expect(actualPlaces).toEqual(expectedPlaces);
  });

  test("Cannot book an already booked seat", async () => {
    const daySelector = "a:nth-child(3)";
    const movieSelector = 'section.movie img[src*="128"]';
    const timeSelector = ".movie-seances__time[href='#'][data-seance-id='217']";
    const freePlaceSelector =
      ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)";
    const bookingButton = ".acceptin-button";
    const checkTitle = ".ticket__check-title";
    const checkTicketDetails = ".ticket__details.ticket__chairs";
    
    await clickElement(page, daySelector);
    await focusElement(page, movieSelector);
    await clickElement(page, timeSelector);
    const freePlace = await getElement(page, freePlaceSelector);
    const coordinates = await getPlaceCoordinates(page, freePlace);
    await freePlace.click();
    await clickElement(page, bookingButton);

    expect(await getText(page, checkTitle)).toEqual("Вы выбрали билеты:");
    expect(await getText(page, checkTicketDetails)).toEqual(
      `${coordinates.row}/${coordinates.place}`,
    );

    await clickElement(page, bookingButton);

    expect(await getText(page, checkTitle)).toEqual("Электронный билет");

    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await clickElement(page, daySelector);
    await focusElement(page, movieSelector);
    await clickElement(page, timeSelector);
    const savedPlaceSelector = getPlaceSelector(coordinates);

    expect(await isElementTaken(page, savedPlaceSelector)).toBe(true);
    expect(await isButtonDisabled(page, bookingButton)).toBe(true);
  });
});