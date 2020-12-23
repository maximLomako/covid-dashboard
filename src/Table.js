import dashboard from './dashboard';

const switcherPeriod = document.querySelector('#switcher-period');
const switcherUnits = document.querySelector('#switcher-units');
const casesValue = document.querySelector('#cases-value');
const deathValue = document.querySelector('#death-value');
const recoveredValue = document.querySelector('#recovered-value');
const tableTitle = document.querySelector('.content-rightSide-table__title');
const contentRightSideTable = document.querySelector('.content-rightSide-table');

export default class Table {
  constructor() {
    this.dataAll = null;
    this.dataCountries = null;
  }

  init() {
    this.getData();
    this.subscribeEventListeners();
  }

  subscribeEventListeners() {
    switcherPeriod.addEventListener('change', () => {
      dashboard.currentFilter.isAllPeriod = !dashboard.currentFilter.isAllPeriod;
      document.dispatchEvent(new CustomEvent('filterPeriodChanged', {
        detail: switcherPeriod.value,
      }));
      this.renderValue();
    });
    switcherUnits.addEventListener('change', () => {
      dashboard.currentFilter.isAbsoluteTerms = !dashboard.currentFilter.isAbsoluteTerms;
      document.dispatchEvent(new CustomEvent('filterUnitsChanged', {
        detail: switcherUnits.value,
      }));
      this.renderValue();
    });
    document.addEventListener('filterPeriodChanged', (e) => {
      switcherPeriod.value = e.detail;
      this.renderValue();
    });
    document.addEventListener('filterUnitsChanged', (e) => {
      switcherUnits.value = e.detail;
      this.renderValue();
    });
    document.addEventListener('countryChanged', () => {
      this.renderValue();
    });
  }

  getData() {
    const urlCountries = 'https://disease.sh/v3/covid-19/countries';
    const urlAll = 'https://disease.sh/v3/covid-19/all';
    fetch(urlCountries)
      .then((response) => response.json())
      .then((json) => {
        this.dataCountries = json;
      });
    fetch(urlAll)
      .then((response) => response.json())
      .then((json) => {
        this.dataAll = json;
        this.renderValue();
      });
  }

  renderValue() {
    let data;
    if (dashboard.currentCountry) {
      data = this.dataCountries.find((item) => item.country === dashboard.currentCountry);
    } else {
      data = this.dataAll;
    }

    const per = data.population / 100000;

    const renderValueToday = () => {
      casesValue.textContent = data.todayCases.toLocaleString('en-EN');
      deathValue.textContent = data.todayDeaths.toLocaleString('en-EN');
      recoveredValue.textContent = data.todayRecovered.toLocaleString('en-EN');
    };

    const renderValueTodayPer = () => {
      casesValue.textContent = Math.floor(data.todayCases / per).toLocaleString('en-EN');
      deathValue.textContent = (data.todayDeaths / per).toFixed(2).toLocaleString('en-EN');
      recoveredValue.textContent = Math.floor(data.todayRecovered / per).toLocaleString('en-EN');
    };

    const renderValueAllPeriod = () => {
      casesValue.textContent = data.cases.toLocaleString('en-EN');
      deathValue.textContent = data.deaths.toLocaleString('en-EN');
      recoveredValue.textContent = data.recovered.toLocaleString('en-EN');
    };

    const renderValueAllPeriodPer = () => {
      casesValue.textContent = Math.floor(data.cases / per).toLocaleString('en-EN');
      deathValue.textContent = Math.floor(data.deaths / per).toLocaleString('en-EN');
      recoveredValue.textContent = Math.floor(data.recovered / per).toLocaleString('en-EN');
    };

    tableTitle.textContent = dashboard.currentCountry ? data.country : 'Global';

    if (dashboard.currentFilter.isAllPeriod && dashboard.currentFilter.isAbsoluteTerms) {
      renderValueAllPeriod();
    } else if (dashboard.currentFilter.isAllPeriod && !dashboard.currentFilter.isAbsoluteTerms) {
      renderValueAllPeriodPer();
    } else if (!dashboard.currentFilter.isAllPeriod && dashboard.currentFilter.isAbsoluteTerms) {
      renderValueToday();
    } else {
      renderValueTodayPer();
    }
  }
}
const openFullScreenList = (e) => {
  const { target } = e;
  if (target.classList.contains('content-rightSide-table__share-icon')) {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
    } else {
      contentRightSideTable.requestFullscreen();
    }
    e.target.classList.toggle('content-leftSide-cases__share-icon--active');
  }
};
contentRightSideTable.addEventListener('click', openFullScreenList);
