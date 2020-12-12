class Dashboard {
  constructor() {
    this.currentFilter = {
      isAllPeriod: true,
      isAbsoluteTerms: true,
    };
    this.currentCountry = '';
  }
}

const dashboard = new Dashboard();

export default dashboard;
