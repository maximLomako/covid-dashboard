import Chart from 'chart.js';
import dashboard from './dashboard';

const ctx = document.getElementById('myChart').getContext('2d');
const contentRightSideChart = document.querySelector('.content-rightSide__chart');
const switcherIndicatorsChart = document.querySelector('#switcher-indicators-chart');
const switcherPeriodChart = document.querySelector('#switcher-period-chart');
const switcherUnitsChart = document.querySelector('#switcher-units-chart');
const config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'number of cases',
      data: [],
      backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      borderColor: [
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    }],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'The total number of cases',
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
      xAxes: [{
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          callback(value, index) {
            return month[index % 27];
          },
        },
      }],
    },
  },
};
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const myChart = new Chart(ctx, config);

export const getData = () => {
  const URL = dashboard.getCurrentCountryValue() ? `https://disease.sh/v3/covid-19/historical/${dashboard.getCurrentCountryValue()}?lastdays=all` : 'https://disease.sh/v3/covid-19/historical/all?lastdays=all';
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      const keys = dashboard.getCurrentCountryValue() ? Object.keys(data.timeline[dashboard.getRateValue()]) : Object.keys(data[dashboard.getRateValue()]);
      const values = dashboard.getCurrentCountryValue() ? Object.values(data.timeline[dashboard.getRateValue()]) : Object.values(data[dashboard.getRateValue()]);
      renderChart(keys, values);
    });
};
const renderChart = (keys, values) => {
  if (dashboard.getCurrentFilterIsAllPeriodValue()) {
    const mutateArr = (arr) => {
      const newArr = arr.map((el, i, arr) => arr[i + 1] - el);
      newArr.pop();
      return newArr;
    };
    values = mutateArr(values);
  } else {
    values = values;
  }
  if (dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
    config.data.datasets[0].data = values;
  }
  if (!dashboard.getCurrentFilterIsAbsoluteTermsValue()) {
    config.data.datasets[0].data = values.map((el) => Math.round(el * 100000 / 7827000000));
  }
  config.data.labels = keys;
  config.data.datasets[0].label = dashboard.getCurrentCountryValue() ? `number of ${dashboard.getRateValue()} in ${dashboard.getCurrentCountryValue()}` : `number of ${dashboard.getRateValue()}`;
  config.data.datasets[0].backgroundColor = keys.map((el) => 'rgba(255, 99, 132, 0.2)');
  config.options.title.text = dashboard.getCurrentCountryValue() ? `The total number of ${dashboard.getRateValue()} in ${dashboard.getCurrentCountryValue()}` : `The total number of ${dashboard.getRateValue()}`;
  myChart.update();
};
const openFullScreenList = (e) => {
  const { target } = e;
  if (target.classList.contains('content-rightSide__chart-icon')) {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
      document.location.reload();
    } else {
      contentRightSideChart.requestFullscreen();
    }
    e.target.classList.toggle('content-leftSide-cases__share-icon--active');
  }
};
const changeSelectRateHandlerChart = (e) => {
  const target = e.target.value;
  dashboard.rate = target;
  e.target.value = dashboard.getRateValue();
  getData();
};
const changeSelectPeriodHandlerChart = (e) => {
  const target = e.target.value;
  if (target === 'all') {
    dashboard.currentFilter.isAllPeriod = true;
    e.target.value = 'all';
  }
  if (target === 'last') {
    dashboard.currentFilter.isAllPeriod = false;
    e.target.value = 'last';
  }
  getData();
};
const changeSelectUnitsHandlerChart = (e) => {
  const target = e.target.value;
  if (target === 'abs') {
    dashboard.currentFilter.isAbsoluteTerms = true;
    e.target.value = 'abs';
  }
  if (target === 'per-handr') {
    dashboard.currentFilter.isAbsoluteTerms = false;
    e.target.value = 'per-handr';
  }
  getData();
};

getData();

switcherIndicatorsChart.addEventListener('change', (e) => {
  changeSelectRateHandlerChart(e);
  document.dispatchEvent(new CustomEvent('filterRateChanged', {
    detail: switcherIndicatorsChart.value,
  }));
});
switcherUnitsChart.addEventListener('change', (e) => {
  changeSelectUnitsHandlerChart(e);
  document.dispatchEvent(new CustomEvent('filterUnitsChanged', {
    detail: switcherUnitsChart.value,
  }));
});
switcherPeriodChart.addEventListener('change', (e) => {
  changeSelectPeriodHandlerChart(e);
  document.dispatchEvent(new CustomEvent('filterPeriodChanged', {
    detail: switcherPeriodChart.value,
  }));
});
contentRightSideChart.addEventListener('click', openFullScreenList);

document.addEventListener('filterPeriodChanged', (e) => {
  switcherPeriodChart.value = e.detail;
  getData();
});
document.addEventListener('filterUnitsChanged', (e) => {
  switcherUnitsChart.value = e.detail;
  getData();
});
document.addEventListener('filterRateChanged', (e) => {
  switcherIndicatorsChart.value = e.detail;
  getData();
});
document.addEventListener('countryChanged', () => {
  getData();
});
