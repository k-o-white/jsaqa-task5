const puppeteer = require("puppeteer");
const { expect } = require("chai");

const {
  Before,
  After,
  Given,
  When,
  Then,
  setDefaultTimeout,
} = require("@cucumber/cucumber");

const {
  clickElement,
  focusElement,
  getElement,
  getElements,
  getPlaceCoordinates,
  getText,
  getPlaceSelector,
  isElementTaken,
  isButtonDisabled,
} = require("../../lib/commands");

setDefaultTimeout(60000);

Before(async function () {
  this.browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });

  this.page = await this.browser.newPage();
});

After(async function () {
  await this.page.close();
  await this.browser.close();
});

Given("the user opens the page {string}", async function (string) {
  await this.page.goto(`http://qamid.tmweb.ru${string}`);
});

When("the user selects the third day", async function () {
  const daySelector = "a:nth-child(3)";
  await clickElement(this.page, daySelector);
});

When("the user focuses on the Need for Speed movie", async function () {
  const movieSelector =
    "img[alt='Need for Speed: Жажда скорости (2014) постер']";
  this.movie = "needForSpeed";
  await focusElement(this.page, movieSelector);
});

When("the user focuses on the Knives Out movie", async function () {
  const movieSelector = "img[alt='Достать ножи постер']";
  this.movie = "knivesOut";
  await focusElement(this.page, movieSelector);
});

When("the user focuses on the Stalker movie", async function () {
  const movieSelector = 'section.movie img[src*="128"]';
  this.movie = "stalker";
  await focusElement(this.page, movieSelector);
});

When("the user selects the 15:30 session", async function () {
  const timeSelectors = {
    needForSpeed: ".movie-seances__time[href='#'][data-seance-id='242']",
    knivesOut: "a[href='#'][data-seance-id='240']",
  };
  const timeSelector = timeSelectors[this.movie];
  await clickElement(this.page, timeSelector);
});

When("the user selects the 13:00 session", async function () {
  const timeSelector = ".movie-seances__time[href='#'][data-seance-id='217']";
  await clickElement(this.page, timeSelector);
});

When("the user selects the first free seat", async function () {
  const freePlaceSelector =
    ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)";
  const freePlace = await getElement(this.page, freePlaceSelector);
  this.coordinates = await getPlaceCoordinates(this.page, freePlace);
  await freePlace.click();
});

When("the user selects the first five free seats", async function () {
  const freePlaceSelector =
    ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)";
  const freePlaces = await getElements(this.page, freePlaceSelector);
  if (freePlaces.length < 5) {
    throw new Error(`Not enough free seats. Available: ${freePlaces.length}`);
  }
  const placesToBook = freePlaces.slice(0, 5);
  this.coordinates = [];
  for (const place of placesToBook) {
    const placeCoordinates = await getPlaceCoordinates(this.page, place);
    this.coordinates.push(placeCoordinates);
    await place.click();
  }
});

When("the user clicks the booking button", async function () {
  const bookingButton = ".acceptin-button";
  await clickElement(this.page, bookingButton);
});

When("the user gets the booking code", async function () {
  const bookingCodeButton = "button.acceptin-button";
  await clickElement(this.page, bookingCodeButton);
});

When("the user returns to the the page {string}", async function (string) {
  await this.page.goto(`http://qamid.tmweb.ru${string}`);
});

Then('the user sees the text {string}', async function (string) {
  const checkTitle = ".ticket__check-title";
  const actual = await getText(this.page, checkTitle);
  expect(actual).to.equal(string);
});

Then("the user sees the selected seat", async function () {
  const checkTicketDetails = ".ticket__details.ticket__chairs";
  const actual = await getText(this.page, checkTicketDetails);
  const expected = `${this.coordinates.row}/${this.coordinates.place}`;
  expect(actual).to.equal(expected);
});

Then("the user sees the selected seats", async function () {
  const checkTicketDetails = ".ticket__details.ticket__chairs";
  const actual = await getText(this.page, checkTicketDetails);
  const expected = this.coordinates
    .map(({ row, place }) => `${row}/${place}`)
    .join(", ");
  expect(actual).to.equal(expected);
});

Then("the selected seat is marked as booked", async function () {
  const placeSelector = getPlaceSelector(this.coordinates);
  const isTaken = await isElementTaken(this.page, placeSelector);
  expect(isTaken).to.be.true;
});

Then("the booking button is disabled", async function () {
  const bookingButton = ".acceptin-button";
  const isDisabled = await isButtonDisabled(this.page, bookingButton);
  expect(isDisabled).to.be.true;
});