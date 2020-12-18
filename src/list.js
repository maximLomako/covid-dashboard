import dataCountries from "./dataCountries";
import dashboard from "./dashboard";

const contentLeftSideCasesItems = document.querySelector(".content-leftSide-cases__items");
const contentLeftSideCasesInput = document.querySelector(".use-keyboard-input");
export const contentLeftSideCasesIcon = document.querySelector(".content-leftSide-cases__icon");
const switcherIndicatorsList = document.querySelector("#switcher-indicators-list");
const switcherPeriodList = document.querySelector("#switcher-period-list");
const switcherUnitsList = document.querySelector("#switcher-units-list");
let newDataCountries = [...dataCountries];

const renderList = (data) => {

  contentLeftSideCasesItems.innerHTML = "";
  data.map((el) =>
    contentLeftSideCasesItems.insertAdjacentHTML('beforeend', `
          <div class="content-leftSide-cases__item">
            <div class="content-leftSide-cases__counter">
              <div class="content-leftSide-cases__counter-digit">
     ${dashboard.getCurrentFilterIsAbsoluteTermsValue() ?
      (dashboard.getCurrentFilterIsAllPeriodValue() ? el[dashboard.getRateValue()] : el.todayCases)
      : Math.round(((dashboard.getCurrentFilterIsAllPeriodValue() ? el[dashboard.getRateValue()] : el.todayCases) * 100000) / el.population)}
              </div>
              <div class="content-leftSide-cases__counter-cases">${dashboard.getRateValue()}</div>
            </div>
            <div class="content-leftSide-cases__counter">
              <div class="content-leftSide-cases__counter-country">${el.country}</div>
              <div class="content-leftSide-cases__counter-flag">
              <img src="${el.countryInfo.flag}" alt="flag">
              </div>
            </div>
          </div>`));
}

const changeSelectRateHandler = (e) => {
  const target = e.target.value;
  dashboard.rate = target
  sortAscending();
  renderList(newDataCountries);
}
const changeSelectPeriodHandler = (e) => {
  const target = e.target.value;
  if (target === 'all') {
    dashboard.currentFilter.isAllPeriod = true
  }
  if (target === 'last') {
    dashboard.currentFilter.isAllPeriod = false
  }
  sortAscending();
  renderList(newDataCountries);
}
const changeSelectUnitsHandler = (e) => {
  const target = e.target.value;
  if (target === 'abs') {
    dashboard.currentFilter.isAbsoluteTerms = true
  }
  if (target === 'per-handr') {
    dashboard.currentFilter.isAbsoluteTerms = false
  }
  sortAscending();
  renderList(newDataCountries);
}
const sortAscending = () => {
  newDataCountries.sort((a, b) => b[dashboard.getRateValue()] - a[dashboard.getRateValue()])
}
export const filterCountryByName = () => {
   newDataCountries = dataCountries
    .filter((c) => c.country.toLowerCase().includes(dashboard.getDataInputValue().toLowerCase()))
  renderList(newDataCountries);
}
const changeDashboardValueByKeyboard = (e) => {
  dashboard.dataInput = e.target.value;
  filterCountryByName();
}
const addAnimationToKeyboardIcon = () => {
  contentLeftSideCasesIcon.classList.toggle("bounce-top");
}

sortAscending();
renderList(newDataCountries);

contentLeftSideCasesInput.addEventListener('input', changeDashboardValueByKeyboard);
contentLeftSideCasesIcon.addEventListener('mouseover', addAnimationToKeyboardIcon);
switcherIndicatorsList.addEventListener('change', changeSelectRateHandler);
switcherUnitsList.addEventListener("change", changeSelectUnitsHandler);
switcherPeriodList.addEventListener('change', changeSelectPeriodHandler);

