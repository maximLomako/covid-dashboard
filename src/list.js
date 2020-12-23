import dashboard from './dashboard';
import { getData } from './chart';

const contentLeftSideGlobalCasesCounter = document.querySelector('.content-leftSide-globalCases__counter');
const contentLeftSideCases = document.querySelector('.content-leftSide-cases');
const contentLeftSideCasesItems = document.querySelector('.content-leftSide-cases__items');
const contentLeftSideCasesInput = document.querySelector('.use-keyboard-input');
export const contentLeftSideCasesIcon = document.querySelector('.content-leftSide-cases__icon');
const switcherIndicatorsList = document.querySelector('#switcher-indicators-list');
const switcherPeriodList = document.querySelector('#switcher-period-list');
const switcherUnitsList = document.querySelector('#switcher-units-list');
const lastUpdatedDate = document.querySelector('.last-updated__date');
let newDataCountries = [];

const renderGlobalCases = (data) => {
  contentLeftSideGlobalCasesCounter.textContent = data.reduce((acc, el) => acc + el.cases, 0);
  contentLeftSideGlobalCasesCounter.textContent = contentLeftSideGlobalCasesCounter.textContent
    .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const renderList = (data) => {
  contentLeftSideCasesItems.innerHTML = '';
  data.map((el) => {
    let counterDigit = null;

    if (dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
      if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
        const str = dashboard.getRateValue()
          .charAt(0).toUpperCase() + dashboard.getRateValue().slice(1);
        counterDigit = el[`today${str}`];
      } else {
        counterDigit = el[dashboard.getRateValue()];
      }
      if (counterDigit === NaN || counterDigit === Infinity) {
        counterDigit = 0;
      }
    } else if (!dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
      if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
        const str = dashboard.getRateValue().charAt(0)
          .toUpperCase() + dashboard.getRateValue().slice(1);
        counterDigit = Math.round(el[`today${str}`] * 100000 / el.population);
      } else {
        counterDigit = Math.round((el[dashboard.getRateValue()] * 100000) / el.population);
      }
      if (counterDigit === NaN || counterDigit === Infinity) {
        counterDigit = 0;
      }
    }

    return contentLeftSideCasesItems.insertAdjacentHTML('beforeend', `
          <div class="content-leftSide-cases__item">
            <div class="content-leftSide-cases__counter">
              <div class="content-leftSide-cases__counter-digit">
                ${counterDigit}
              </div>
              <div class="content-leftSide-cases__counter-cases">${dashboard.getRateValue()}</div>
            </div>
            <div class="content-leftSide-cases__counter">
              <div class="content-leftSide-cases__counter-country">${el.country}</div>
              <div class="content-leftSide-cases__counter-flag">
              <img src="${el.countryInfo.flag}" alt="flag">
              </div>
            </div>
          </div>`);
  });
};
const changeSelectRateHandler = (e) => {
  const target = e.target.value;
  dashboard.rate = target;
  e.target.value = dashboard.getRateValue();
  sortAscending();
  renderList(filterCountryByName());
};
const changeSelectPeriodHandler = (e) => {
  const target = e.target.value;
  if (target === 'all') {
    dashboard.currentFilter.isAllPeriod = true;
    e.target.value = 'all';
  }
  if (target === 'last') {
    dashboard.currentFilter.isAllPeriod = false;
    e.target.value = 'last';
  }
  sortAscending();
  renderList(filterCountryByName());
};
const changeSelectUnitsHandler = (e) => {
  const target = e.target.value;
  if (target === 'abs') {
    dashboard.currentFilter.isAbsoluteTerms = true;
    e.target.value = 'abs';
  }
  if (target === 'per-handr') {
    dashboard.currentFilter.isAbsoluteTerms = false;
    e.target.value = 'per-handr';
  }
  sortAscending();
  renderList(filterCountryByName());
};
const sortAscending = () => {
  if (dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
    if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
      const str = dashboard.getRateValue().charAt(0)
        .toUpperCase() + dashboard.getRateValue().slice(1);
      newDataCountries.sort((a, b) => b[`today${str}`] - a[`today${str}`]);
    } else {
      newDataCountries.sort((a, b) => b[dashboard.getRateValue()] - a[dashboard.getRateValue()]);
    }
  } else if (!dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
    if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
      const str = dashboard.getRateValue().charAt(0)
        .toUpperCase() + dashboard.getRateValue().slice(1);
      newDataCountries.sort((a, b) => b[`today${str}`] * 100000 / b.population - a[`today${str}`] * 100000 / a.population);
    } else {
      newDataCountries.sort((a, b) => (b[dashboard.getRateValue()] * 100000) / b.population
      - (a[dashboard.getRateValue()] * 100000) / a.population);
    }
  }
};
export const filterCountryByName = () => {
  const filteredCountries = newDataCountries
    .filter((c) => {
      if (c.country !== 'MS Zaandam' && c.country !== 'Diamond Princess') {
        return c.country.toLowerCase().includes(dashboard.getDataInputValue().toLowerCase());
      }
    });
  sortAscending();
  renderList(filteredCountries);
  return filteredCountries;
};
const changeDashboardValueByKeyboard = (e) => {
  dashboard.dataInput = e.target.value;
  filterCountryByName();
};
const addAnimationToKeyboardIcon = () => {
  contentLeftSideCasesIcon.classList.toggle('bounce-top');
};
const chooseCountry = (e) => {
  const { target } = e;
  if (target.closest('.content-leftSide-cases__item')) {
    dashboard.currentCountry = (target.closest('.content-leftSide-cases__item').children[1].children[0].textContent);
    getData();
  }
};
const openFullScreenList = (e) => {
  const { target } = e;
  if (target.classList.contains('content-leftSide-cases__share-icon')) {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
    } else {
      contentLeftSideCases.requestFullscreen();
    }
    e.target.classList.toggle('content-leftSide-cases__share-icon--active');
  }
};
const updateTime = () => {
  const dateInMMSec = 0;
  fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      const dateObject = new Date(data.updated);
      const humanDateFormat = dateObject.toLocaleString();
      lastUpdatedDate.innerHTML = humanDateFormat;
    });
};
updateTime();

fetch('https://disease.sh/v3/covid-19/countries')
  .then((response) => response.json())
  .then((data) => {
    newDataCountries = data.filter((c) => {
      if (c.country !== 'MS Zaandam' && c.country !== 'Diamond Princess') {
        return c.country.toLowerCase().includes(dashboard.getDataInputValue().toLowerCase());
      }
    });
    sortAscending();
    renderList(newDataCountries);
    renderGlobalCases(newDataCountries);
  });

contentLeftSideCasesItems.addEventListener('click', (e) => {
  chooseCountry(e);
  document.dispatchEvent(new CustomEvent('countryChanged'));
});
contentLeftSideCasesInput.addEventListener('input', changeDashboardValueByKeyboard);
contentLeftSideCasesIcon.addEventListener('mouseover', addAnimationToKeyboardIcon);
switcherIndicatorsList.addEventListener('change', (e) => {
  changeSelectRateHandler(e);
  document.dispatchEvent(new CustomEvent('filterRateChanged', {
    detail: switcherIndicatorsList.value,
  }));
});
switcherUnitsList.addEventListener('change', (e) => {
  changeSelectUnitsHandler(e);
  document.dispatchEvent(new CustomEvent('filterUnitsChanged', {
    detail: switcherUnitsList.value,
  }));
});
switcherPeriodList.addEventListener('change', (e) => {
  changeSelectPeriodHandler(e);
  document.dispatchEvent(new CustomEvent('filterPeriodChanged', {
    detail: switcherPeriodList.value,
  }));
});
contentLeftSideCases.addEventListener('click', openFullScreenList);

document.addEventListener('filterPeriodChanged', (e) => {
  switcherPeriodList.value = e.detail;
  sortAscending();
  renderList(filterCountryByName());
});
document.addEventListener('filterUnitsChanged', (e) => {
  switcherUnitsList.value = e.detail;
  sortAscending();
  renderList(filterCountryByName());
});
document.addEventListener('filterRateChanged', (e) => {
  switcherIndicatorsList.value = e.detail;
  sortAscending();
  renderList(filterCountryByName());
});
