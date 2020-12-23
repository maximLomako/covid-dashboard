import {
  convertDigitIntoString,
  createNewArr,
  filterCountryByName,
  getCurrentFilterIsAbsoluteTermsValue, makeHumanDateFormat
} from "./functions";


test('delete last item, and el = previous item - current item', () => {
  expect(createNewArr([1, 2, 3])).toStrictEqual([1, 1]);
});

test('delete country from array', () => {
  expect(filterCountryByName([{
    country: 'MS Zaandam'
  }, {
    country: 'Diamond Princess'
  }, {
    country: 'Minsk'
  }])).toStrictEqual([{
    country: 'Minsk'
  }]);
});

test('return arg', () => {
  expect(getCurrentFilterIsAbsoluteTermsValue(true)).toStrictEqual(true);
});

test('return string', () => {
  expect(convertDigitIntoString(55555555555)).toStrictEqual('55,555,555,555');
});

test('human can read this date', () => {
  expect(makeHumanDateFormat(1608716509096)).toStrictEqual('12/23/2020, 12:41:49 PM');
});