import dashboard from "./dashboard";

export const getCurrentFilterIsAbsoluteTermsValue = (value) => {
  return value
}

export const filterCountryByName = (newDataCountries) => {
  let filteredCountries = newDataCountries
    .filter((c) => (c.country !== 'MS Zaandam' && c.country !== 'Diamond Princess'))
  return filteredCountries;
}
console.log(filterCountryByName([{country: 'MS Zaandam'}, {country: 'Diamond Princess'}, {country: 'Minsk'}]));
export const createNewArr = (arr) => {
  let newArr = arr.map((el, i, arr) => arr[i + 1] - el)
  newArr.pop();
  return newArr
}

export const convertDigitIntoString = (value) => {
  let string = value
    .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return string
}

export const makeHumanDateFormat = (date) => {
  const dateObject = new Date(date)
  const humanDateFormat = dateObject.toLocaleString()
  return humanDateFormat;
}


