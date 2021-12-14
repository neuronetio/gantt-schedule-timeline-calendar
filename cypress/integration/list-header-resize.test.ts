describe('List header', () => {
  it('should stay at similar time when changing list column width', () => {
    let state, initialDataIndex=0,timeFrom;
    cy.load('/examples/add-rows-items')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
      })
      .wait(200) // wait for scroll event on gstc-loaded
      .then(() => {
        initialDataIndex = state.get('$data.scroll.horizontal.dataIndex');
        timeFrom = state.get('$data.chart.time.fromDate');
        state.update('config.list.columns.data.gstcid-label.width',100);
      }).then(()=>{
        const currentDataIndex = state.get('$data.scroll.horizontal.dataIndex');
        const currentTimeFrom = state.get('$data.chart.time.fromDate');
        expect(initialDataIndex).to.eq(currentDataIndex);
        expect(timeFrom.format('YYYY-MM-DD')).to.eq(currentTimeFrom.format('YYYY-MM-DD'));
      });
  });
});
