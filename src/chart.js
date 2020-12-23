import Chart from 'chart.js';
import dashboard from "./dashboard";

const ctx = document.getElementById('myChart').getContext('2d');
const contentRightSideChart = document.querySelector('.content-rightSide__chart');
const switcherIndicatorsChart = document.querySelector("#switcher-indicators-chart");
const switcherPeriodChart = document.querySelector("#switcher-period-chart");
const switcherUnitsChart = document.querySelector("#switcher-units-chart");
const config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: `number of cases`,
      data: [],
      backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      borderColor: [
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: false,
    title: {
      display: true,
      text: `The total number of cases`
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          callback: function (value, index, values) {
            return month[index % 27]
          }
        }
      }]
    }
  }
}
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let myChart = new Chart(ctx, config);

const getData = () => {
  fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all') //общее количество случаев
    // fetch('https://disease.sh/v3/covid-19/historical/USA?lastdays=all') //общее количество случаев по стране
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let keys = Object.keys(data[dashboard.getRateValue()])
      let values = Object.values(data[dashboard.getRateValue()])
      renderChart(keys, values);
    })
}
const renderChart = (keys, values) => {
  config.data.labels = keys;
  config.data.datasets[0].data = values;
  config.data.datasets[0].label = `number of cases ${dashboard.getRateValue()}`;
  config.data.datasets[0].backgroundColor = keys.map(el => 'rgba(255, 99, 132, 0.2)');
  config.options.title.text = `The total number of ${dashboard.getRateValue()}`;
  myChart.update();
}
const openFullScreenList = (e) => {
  const target = e.target;
  if (target.classList.contains('content-rightSide__chart-icon')) {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
      document.location.reload();
    } else {
      contentRightSideChart.requestFullscreen()
    }
    e.target.classList.toggle('content-leftSide-cases__share-icon--active');
  }
}
const changeSelectRateHandlerChart = (e) => {
  const target = e.target.value;
  dashboard.rate = target
  e.target.value = dashboard.getRateValue();
  getData();
}
const changeSelectPeriodHandlerChart = (e) => {
  const target = e.target.value;
  if (target === 'all') {
    dashboard.currentFilter.isAllPeriod = true
    e.target.value = 'all';
    console.log(dashboard.currentFilter.isAllPeriod)
  }
  if (target === 'last') {
    dashboard.currentFilter.isAllPeriod = false
    e.target.value = 'last';
  }
  getData();
}
const changeSelectUnitsHandlerChart = (e) => {
  const target = e.target.value;
  if (target === 'abs') {
    dashboard.currentFilter.isAbsoluteTerms = true
    e.target.value = 'abs';
  }
  if (target === 'per-handr') {
    dashboard.currentFilter.isAbsoluteTerms = false
    e.target.value = 'per-handr';
  }
  getData();
}

getData();

switcherIndicatorsChart.addEventListener('change', changeSelectRateHandlerChart);
switcherUnitsChart.addEventListener("change", changeSelectUnitsHandlerChart);
switcherPeriodChart.addEventListener('change', changeSelectPeriodHandlerChart);
contentRightSideChart.addEventListener('click', openFullScreenList);