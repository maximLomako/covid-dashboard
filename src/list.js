import dataCountries from "./dataCountries";
import dashboard from "./dashboard";

const contentLeftSideCases = document.querySelector(".content-leftSide-cases");
const contentLeftSideCasesItems = document.querySelector(".content-leftSide-cases__items");
const contentLeftSideCasesInput = document.querySelector(".use-keyboard-input");
export const contentLeftSideCasesIcon = document.querySelector(".content-leftSide-cases__icon");
const switcherIndicatorsList = document.querySelector("#switcher-indicators-list");
const switcherPeriodList = document.querySelector("#switcher-period-list");
const switcherUnitsList = document.querySelector("#switcher-units-list");
let newDataCountries = dataCountries.filter((c) => {
  if (c.country !== 'MS Zaandam' && c.country !== 'Diamond Princess') {
    return c.country.toLowerCase().includes(dashboard.getDataInputValue().toLowerCase())
  }
});
let fullScreenList = false;

const renderList = (data) => {

  contentLeftSideCasesItems.innerHTML = "";
  data.map((el) => {

      let counterDigit = null;

      if (dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
        if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
          let str = dashboard.getRateValue().charAt(0).toUpperCase() + dashboard.getRateValue().slice(1);
          counterDigit = el[`today${str}`]
        } else {
          counterDigit = el[dashboard.getRateValue()]
        }
        if (counterDigit === NaN || counterDigit === Infinity) {
          counterDigit = 0
        }
      } else if (!dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
        if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
          let str = dashboard.getRateValue().charAt(0).toUpperCase() + dashboard.getRateValue().slice(1);
          counterDigit = Math.round(el[`today${str}`] * 100000 / el.population)
        } else {
          counterDigit = Math.round(el[dashboard.getRateValue()] * 100000 / el.population)
        }
        if (counterDigit === NaN || counterDigit === Infinity) {
          counterDigit = 0
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
    }
  )
}
const changeSelectRateHandler = (e) => {
  const target = e.target.value;
  dashboard.rate = target
  e.target.value = dashboard.getRateValue();
  sortAscending();
  renderList(newDataCountries);
}
const changeSelectPeriodHandler = (e) => {
  const target = e.target.value;
  if (target === 'all') {
    dashboard.currentFilter.isAllPeriod = true
    e.target.value = 'all';
  }
  if (target === 'last') {
    dashboard.currentFilter.isAllPeriod = false
    e.target.value = 'last';
  }
  sortAscending();
  renderList(newDataCountries);
}
const changeSelectUnitsHandler = (e) => {
  const target = e.target.value;
  if (target === 'abs') {
    dashboard.currentFilter.isAbsoluteTerms = true
    e.target.value = 'abs';
  }
  if (target === 'per-handr') {
    dashboard.currentFilter.isAbsoluteTerms = false
    e.target.value = 'per-handr';
  }
  sortAscending();
  renderList(newDataCountries);
}
const sortAscending = () => {
  if (dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
    if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
      let str = dashboard.getRateValue().charAt(0).toUpperCase() + dashboard.getRateValue().slice(1);
      newDataCountries.sort((a, b) => b[`today${str}`] - a[`today${str}`])
    } else {
      newDataCountries.sort((a, b) => b[dashboard.getRateValue()] - a[dashboard.getRateValue()])
    }
  } else if (!dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
    if (!dashboard.getCurrentFilterIsAllPeriodValue()) {
      let str = dashboard.getRateValue().charAt(0).toUpperCase() + dashboard.getRateValue().slice(1);
      newDataCountries.sort((a, b) =>
        b[`today${str}`] * 100000 / b.population - a[`today${str}`] * 100000 / a.population)
    } else {
      newDataCountries.sort((a, b) => b[dashboard.getRateValue()] * 100000 / b.population - a[dashboard.getRateValue()] * 100000 / a.population)
    }
  }
}
export const filterCountryByName = () => {
  newDataCountries = dataCountries
    .filter((c) => {
      if (c.country !== 'MS Zaandam' && c.country !== 'Diamond Princess') {
        return c.country.toLowerCase().includes(dashboard.getDataInputValue().toLowerCase())
      }
    })
  renderList(newDataCountries);
}
const changeDashboardValueByKeyboard = (e) => {
  dashboard.dataInput = e.target.value;
  filterCountryByName();
}
const addAnimationToKeyboardIcon = () => {
  contentLeftSideCasesIcon.classList.toggle("bounce-top");
}
const chooseCountry = (e) => {
  const target = e.target;
  if (target.closest('.content-leftSide-cases__item')) {
    dashboard.currentCountry = (target.closest('.content-leftSide-cases__item').children[1].children[0].textContent)
  }
}
const openFullScreenList = (e) => {
  const target = e.target;
  if (target.classList.contains('content-leftSide-cases__share-icon')) {
    if (fullScreenList) {
      document.exitFullscreen();
    } else {
      contentLeftSideCases.requestFullscreen()
    }
    fullScreenList = !fullScreenList;
    console.log(1);
  }
}

sortAscending();
renderList(newDataCountries);

contentLeftSideCasesItems.addEventListener('click', chooseCountry);
contentLeftSideCasesInput.addEventListener('input', changeDashboardValueByKeyboard);
contentLeftSideCasesIcon.addEventListener('mouseover', addAnimationToKeyboardIcon);
switcherIndicatorsList.addEventListener('change', changeSelectRateHandler);
switcherUnitsList.addEventListener("change", changeSelectUnitsHandler);
switcherPeriodList.addEventListener('change', changeSelectPeriodHandler);
contentLeftSideCases.addEventListener('click', openFullScreenList);

