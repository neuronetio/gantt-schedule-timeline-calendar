function plural(n) {
  return n % 10 < 5 && n % 10 > 1 && ~~(n / 10) % 10 !== 1; // eslint-disable-line
}
/* eslint-disable */
function translate(number, withoutSuffix, key) {
  const result = `${number} `;
  switch (key) {
    case 'm':
      return withoutSuffix ? 'minuta' : 'minutę';
    case 'mm':
      return result + (plural(number) ? 'minuty' : 'minut');
    case 'h':
      return withoutSuffix ? 'godzina' : 'godzinę';
    case 'hh':
      return result + (plural(number) ? 'godziny' : 'godzin');
    case 'MM':
      return result + (plural(number) ? 'miesiące' : 'miesięcy');
    case 'yy':
      return result + (plural(number) ? 'lata' : 'lat');
  }
}
/* eslint-enable */

const monthFormat =
  'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
const monthStandalone =
  'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
const MONTHS_IN_FORMAT = /D MMMM/;

const months = (dayjsInstance, format) => {
  if (MONTHS_IN_FORMAT.test(format)) {
    return monthFormat[dayjsInstance.month()];
  }
  return monthStandalone[dayjsInstance.month()];
};
months.s = monthStandalone;
months.f = monthFormat;

const locale = {
  name: 'pl',
  weekdays: 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
  weekdaysShort: 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
  weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
  months,
  monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
  ordinal: (n) => `${n}.`,
  weekStart: 1,
  yearStart: 4,
  relativeTime: {
    future: 'za %s',
    past: '%s temu',
    s: 'kilka sekund',
    m: translate,
    mm: translate,
    h: translate,
    hh: translate,
    d: '1 dzień',
    dd: '%d dni',
    M: 'miesiąc',
    MM: translate,
    y: 'rok',
    yy: translate,
  },
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
  },
};

describe('Locale', () => {
  it('should update and display locale configuration', () => {
    let state;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        expect(state.get('config.locale.weekdays.6')).to.eq('Saturday');
      })
      .get('.gstc__chart-calendar-date[data-gstcid="gstcid-1580511600000"] .gstc-date-small')
      .should('be.visible')
      .then(($el) => {
        expect($el.text()).to.eq('Saturday');
        state.update('config.locale', locale);
      })
      .then(() => {
        expect(state.get('config.locale.weekdays.6')).to.eq('sobota');
      })
      .get('.gstc__chart-calendar-date[data-gstcid="gstcid-1580511600000"] .gstc-date-small')
      .should('be.visible')
      .wait(Cypress.env('wait'))
      .then(($el) => {
        // @ts-ignore
        expect($el.text()).to.eq('sobota');
      });
  });
});
