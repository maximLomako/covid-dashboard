import './list';
import './keyboard';
import './chart';
import Table from './Table';
import Map from './Map';

window.addEventListener('DOMContentLoaded', () => {
  const table = new Table();
  table.init();
  const map = new Map();
  map.init();
});
