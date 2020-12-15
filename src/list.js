import dataCountries from "./dataCountries";
const contentLeftSideCasesItems = document.querySelector(".content-leftSide-cases__items");
const contentLeftSideCasesInput = document.querySelector(".content-leftSide-cases__input");

const renderList = () => {
  dataCountries.map((el, i) =>
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

const descendingSort = () => {
  dataCountries.sort((a, b) => a.cases - b.cases)
}

const sortAscending = () => {
  dataCountries.sort((a, b) => b.cases - a.cases)
}

const filterCountry = () => {

}
filterCountry();
sortAscending();
renderList();

