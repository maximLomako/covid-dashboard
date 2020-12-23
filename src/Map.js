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
    this.currentRate = 'Cases';
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
      this.currentRate = mapSwitcherRate.value;
    });

    mapSwitcherPeriod.addEventListener('change', () => {
      dashboard.currentFilter.isAllPeriod = !dashboard.currentFilter.isAllPeriod;
      document.dispatchEvent(new CustomEvent('filterPeriodChanged', {
        detail: mapSwitcherPeriod.value,
      }));
    });

    mapSwitcherUnits.addEventListener('change', () => {
      dashboard.currentFilter.isAbsoluteTerms = !dashboard.currentFilter.isAbsoluteTerms;
      document.dispatchEvent(new CustomEvent('filterUnitsChanged', {
        detail: mapSwitcherUnits.value,
      }));
    });

    document.addEventListener('filterPeriodChanged', (e) => {
      mapSwitcherPeriod.value = e.detail;
    });

    document.addEventListener('filterUnitsChanged', (e) => {
      mapSwitcherUnits.value = e.detail;
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
    let geojson;
    function style(feature) {
      return {
        fillColor: '#fff',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    }

    geojson = L.geoJson(geo, {
      style,
    }).addTo(this.map);
    this.geojsonLayer = geojson;
  }
}
