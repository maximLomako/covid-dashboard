import dataCountries from "./dataCountries";
import dashboard from "./dashboard";

const contentLeftSideCasesItems = document.querySelector(".content-leftSide-cases__items");
const contentLeftSideCasesInput = document.querySelector(".content-leftSide-cases__input");
const contentLeftSideCasesIcon = document.querySelector(".content-leftSide-cases__icon");
const switcherIndicatorsList = document.querySelector("#switcher-indicators-list");
const switcherPeriodList = document.querySelector("#switcher-period-list");
const switcherUnitsList = document.querySelector("#switcher-units-list");



const renderList = (data) => {
  contentLeftSideCasesItems.innerHTML = "";
  data.map((el) =>
    contentLeftSideCasesItems.insertAdjacentHTML('beforeend', `
          <div class="content-leftSide-cases__item">
            <div class="content-leftSide-cases__counter">
              <div class="content-leftSide-cases__counter-digit">${el.cases}</div>
              <div class="content-leftSide-cases__counter-cases">cases</div>
            </div>
            <div class="content-leftSide-cases__counter">
              <div class="content-leftSide-cases__counter-country">${el.country}</div>
              <div class="content-leftSide-cases__counter-flag">
              <img src="${el.countryInfo.flag}" alt="flag">
              </div>
            </div>
          </div>`));
}

const sortAscending = () => {
  dataCountries.sort((a, b) => b.cases - a.cases)
}

const filterCountryByName = (e) => {
  let value = e.currentTarget.value;
  const newDataCountries = dataCountries
    .filter((c) => c.country.toLowerCase().includes(value.toLowerCase()))
  renderList(newDataCountries);
}

const addAnimationToKeyboardIcon = () => {
  contentLeftSideCasesIcon.classList.toggle("bounce-top");
}

sortAscending();
renderList(dataCountries);

contentLeftSideCasesInput.addEventListener('input', filterCountryByName);
contentLeftSideCasesIcon.addEventListener('mouseover', addAnimationToKeyboardIcon);
contentLeftSideCasesIcon.addEventListener('click', () => {
  console.log("open keyboard");
});
