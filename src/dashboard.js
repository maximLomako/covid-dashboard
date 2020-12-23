class Dashboard {
  constructor() {
    this.currentFilter = {
      isAllPeriod: true,
      isAbsoluteTerms: true,
    };
    this.currentCountry = '';
    this.rate = 'cases'
    this.dataInput = '';
    this.data = null;
  }
  getCurrentFilterIsAbsoluteTermsValue() {
    return this.currentFilter.isAbsoluteTerms;
  }

  getCurrentFilterIsAllPeriodValue() {
    return this.currentFilter.isAllPeriod;
  }

  getCurrentCountryValue() {
    return this.currentCountry;
  }

  getRateValue() {
    return this.rate;
  }

  getDataInputValue() {
    return this.dataInput;
  }

}

const dashboard = new Dashboard();
export default dashboard;

