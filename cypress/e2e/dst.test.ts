import { DataItems, ItemData } from '../../dist/gstc';

describe('Daylight saving time (DST)', () => {
  it('should move item and dependant items over dst properly in days view', () => {
    let state, gstc;
    const cellWidth = 83;
    const itemId = 'gstcid-3';
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        state.update(`config.chart.items`, (items) => {
          const item3 = items['gstcid-3'];
          const item5 = items['gstcid-5'];
          const item7 = items['gstcid-7'];
          const item9 = items['gstcid-9'];
          item3.time.start = gstc.api.time.date('2020-03-16').valueOf();
          item3.time.end = gstc.api.time.date('2020-03-18').endOf('day').valueOf();
          item5.time.start = gstc.api.time.date('2020-03-20').valueOf();
          item5.time.end = gstc.api.time.date('2020-03-22').endOf('day').valueOf();
          item7.time.start = gstc.api.time.date('2020-03-25').valueOf();
          item7.time.end = gstc.api.time.date('2020-03-27').endOf('day').valueOf();
          item9.time.start = gstc.api.time.date('2020-03-24').valueOf();
          item9.time.end = gstc.api.time.date('2020-03-26').endOf('day').valueOf();
          return items;
        });
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-16').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .get('#expand-time')
      .click()
      .wait(Cypress.env('wait'))
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-16 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-18 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-20 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-17 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-19 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-21 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-18 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-20 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-18').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-19 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-21 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-19').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-20 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-20').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-21 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-21').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-22').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-23').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-24').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-25').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-26').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-27').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-08 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-28').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-09 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-08 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-29').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-08 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-10 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-09 23:59:59');
      });
  });

  it('should move item and dependant items over dst properly in days view (without expanding view)', () => {
    let state, gstc;
    const cellWidth = 83;
    const itemId = 'gstcid-3';
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        state.update(`config.chart.items`, (items) => {
          const item3 = items['gstcid-3'];
          const item5 = items['gstcid-5'];
          const item7 = items['gstcid-7'];
          const item9 = items['gstcid-9'];
          item3.time.start = gstc.api.time.date('2020-03-16').valueOf();
          item3.time.end = gstc.api.time.date('2020-03-18').endOf('day').valueOf();
          item5.time.start = gstc.api.time.date('2020-03-20').valueOf();
          item5.time.end = gstc.api.time.date('2020-03-22').endOf('day').valueOf();
          item7.time.start = gstc.api.time.date('2020-03-25').valueOf();
          item7.time.end = gstc.api.time.date('2020-03-27').endOf('day').valueOf();
          item9.time.start = gstc.api.time.date('2020-03-24').valueOf();
          item9.time.end = gstc.api.time.date('2020-03-26').endOf('day').valueOf();
          return items;
        });
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-16').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-16 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-18 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-20 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-17 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-19 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-21 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-18 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-20 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-18').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-19 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-21 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-19').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-20 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-20').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-21 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-21').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-22 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-22').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-23 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-23').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-24 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-24').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-25 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-25').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-26').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-27 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-27').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-28 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-08 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-28').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-29 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-09 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-06 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-08 23:59:59');
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-29').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const items: DataItems = state.get('$data.chart.items');
        const item3 = items['gstcid-3'];
        const item5 = items['gstcid-5'];
        const item7 = items['gstcid-7'];
        const item9 = items['gstcid-9'];
        expect(item3.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-30 00:00:00');
        expect(item3.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        expect(item5.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-03 00:00:00');
        expect(item5.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-05 23:59:59');
        expect(item7.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-08 00:00:00');
        expect(item7.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-10 23:59:59');
        expect(item9.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-07 00:00:00');
        expect(item9.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-09 23:59:59');
      });
  });

  it('should move item over dst day in month view', () => {
    let state, gstc;
    const cellWidth = 38;
    const itemId = 'gstcid-15';
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
      })
      .get('#zoom')
      .select('months')
      .wait(Cypress.env('wait'))
      .then(() => {
        state.update(`config.chart.items.${itemId}`, (item) => {
          item.time.start = gstc.api.time.date('2020-01-01').valueOf();
          item.time.end = gstc.api.time.date('2020-01-01').endOf('month').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-31 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-02 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-05-01 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-05-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-05-31 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-06-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-07-01 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-07-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-07-31 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-08-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-08-31 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-09-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-10-01 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-10-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-10-31 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-11-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-12-01 23:59:59');
      })
      .move(`.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-12-01 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-12-31 23:59:59');
      });
  });
});
