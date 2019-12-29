const path = require('path');

module.exports = {
  Basic: function(client) {
    client
      .url('file:///' + path.join(__dirname, '../dist/examples/main.html'))
      .waitForElementVisible('body', 1000)
      .waitForElementVisible(
        'div.gantt-schedule-timeline-calendar__list-column-header-resizer:nth-child(2) > div:nth-child(1)'
      )
      .assert.containsText(
        'div.gantt-schedule-timeline-calendar__list-column-header-resizer:nth-child(2) > div:nth-child(1)',
        'Label',
        'Checking column Label'
      );
  },

  after(client) {
    client.end();
  }
};
