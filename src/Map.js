/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
import L from 'leaflet';
import dashboard from './dashboard';
import geo from './geoData';

const mapSwitcherRate = document.querySelector('#map-switcher-rate');
const mapSwitcherPeriod = document.querySelector('#map-switcher-period');
const mapSwitcherUnits = document.querySelector('#map-switcher-units');

export default class Map {
  constructor() {
    // this.currentRate = 'Cases';
    this.map = null;
    this.mapOptions = {
      worldCopyJump: true,
      center: [29, 9],
      zoom: 2,
    };
  }

  init() {
    this.renderMap();
    this.getData();
    this.subscribeEventListeners();
  }

  subscribeEventListeners() {
    mapSwitcherRate.addEventListener('change', () => {
      dashboard.rate = mapSwitcherRate.value;
      console.log('🚀 ~ Map ~ dashboard.rate', dashboard.rate);
      this.clearMap();
      this.renderGeojsonLayer();
    });

    mapSwitcherPeriod.addEventListener('change', () => {
      dashboard.currentFilter.isAllPeriod = !dashboard.currentFilter.isAllPeriod;
      document.dispatchEvent(new CustomEvent('filterPeriodChanged', {
        detail: mapSwitcherPeriod.value,
      }));
      this.clearMap();
      this.renderGeojsonLayer();
    });

    mapSwitcherUnits.addEventListener('change', () => {
      dashboard.currentFilter.isAbsoluteTerms = !dashboard.currentFilter.isAbsoluteTerms;
      document.dispatchEvent(new CustomEvent('filterUnitsChanged', {
        detail: mapSwitcherUnits.value,
      }));
      this.clearMap();
      this.renderGeojsonLayer();
    });

    document.addEventListener('filterPeriodChanged', (e) => {
      mapSwitcherPeriod.value = e.detail;
      this.clearMap();
      this.renderGeojsonLayer();
    });

    document.addEventListener('filterUnitsChanged', (e) => {
      mapSwitcherUnits.value = e.detail;
      this.clearMap();
      this.renderGeojsonLayer();
    });
  }

  getData() {
    const urlCountries = 'https://disease.sh/v3/covid-19/countries';
    fetch(urlCountries)
      .then((response) => response.json())
      .then((json) => {
        this.dataCountries = json;
        this.renderGeojsonLayer();
      });
  }

  renderMap() {
    this.map = new L.map('map', this.mapOptions);
    const layer = new L.TileLayer('https://api.mapbox.com/styles/v1/v1nt/ckirm90bo042p1at48sivwglg/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidjFudCIsImEiOiJja2lybTh2bnowaW96MnVvYjJmbW85cjV4In0.Xn57VkKhUswIOzAM4RtQZQ');
    this.map.addLayer(layer);
  }

  renderGeojsonLayer() {
    const countries = this.dataCountries;
    const currentInd = dashboard.rate;
    let geojson;

    function getValue(item) {
      let value;
      const per = item.population / 100000;
      switch (currentInd) {
        case 'deaths': {
          const rate = dashboard.currentFilter.isAllPeriod ? item.deaths : item.todayDeaths;
          value = dashboard.currentFilter.isAbsoluteTerms
            ? Math.floor(rate) : (rate / per).toFixed(2);
          break;
        }
        case 'recovered': {
          const rate = dashboard.currentFilter.isAllPeriod ? item.recovered : item.todayRecovered;
          const res = dashboard.currentFilter.isAbsoluteTerms ? rate : (rate / per);
          value = Math.floor(res);
          break;
        }
        default: {
          const rate = dashboard.currentFilter.isAllPeriod ? item.cases : item.todayCases;
          const res = dashboard.currentFilter.isAbsoluteTerms ? rate : (rate / per);
          value = Math.floor(res);
          break;
        }
      }
      return value;
    }

    function getColor(name) {
      let color;
      let value;
      const dataCountry = countries
        .find((item) => item.countryInfo.iso3 === name);
      if (!dataCountry) return 'rgba(255, 255, 255, 0.0)';
      if (dashboard.currentFilter.isAllPeriod) {
        value = dashboard.currentFilter.isAbsoluteTerms
          ? getValue(dataCountry) : getValue(dataCountry) * 600;
      } else {
        value = dashboard.currentFilter.isAbsoluteTerms
          ? getValue(dataCountry) * 170 : getValue(dataCountry) * 500 * 170;
      }

      switch (currentInd) {
        case 'deaths': {
          if (value > 200000) color = '#800026';
          else if (value > 100000) color = '#BD0026';
          else if (value > 50000) color = '#E31A1C';
          else if (value > 20000) color = '#FC4E2A';
          else if (value > 10000) color = '#FD8D3C';
          else if (value > 5000) color = '#FEB24C';
          else if (value > 2000) color = '#FED976';
          else color = '#FFEDA0';
          break;
        }
        case 'recovered': {
          if (value > 5000000) color = '#006e04';
          else if (value > 1000000) color = '#018a06';
          else if (value > 500000) color = '#02ad07';
          else if (value > 100000) color = '#04bd0a';
          else if (value > 50000) color = '#68cc04';
          else if (value > 20000) color = '#b1cc04';
          else if (value > 10000) color = '#d2f202';
          else color = '#FFEDA0';
          break;
        }
        default: {
          if (value > 10000000) color = '#800026';
          else if (value > 2000000) color = '#BD0026';
          else if (value > 1000000) color = '#E31A1C';
          else if (value > 500000) color = '#FC4E2A';
          else if (value > 100000) color = '#FD8D3C';
          else if (value > 50000) color = '#FEB24C';
          else if (value > 20000) color = '#FED976';
          else color = '#FFEDA0';
          break;
        }
      } return color;
    }

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.iso_a3),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    }

    const info = L.control();
    this.info = info;

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (name) {
      const dataCountry = countries
        .find((item) => item.countryInfo.iso3 === name);
      this._div.innerHTML = `<h4>${mapSwitcherRate.value}</h4>${dataCountry
        ? `<b>${dataCountry.country}</b><br />${getValue(dataCountry).toLocaleString('en-EN')}`
        : 'Hover over a state'}`;
    };

    info.addTo(this.map);

    const selectCountry = (e) => {
      const countryCode = e.target.feature.properties.iso_a3;
      const dataCountry = countries
        .find((item) => item.countryInfo.iso3 === countryCode);
      dashboard.currentCountry = dataCountry.country;
      document.dispatchEvent(new CustomEvent('countryChanged'));
    };

    function highlightFeature(e) {
      const currLayer = e.target;
      currLayer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        currLayer.bringToFront();
      }
      info.update(currLayer.feature.properties.iso_a3);
    }

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    function onEachFeature(feature, layers) {
      layers.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: selectCountry,
      });
    }

    geojson = L.geoJson(geo, {
      style,
      onEachFeature,
    }).addTo(this.map);
    this.geojsonLayer = geojson;
  }

  clearMap() {
    this.geojsonLayer.remove();
    this.info.remove();
  }
}
