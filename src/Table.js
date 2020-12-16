import dashboard from './dashboard';

const switcherPeriod = document.querySelector('#switcher-period');
const switcherUnits = document.querySelector('#switcher-units');
const casesValue = document.querySelector('#cases-value');
const deathValue = document.querySelector('#death-value');
const recoveredValue = document.querySelector('#recovered-value');

export default class Table {
  constructor() {
    this.dataAll = null;
    this.dataCountries = null;
  }

  init() {
    this.getData();
    switcherPeriod.addEventListener('change', () => {
      dashboard.currentFilter.isAllPeriod = !dashboard.currentFilter.isAllPeriod;
      this.renderValue();
    });
    switcherUnits.addEventListener('change', () => {
      dashboard.currentFilter.isAbsoluteTerms = !dashboard.currentFilter.isAbsoluteTerms;
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
      deathValue.textContent = Math.floor(data.todayDeaths / per).toLocaleString('en-EN');
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
