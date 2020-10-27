import '../templates/index.pug';
import './common';
import CalendarCalc from './modules/CalendarCalc/CalendarCalc';

export default function Main() {

  const testUrl = '/collection/advent-calendar-na-zakaz';
  const container = document.querySelector('.calc-container');
  const activeTabMap = new Map([
    ['default', 0],
    ['/collection/advent-calendar-na-zakaz', 6],
    ['/collection/kvartalnye-kalendari', 0],
    ['/collection/kalendari-design', 6],
    ['/collection/nastolnye-perekidnye-kalendari', 2],
    ['/collection/perekidnye-kalendari', 5],
    ['/collection/otryvnye-kalendari', 5],
  ]);

  if (container !== null) {
    const dataURL = `${__WEBPACK__.PUBLIC_PATH_PREFIX}data/types.json`;
    fetch(dataURL)
      .then((response) => response.json())
      .then((data) => {
        const Calc = new CalendarCalc({
          el: '.calc-container',
          data,
        });
        Calc.render();

        const breadCrumbs = document.querySelectorAll('.breadcrumb a');
        let activeTab = activeTabMap.get('default');
        breadCrumbs.forEach((item) => {
          const href = item.getAttribute('href');
          if (activeTabMap.has(href)) {
            activeTab = activeTabMap.get(href);
          }
        });

        if (activeTabMap.has(window.location.pathname)) {
          activeTab = activeTabMap.get(window.location.pathname);
        }
        Calc.tabs[activeTab].click();
        return;
      });
  }
}

Main();
