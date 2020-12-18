class Dashboard {
  constructor() {
    this.currentFilter = {
      isAllPeriod: true,
      isAbsoluteTerms: true,
    };
    this.currentCountry = '';
    this.dataInput = '';
  }
   getDataInputValue() {
    return this.dataInput;
  }
}

const dashboard = new Dashboard();
export default dashboard;

