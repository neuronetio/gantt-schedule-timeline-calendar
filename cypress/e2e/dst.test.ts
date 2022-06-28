describe('Daylight saving time (DST)', () => {
  it('should move item over dst day', () => {
    let state;
    const itemId = 'gstcid-15';
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
      });
  });
});
