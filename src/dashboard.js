class Dashboard {
  constructor() {
    this.currentFilter = {
      isAllPeriod: true,
      isAbsoluteTerms: true,
    };
    this.currentCountry = '';
    this.data = null;
    this.rate = 'cases';
  }
}

const dashboard = new Dashboard();

export default dashboard;
