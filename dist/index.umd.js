
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GSTC = factory());
}(this, function () { 'use strict';

  const actionNames = [
      '',
      'list',
      'list-column',
      'list-column-header',
      'list-expander',
      'list-expander-toggle',
      'list-column-header-resizer',
      'list-column-row',
      'chart',
      'chart-calendar',
      'chart-gantt',
      'chart-gantt-grid',
      'chart-gantt-grid-row',
      'chart-gantt-items',
      'chart-gantt-items-row',
      'chart-gantt-items-row-item',
      'chart-calendar-date',
      'chart-gantt-grid-column',
      'chart-gantt-grid-block'
  ];
  function generateEmptyActions() {
      const actions = {};
      actionNames.forEach(name => (actions[name] = []));
      return actions;
  }
  // default configuration
  const defaultConfig = {
      height: 740,
      headerHeight: 86,
      list: {
          rows: {},
          rowHeight: 40,
          columns: {
              percent: 100,
              resizer: {
                  width: 10,
                  inRealTime: true,
                  dots: 6
              },
              data: {}
          },
          expander: {
              padding: 20,
              size: 20,
              icons: {
                  open: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                  closed: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'
              }
          }
      },
      scroll: {
          top: 0,
          left: 0,
          xMultiplier: 1.5,
          yMultiplier: 1
      },
      chart: {
          time: {
              from: 0,
              to: 0,
              zoom: 21,
              period: 'day',
              dates: []
          },
          calendar: {
              vertical: {
                  smallFormat: 'YYYY-MM-DD'
              }
          },
          grid: {},
          items: {}
      },
      classNames: {},
      actions: generateEmptyActions(),
      locale: {
          name: 'en',
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
          weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
          monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
          weekStart: 1,
          relativeTime: {
              future: 'in %s',
              past: '%s ago',
              s: 'a few seconds',
              m: 'a minute',
              mm: '%d minutes',
              h: 'an hour',
              hh: '%d hours',
              d: 'a day',
              dd: '%d days',
              M: 'a month',
              MM: '%d months',
              y: 'a year',
              yy: '%d years'
          },
          formats: {
              LT: 'HH:mm',
              LTS: 'HH:mm:ss',
              L: 'DD/MM/YYYY',
              LL: 'D MMMM YYYY',
              LLL: 'D MMMM YYYY HH:mm',
              LLLL: 'dddd, D MMMM YYYY HH:mm'
          },
          ordinal: n => {
              const s = ['th', 'st', 'nd', 'rd'];
              const v = n % 100;
              return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
          }
      }
  };
  //# sourceMappingURL=default-config.js.map

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var dayjs_min = createCommonjsModule(function (module, exports) {
  !function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return !r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return (n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:i,h:r,m:e,s:n,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else{var i=t.name;m[i]=t,r=i;}return e||(l=r),r},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",o)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,a){var h=this,f=!!D.u(a)||a,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case o:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,a){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[o]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(a-this.$W):a;if(f===u||f===o){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,a){var h,f=this;t=Number(t);var c=D.p(a),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.valueOf()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:D.s(a+1,2,"0"),MMM:c(i.monthsShort,a,h,3),MMMM:h[a]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,o,2),ddd:c(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[o]=y/12,c[u]=y,c[a]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.toDate(),this)},d.toDate=function(){return new Date(this.$d)},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
  });

  var utc = createCommonjsModule(function (module, exports) {
  !function(t,e){module.exports=e();}(commonjsGlobal,function(){return function(t,e,i){var n=e.prototype;i.utc=function(t,i){return new e({date:t,utc:!0,format:i})},n.utc=function(){return i(this.toDate(),{locale:this.$L,utc:!0})},n.local=function(){return i(this.toDate(),{locale:this.$L,utc:!1})};var s=n.parse;n.parse=function(t){t.utc&&(this.$u=!0),s.call(this,t);};var u=n.init;n.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds();}else u.call(this);};var o=n.utcOffset;n.utcOffset=function(){return this.$u?0:o.call(this)};var c=n.format;n.format=function(t){var e=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return c.call(this,e)},n.isUTC=function(){return !!this.$u};}});
  });

  dayjs_min.extend(utc);

  function timeApi(state, getApi) {
    const locale = state.get('config.locale');
    dayjs_min.locale(locale, null, true);
    return {
      date(time) {
        return dayjs_min(time)
          .utc()
          .locale(locale.name);
      },
      recalculateFromTo(time) {
        time = { ...time };
        if (time.from !== 0) {
          time.from = this.date(time.from)
            .startOf('day')
            .valueOf();
        }
        if (time.to !== 0) {
          time.to = this.date(time.to)
            .endOf('day')
            .valueOf();
        }

        let from = Number.MAX_SAFE_INTEGER,
          to = 0;
        const items = state.get('config.chart.items');
        if (Object.keys(items).length === 0) {
          return time;
        }
        if (time.from === 0 || time.to === 0) {
          for (let itemId in items) {
            const item = items[itemId];
            if (from > item.time.start) {
              from = item.time.start;
            }
            if (to < item.time.end) {
              to = item.time.end;
            }
          }
          if (time.from === 0) {
            time.from = this.date(from)
              .startOf('day')
              .valueOf();
          }
          if (time.to === 0) {
            time.to = this.date(to)
              .endOf('day')
              .valueOf();
          }
        }
        return time;
      }
    };
  }

  // forked from https://github.com/joonhocho/superwild
  class Matcher {
      constructor(pattern, wchar = '*') {
          this.wchar = wchar;
          this.pattern = pattern;
          this.segments = [];
          this.starCount = 0;
          this.minLength = 0;
          this.maxLength = 0;
          this.segStartIndex = 0;
          for (let i = 0, len = pattern.length; i < len; i += 1) {
              const char = pattern[i];
              if (char === wchar) {
                  this.starCount += 1;
                  if (i > this.segStartIndex) {
                      this.segments.push(pattern.substring(this.segStartIndex, i));
                  }
                  this.segments.push(char);
                  this.segStartIndex = i + 1;
              }
          }
          if (this.segStartIndex < pattern.length) {
              this.segments.push(pattern.substring(this.segStartIndex));
          }
          if (this.starCount) {
              this.minLength = pattern.length - this.starCount;
              this.maxLength = Infinity;
          }
          else {
              this.maxLength = this.minLength = pattern.length;
          }
      }
      match(match) {
          if (this.pattern === this.wchar) {
              return true;
          }
          if (this.segments.length === 0) {
              return this.pattern === match;
          }
          const { length } = match;
          if (length < this.minLength || length > this.maxLength) {
              return false;
          }
          let segLeftIndex = 0;
          let segRightIndex = this.segments.length - 1;
          let rightPos = match.length - 1;
          let rightIsStar = false;
          while (true) {
              const segment = this.segments[segRightIndex];
              segRightIndex -= 1;
              if (segment === this.wchar) {
                  rightIsStar = true;
              }
              else {
                  const lastIndex = rightPos + 1 - segment.length;
                  const index = match.lastIndexOf(segment, lastIndex);
                  if (index === -1 || index > lastIndex) {
                      return false;
                  }
                  if (rightIsStar) {
                      rightPos = index - 1;
                      rightIsStar = false;
                  }
                  else {
                      if (index !== lastIndex) {
                          return false;
                      }
                      rightPos -= segment.length;
                  }
              }
              if (segLeftIndex > segRightIndex) {
                  break;
              }
          }
          return true;
      }
  }
  //# sourceMappingURL=stringMatcher.js.map

  class WildcardObject {
      constructor(obj, delimeter, wildcard) {
          this.obj = obj;
          this.delimeter = delimeter;
          this.wildcard = wildcard;
      }
      simpleMatch(first, second) {
          if (first === second)
              return true;
          if (first === this.wildcard)
              return true;
          const index = first.indexOf(this.wildcard);
          if (index > -1) {
              const end = first.substr(index + 1);
              if (index === 0 || second.substring(0, index) === first.substring(0, index)) {
                  const len = end.length;
                  if (len > 0) {
                      return second.substr(-len) === end;
                  }
                  return true;
              }
          }
          return false;
      }
      match(first, second) {
          return (first === second ||
              first === this.wildcard ||
              second === this.wildcard ||
              this.simpleMatch(first, second) ||
              new Matcher(first).match(second));
      }
      handleArray(wildcard, currentArr, partIndex, path, result = {}) {
          let nextPartIndex = wildcard.indexOf(this.delimeter, partIndex);
          let end = false;
          if (nextPartIndex === -1) {
              end = true;
              nextPartIndex = wildcard.length;
          }
          const currentWildcardPath = wildcard.substring(partIndex, nextPartIndex);
          let index = 0;
          for (const item of currentArr) {
              const key = index.toString();
              const currentPath = path === '' ? key : path + this.delimeter + index;
              if (currentWildcardPath === this.wildcard ||
                  currentWildcardPath === key ||
                  this.simpleMatch(currentWildcardPath, key)) {
                  end ? (result[currentPath] = item) : this.goFurther(wildcard, item, nextPartIndex + 1, currentPath, result);
              }
              index++;
          }
          return result;
      }
      handleObject(wildcard, currentObj, partIndex, path, result = {}) {
          let nextPartIndex = wildcard.indexOf(this.delimeter, partIndex);
          let end = false;
          if (nextPartIndex === -1) {
              end = true;
              nextPartIndex = wildcard.length;
          }
          const currentWildcardPath = wildcard.substring(partIndex, nextPartIndex);
          for (let key in currentObj) {
              key = key.toString();
              const currentPath = path === '' ? key : path + this.delimeter + key;
              if (currentWildcardPath === this.wildcard ||
                  currentWildcardPath === key ||
                  this.simpleMatch(currentWildcardPath, key)) {
                  end
                      ? (result[currentPath] = currentObj[key])
                      : this.goFurther(wildcard, currentObj[key], nextPartIndex + 1, currentPath, result);
              }
          }
          return result;
      }
      goFurther(wildcard, currentObj, partIndex, currentPath, result = {}) {
          if (Array.isArray(currentObj)) {
              return this.handleArray(wildcard, currentObj, partIndex, currentPath, result);
          }
          return this.handleObject(wildcard, currentObj, partIndex, currentPath, result);
      }
      get(wildcard) {
          return this.goFurther(wildcard, this.obj, 0, '');
      }
  }
  //# sourceMappingURL=wildcard-object-scan.js.map

  class ObjectPath {
      static get(path, obj, copiedPath = null) {
          if (copiedPath === null) {
              copiedPath = path.slice();
          }
          if (copiedPath.length === 0 || typeof obj === 'undefined') {
              return obj;
          }
          const currentPath = copiedPath.shift();
          if (!obj.hasOwnProperty(currentPath)) {
              return undefined;
          }
          if (copiedPath.length === 0) {
              return obj[currentPath];
          }
          return ObjectPath.get(path, obj[currentPath], copiedPath);
      }
      static set(path, newValue, obj, copiedPath = null) {
          if (copiedPath === null) {
              copiedPath = path.slice();
          }
          if (copiedPath.length === 0) {
              for (const key in obj) {
                  delete obj[key];
              }
              for (const key in newValue) {
                  obj[key] = newValue[key];
              }
              return;
          }
          const currentPath = copiedPath.shift();
          if (copiedPath.length === 0) {
              obj[currentPath] = newValue;
              return;
          }
          if (!obj.hasOwnProperty(currentPath)) {
              obj[currentPath] = {};
          }
          ObjectPath.set(path, newValue, obj[currentPath], copiedPath);
      }
  }
  //# sourceMappingURL=ObjectPath.js.map

  function log(message, info) {
      console.debug(message, info);
  }
  const defaultOptions = { delimeter: `.`, notRecursive: `;`, param: `:`, wildcard: `*`, log };
  const defaultListenerOptions = { bulk: false, debug: false, source: '', data: undefined };
  const defaultUpdateOptions = { only: [], source: '', debug: false, data: undefined };
  class DeepState {
      constructor(data = {}, options = defaultOptions) {
          this.listeners = {};
          this.data = data;
          this.options = Object.assign(Object.assign({}, defaultOptions), options);
          this.id = 0;
          this.pathGet = ObjectPath.get;
          this.pathSet = ObjectPath.set;
          this.scan = new WildcardObject(this.data, this.options.delimeter, this.options.wildcard);
      }
      getListeners() {
          return this.listeners;
      }
      destroy() {
          this.data = undefined;
          this.listeners = {};
      }
      match(first, second) {
          if (first === second)
              return true;
          if (first === this.options.wildcard || second === this.options.wildcard)
              return true;
          return this.scan.match(first, second);
      }
      cutPath(longer, shorter) {
          return this.split(this.cleanNotRecursivePath(longer))
              .slice(0, this.split(this.cleanNotRecursivePath(shorter)).length)
              .join(this.options.delimeter);
      }
      trimPath(path) {
          return this.cleanNotRecursivePath(path).replace(new RegExp(`^\\${this.options.delimeter}{1}`), ``);
      }
      split(path) {
          return path === '' ? [] : path.split(this.options.delimeter);
      }
      isWildcard(path) {
          return path.includes(this.options.wildcard);
      }
      isNotRecursive(path) {
          return path.endsWith(this.options.notRecursive);
      }
      cleanNotRecursivePath(path) {
          return this.isNotRecursive(path) ? path.slice(0, -this.options.notRecursive.length) : path;
      }
      hasParams(path) {
          return path.includes(this.options.param);
      }
      getParamsInfo(path) {
          let paramsInfo = { replaced: '', original: path, params: {} };
          let partIndex = 0;
          let fullReplaced = [];
          for (const part of this.split(path)) {
              paramsInfo.params[partIndex] = {
                  original: part,
                  replaced: '',
                  name: ''
              };
              const reg = new RegExp(`\\${this.options.param}([^\\${this.options.delimeter}\\${this.options.param}]+)`, 'g');
              let param = reg.exec(part);
              if (param) {
                  paramsInfo.params[partIndex].name = param[1];
              }
              else {
                  delete paramsInfo.params[partIndex];
                  fullReplaced.push(part);
                  partIndex++;
                  continue;
              }
              reg.lastIndex = 0;
              paramsInfo.params[partIndex].replaced = part.replace(reg, this.options.wildcard);
              fullReplaced.push(paramsInfo.params[partIndex].replaced);
              partIndex++;
          }
          paramsInfo.replaced = fullReplaced.join(this.options.delimeter);
          return paramsInfo;
      }
      getParams(paramsInfo, path) {
          if (!paramsInfo) {
              return undefined;
          }
          const split = this.split(path);
          const result = {};
          for (const partIndex in paramsInfo.params) {
              const param = paramsInfo.params[partIndex];
              result[param.name] = split[partIndex];
          }
          return result;
      }
      subscribeAll(userPaths, fn, options = defaultListenerOptions) {
          let unsubscribers = [];
          for (const userPath of userPaths) {
              unsubscribers.push(this.subscribe(userPath, fn, options));
          }
          return () => {
              for (const unsubscribe of unsubscribers) {
                  unsubscribe();
              }
              unsubscribers = [];
          };
      }
      getCleanListenersCollection(values = {}) {
          return Object.assign({
              listeners: {},
              isRecursive: false,
              isWildcard: false,
              hasParams: false,
              match: undefined,
              paramsInfo: undefined,
              path: undefined,
              count: 0
          }, values);
      }
      getCleanListener(fn, options = defaultListenerOptions) {
          return {
              fn,
              options: Object.assign(Object.assign({}, defaultListenerOptions), options)
          };
      }
      getListenerCollectionMatch(listenerPath, isRecursive, isWildcard) {
          listenerPath = this.cleanNotRecursivePath(listenerPath);
          return (path) => {
              if (isRecursive)
                  path = this.cutPath(path, listenerPath);
              if (isWildcard && this.match(listenerPath, path))
                  return true;
              return listenerPath === path;
          };
      }
      getListenersCollection(listenerPath, listener) {
          if (typeof this.listeners[listenerPath] !== 'undefined') {
              let listenersCollection = this.listeners[listenerPath];
              this.id++;
              listenersCollection.listeners[this.id] = listener;
              return listenersCollection;
          }
          let collCfg = {
              isRecursive: true,
              isWildcard: false,
              hasParams: false,
              paramsInfo: undefined,
              originalPath: listenerPath,
              path: listenerPath
          };
          if (this.hasParams(collCfg.path)) {
              collCfg.paramsInfo = this.getParamsInfo(collCfg.path);
              collCfg.path = collCfg.paramsInfo.replaced;
              collCfg.hasParams = true;
          }
          collCfg.isWildcard = this.isWildcard(collCfg.path);
          if (this.isNotRecursive(collCfg.path)) {
              collCfg.isRecursive = false;
          }
          let listenersCollection = (this.listeners[collCfg.path] = this.getCleanListenersCollection(Object.assign(Object.assign({}, collCfg), { match: this.getListenerCollectionMatch(collCfg.path, collCfg.isRecursive, collCfg.isWildcard) })));
          this.id++;
          listenersCollection.listeners[this.id] = listener;
          return listenersCollection;
      }
      subscribe(listenerPath, fn, options = defaultListenerOptions, type = 'subscribe') {
          let listener = this.getCleanListener(fn, options);
          const listenersCollection = this.getListenersCollection(listenerPath, listener);
          listenersCollection.count++;
          listenerPath = listenersCollection.path;
          if (!listenersCollection.isWildcard) {
              fn(this.pathGet(this.split(this.cleanNotRecursivePath(listenerPath)), this.data), {
                  type,
                  listener,
                  listenersCollection,
                  path: {
                      listener: listenerPath,
                      update: undefined,
                      resolved: this.cleanNotRecursivePath(listenerPath)
                  },
                  params: this.getParams(listenersCollection.paramsInfo, listenerPath),
                  options
              });
          }
          else {
              const paths = this.scan.get(this.cleanNotRecursivePath(listenerPath));
              if (options.bulk) {
                  const bulkValue = [];
                  for (const path in paths) {
                      bulkValue.push({
                          path,
                          params: this.getParams(listenersCollection.paramsInfo, path),
                          value: paths[path]
                      });
                  }
                  fn(bulkValue, {
                      type,
                      listener,
                      listenersCollection,
                      path: {
                          listener: listenerPath,
                          update: undefined,
                          resolved: undefined
                      },
                      options,
                      params: undefined
                  });
              }
              else {
                  for (const path in paths) {
                      fn(paths[path], {
                          type,
                          listener,
                          listenersCollection,
                          path: {
                              listener: listenerPath,
                              update: undefined,
                              resolved: this.cleanNotRecursivePath(path)
                          },
                          params: this.getParams(listenersCollection.paramsInfo, path),
                          options
                      });
                  }
              }
          }
          this.debugSubscribe(listener, listenersCollection, listenerPath);
          return this.unsubscribe(listenerPath, this.id);
      }
      unsubscribe(path, id) {
          const listeners = this.listeners;
          const listenersCollection = listeners[path];
          return function unsub() {
              delete listenersCollection.listeners[id];
              listenersCollection.count--;
              if (listenersCollection.count === 0) {
                  delete listeners[path];
              }
          };
      }
      same(newValue, oldValue) {
          return ((['number', 'string', 'undefined', 'boolean'].includes(typeof newValue) || newValue === null) &&
              oldValue === newValue);
      }
      notifyListeners(listeners, exclude = [], returnNotified = true) {
          const alreadyNotified = [];
          for (const path in listeners) {
              let { single, bulk } = listeners[path];
              for (const singleListener of single) {
                  if (exclude.includes(singleListener))
                      continue;
                  const time = this.debugTime(singleListener);
                  singleListener.listener.fn(singleListener.value(), singleListener.eventInfo);
                  if (returnNotified)
                      alreadyNotified.push(singleListener);
                  this.debugListener(time, singleListener);
              }
              for (const bulkListener of bulk) {
                  if (exclude.includes(bulkListener))
                      continue;
                  const time = this.debugTime(bulkListener);
                  const bulkValue = bulkListener.value.map((bulk) => (Object.assign(Object.assign({}, bulk), { value: bulk.value() })));
                  bulkListener.listener.fn(bulkValue, bulkListener.eventInfo);
                  if (returnNotified)
                      alreadyNotified.push(bulkListener);
                  this.debugListener(time, bulkListener);
              }
          }
          return alreadyNotified;
      }
      getSubscribedListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
          options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
          const listeners = {};
          for (let listenerPath in this.listeners) {
              const listenersCollection = this.listeners[listenerPath];
              listeners[listenerPath] = { single: [], bulk: [], bulkData: [] };
              if (listenersCollection.match(updatePath)) {
                  const params = listenersCollection.paramsInfo
                      ? this.getParams(listenersCollection.paramsInfo, updatePath)
                      : undefined;
                  const value = listenersCollection.isRecursive || listenersCollection.isWildcard
                      ? () => this.get(this.cutPath(updatePath, listenerPath))
                      : () => newValue;
                  const bulkValue = [{ value, path: updatePath, params }];
                  for (const listenerId in listenersCollection.listeners) {
                      const listener = listenersCollection.listeners[listenerId];
                      if (listener.options.bulk) {
                          listeners[listenerPath].bulk.push({
                              listener,
                              listenersCollection,
                              eventInfo: {
                                  type,
                                  listener,
                                  path: {
                                      listener: listenerPath,
                                      update: originalPath ? originalPath : updatePath,
                                      resolved: undefined
                                  },
                                  params,
                                  options
                              },
                              value: bulkValue
                          });
                      }
                      else {
                          listeners[listenerPath].single.push({
                              listener,
                              listenersCollection,
                              eventInfo: {
                                  type,
                                  listener,
                                  path: {
                                      listener: listenerPath,
                                      update: originalPath ? originalPath : updatePath,
                                      resolved: this.cleanNotRecursivePath(updatePath)
                                  },
                                  params,
                                  options
                              },
                              value
                          });
                      }
                  }
              }
          }
          return listeners;
      }
      notifySubscribedListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
          return this.notifyListeners(this.getSubscribedListeners(updatePath, newValue, options, type, originalPath));
      }
      getNestedListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
          const listeners = {};
          for (let listenerPath in this.listeners) {
              listeners[listenerPath] = { single: [], bulk: [] };
              const listenersCollection = this.listeners[listenerPath];
              const currentCuttedPath = this.cutPath(listenerPath, updatePath);
              if (this.match(currentCuttedPath, updatePath)) {
                  const restPath = this.trimPath(listenerPath.substr(currentCuttedPath.length));
                  const values = new WildcardObject(newValue, this.options.delimeter, this.options.wildcard).get(restPath);
                  const params = listenersCollection.paramsInfo
                      ? this.getParams(listenersCollection.paramsInfo, updatePath)
                      : undefined;
                  const bulk = [];
                  const bulkListeners = {};
                  for (const currentRestPath in values) {
                      const value = () => values[currentRestPath];
                      const fullPath = [updatePath, currentRestPath].join(this.options.delimeter);
                      for (const listenerId in listenersCollection.listeners) {
                          const listener = listenersCollection.listeners[listenerId];
                          const eventInfo = {
                              type,
                              listener,
                              listenersCollection,
                              path: {
                                  listener: listenerPath,
                                  update: originalPath ? originalPath : updatePath,
                                  resolved: this.cleanNotRecursivePath(fullPath)
                              },
                              params,
                              options
                          };
                          if (listener.options.bulk) {
                              bulk.push({ value, path: fullPath, params });
                              bulkListeners[listenerId] = listener;
                          }
                          else {
                              listeners[listenerPath].single.push({ listener, listenersCollection, eventInfo, value });
                          }
                      }
                  }
                  for (const listenerId in bulkListeners) {
                      const listener = bulkListeners[listenerId];
                      const eventInfo = {
                          type,
                          listener,
                          listenersCollection,
                          path: {
                              listener: listenerPath,
                              update: updatePath,
                              resolved: undefined
                          },
                          options,
                          params
                      };
                      listeners[listenerPath].bulk.push({ listener, listenersCollection, eventInfo, value: bulk });
                  }
              }
          }
          return listeners;
      }
      notifyNestedListeners(updatePath, newValue, options, type = 'update', alreadyNotified, originalPath = null) {
          return this.notifyListeners(this.getNestedListeners(updatePath, newValue, options, type, originalPath), alreadyNotified, false);
      }
      getNotifyOnlyListeners(updatePath, newValue, options, type = 'update', originalPath = null) {
          const listeners = {};
          if (typeof options.only !== 'object' ||
              !Array.isArray(options.only) ||
              typeof options.only[0] === 'undefined' ||
              !this.canBeNested(newValue)) {
              return listeners;
          }
          for (const notifyPath of options.only) {
              const wildcardScan = new WildcardObject(newValue, this.options.delimeter, this.options.wildcard).get(notifyPath);
              listeners[notifyPath] = { bulk: [], single: [] };
              for (const wildcardPath in wildcardScan) {
                  const fullPath = updatePath + this.options.delimeter + wildcardPath;
                  for (const listenerPath in this.listeners) {
                      const listenersCollection = this.listeners[listenerPath];
                      const params = listenersCollection.paramsInfo
                          ? this.getParams(listenersCollection.paramsInfo, fullPath)
                          : undefined;
                      if (this.match(listenerPath, fullPath)) {
                          const value = () => wildcardScan[wildcardPath];
                          const bulkValue = [{ value, path: fullPath, params }];
                          for (const listenerId in listenersCollection.listeners) {
                              const listener = listenersCollection.listeners[listenerId];
                              const eventInfo = {
                                  type,
                                  listener,
                                  listenersCollection,
                                  path: {
                                      listener: listenerPath,
                                      update: originalPath ? originalPath : updatePath,
                                      resolved: this.cleanNotRecursivePath(fullPath)
                                  },
                                  params,
                                  options
                              };
                              if (listener.options.bulk) {
                                  if (!listeners[notifyPath].bulk.some((bulkListener) => bulkListener.listener === listener)) {
                                      listeners[notifyPath].bulk.push({ listener, listenersCollection, eventInfo, value: bulkValue });
                                  }
                              }
                              else {
                                  listeners[notifyPath].single.push({
                                      listener,
                                      listenersCollection,
                                      eventInfo,
                                      value
                                  });
                              }
                          }
                      }
                  }
              }
          }
          return listeners;
      }
      notifyOnly(updatePath, newValue, options, type = 'update', originalPath = null) {
          return (typeof this.notifyListeners(this.getNotifyOnlyListeners(updatePath, newValue, options, type, originalPath))[0] !==
              'undefined');
      }
      canBeNested(newValue) {
          return typeof newValue === 'object' && newValue !== null;
      }
      getUpdateValues(oldValue, split, fn) {
          if (typeof oldValue === 'object' && oldValue !== null) {
              Array.isArray(oldValue) ? (oldValue = oldValue.slice()) : (oldValue = Object.assign({}, oldValue));
          }
          let newValue = fn;
          if (typeof fn === 'function') {
              newValue = fn(this.pathGet(split, this.data));
          }
          return { newValue, oldValue };
      }
      wildcardUpdate(updatePath, fn, options = defaultUpdateOptions) {
          options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
          const scanned = this.scan.get(updatePath);
          const bulk = {};
          for (const path in scanned) {
              const split = this.split(path);
              const { oldValue, newValue } = this.getUpdateValues(scanned[path], split, fn);
              if (!this.same(newValue, oldValue))
                  bulk[path] = newValue;
          }
          const groupedListenersPack = [];
          for (const path in bulk) {
              const newValue = bulk[path];
              if (options.only.length) {
                  groupedListenersPack.push(this.getNotifyOnlyListeners(path, newValue, options, 'update', updatePath));
              }
              else {
                  groupedListenersPack.push(this.getSubscribedListeners(path, newValue, options, 'update', updatePath));
                  this.canBeNested(newValue) &&
                      groupedListenersPack.push(this.getNestedListeners(path, newValue, options, 'update', updatePath));
              }
              options.debug && this.options.log('Wildcard update', { path, newValue });
              this.pathSet(this.split(path), newValue, this.data);
          }
          let alreadyNotified = [];
          for (const groupedListeners of groupedListenersPack) {
              alreadyNotified = [...alreadyNotified, ...this.notifyListeners(groupedListeners, alreadyNotified)];
          }
      }
      update(updatePath, fn, options = defaultUpdateOptions) {
          if (this.isWildcard(updatePath)) {
              return this.wildcardUpdate(updatePath, fn, options);
          }
          const split = this.split(updatePath);
          const { oldValue, newValue } = this.getUpdateValues(this.pathGet(split, this.data), split, fn);
          if (options.debug) {
              this.options.log(`Updating ${updatePath} ${options.source ? `from ${options.source}` : ''}`, oldValue, newValue);
          }
          if (this.same(newValue, oldValue)) {
              return newValue;
          }
          this.pathSet(split, newValue, this.data);
          options = Object.assign(Object.assign({}, defaultUpdateOptions), options);
          if (this.notifyOnly(updatePath, newValue, options)) {
              return newValue;
          }
          const alreadyNotified = this.notifySubscribedListeners(updatePath, newValue, options);
          if (this.canBeNested(newValue)) {
              this.notifyNestedListeners(updatePath, newValue, options, 'update', alreadyNotified);
          }
          return newValue;
      }
      get(userPath = undefined) {
          if (typeof userPath === 'undefined' || userPath === '') {
              return this.data;
          }
          return this.pathGet(this.split(userPath), this.data);
      }
      debugSubscribe(listener, listenersCollection, listenerPath) {
          if (listener.options.debug) {
              this.options.log('listener subscribed', listenerPath, listener, listenersCollection);
          }
      }
      debugListener(time, groupedListener) {
          if (groupedListener.eventInfo.options.debug || groupedListener.listener.options.debug) {
              this.options.log('Listener fired', {
                  time: Date.now() - time,
                  info: groupedListener
              });
          }
      }
      debugTime(groupedListener) {
          return groupedListener.listener.options.debug || groupedListener.eventInfo.options.debug ? Date.now() : 0;
      }
  }
  //# sourceMappingURL=index.js.map

  // @ts-nocheck
  const lib = 'gantt-shedule-timeline-calendar';
  /**
   * Helper function to determine if specified variable is an object
   *
   * @param {any} item
   *
   * @returns {boolean}
   */
  function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Helper function which will merge objects recursively - creating brand new one - like clone
   *
   * @param {object} target
   * @params {object} sources
   *
   * @returns {object}
   */
  function mergeDeep(target, ...sources) {
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (typeof target[key] === 'undefined') {
            target[key] = {};
          }
          target[key] = mergeDeep(target[key], source[key]);
        } else if (Array.isArray(source[key])) {
          target[key] = [];
          for (let item of source[key]) {
            if (isObject(item)) {
              target[key].push(mergeDeep({}, item));
              continue;
            }
            target[key].push(item);
          }
        } else {
          target[key] = source[key];
        }
      }
    }
    if (!sources.length) {
      return target;
    }
    return mergeDeep(target, ...sources);
  }

  function mergeActions(userConfig) {
    const defaultConfigActions = mergeDeep({}, defaultConfig.actions);
    const userActions = mergeDeep({}, userConfig.actions);
    const allActionNames = [Object.keys(defaultConfigActions), Object.keys(userActions)].flatMap((item, index, all) => {
      if (index === 1) {
        return item.filter(i => !all[0].includes(i));
      }
      return item;
    });
    const actions = {};
    for (const actionName of allActionNames) {
      actions[actionName] = [];
      if (typeof defaultConfigActions[actionName] !== 'undefined' && Array.isArray(defaultConfigActions[actionName])) {
        actions[actionName] = [...defaultConfigActions[actionName]];
      }
      if (typeof userActions[actionName] !== 'undefined' && Array.isArray(userActions[actionName])) {
        actions[actionName] = [...actions[actionName], ...userActions[actionName]];
      }
    }
    delete userConfig.actions;
    delete defaultConfig.actions;
    return actions;
  }

  function stateFromConfig(userConfig) {
    const actions = mergeActions(userConfig);
    const state = { config: mergeDeep({}, defaultConfig, userConfig) };
    state.config.actions = actions;
    return new DeepState(state, { delimeter: '.' });
  }

  const publicApi = {
    name: lib,
    stateFromConfig,
    mergeDeep,
    date(time) {
      return time ? dayjs_min(time).utc() : dayjs_min().utc();
    },
    dayjs: dayjs_min
  };

  function getInternalApi(state) {
    let $state = state.get();
    let unsubscribers = [];
    const api = {
      name: lib,
      debug: false,

      log(...args) {
        if (this.debug) {
          console.log.call(console, ...args);
        }
      },

      mergeDeep,

      getComponentData(componentName, attrs) {
        const componentData = {};
        componentData.componentName = componentName;
        componentData.className = this.getClass(componentName, attrs);
        componentData.action = this.getAction(componentName);
        return componentData;
      },

      getClass(name, attrs) {
        let simple = `${lib}__${name}`;
        if (name === this.name) {
          simple = this.name;
        }
        let className = `${simple} `;
        let postfix = '-';
        if (typeof attrs !== 'undefined') {
          for (const key in attrs) {
            if (attrs[key].constructor.name === 'Object' && typeof attrs[key].id !== 'undefined') {
              postfix += `-${key}_${attrs[key].id}`;
              return className + className.trim() + postfix;
            }
            if (typeof attrs[key] === 'string' || typeof attrs[key] === 'number') {
              postfix += `-${key}_${attrs[key]}`;
            }
          }
        }
        if (postfix != '-') {
          className += simple + postfix + ' ';
        }
        if (typeof $state.config.classNames[name] !== 'undefined') {
          state.get(`config.classNames.${name}`).forEach(customClass => (className += customClass + ' '));
        }
        if (typeof $state.config.classNames[name + postfix] !== 'undefined') {
          state.get(`config.classNames.${name + postfix}`).forEach(customClass => (className += customClass + ' '));
        }
        return className.trim();
      },

      actionsExecutor(node, data) {
        const name = this.name;
        const actionResults = [];
        for (const action of $state.config.actions[name]) {
          actionResults.push(action(node, data));
        }
        return {
          update(data) {
            for (const result of actionResults) {
              if (result && typeof result.update === 'function') {
                result.update(data);
              }
            }
          },
          destroy() {
            for (const result of actionResults) {
              if (result && typeof result.destroy === 'function') {
                result.destroy();
              }
            }
          }
        };
      },

      allActions: [],

      getAction(name) {
        if (!this.allActions.includes(name)) this.allActions.push(name);
        if (typeof $state.config.actions[name] === 'undefined') {
          return () => {};
        }
        return this.actionsExecutor.bind({ name });
      },

      isItemInViewport(item, left, right) {
        return (item.time.start >= left && item.time.start < right) || (item.time.end >= left && item.time.end < right);
      },

      fillEmptyRowValues(rows) {
        let top = 0;
        for (const rowId in rows) {
          const row = rows[rowId];
          row._internal = {
            parents: [],
            children: [],
            items: []
          };
          if (typeof row.height !== 'number') {
            row.height = $state.config.list.rowHeight;
          }
          if (typeof row.expanded !== 'boolean') {
            row.expanded = false;
          }
          row.top = top;
          top += row.height;
        }
        return rows;
      },

      generateParents(rows, parentName = 'parentId') {
        const parents = {};
        for (const row of rows) {
          const parentId = typeof row[parentName] !== 'undefined' ? row[parentName] : '';
          if (typeof parents[parentId] === 'undefined') {
            parents[parentId] = {};
          }
          parents[parentId][row.id] = row;
        }
        return parents;
      },

      fastTree(rowParents, node, parents = []) {
        const children = rowParents[node.id];
        node._internal.parents = parents;
        if (typeof children === 'undefined') {
          node._internal.children = [];
          return node;
        }
        if (node.id !== '') {
          parents = [...parents, node.id];
        }
        node._internal.children = Object.values(children);
        for (const childrenId in children) {
          const child = children[childrenId];
          this.fastTree(rowParents, child, parents);
        }
        return node;
      },

      makeTreeMap(rows, items) {
        const itemParents = this.generateParents(items, 'rowId');
        for (const row of rows) {
          row._internal.items = typeof itemParents[row.id] !== 'undefined' ? Object.values(itemParents[row.id]) : [];
        }
        const rowParents = this.generateParents(rows);
        const tree = { id: '', _internal: { children: [], parents: [], items: [] } };
        return this.fastTree(rowParents, tree);
      },

      getFlatTreeMapById(treeMap, flatTreeMapById = {}) {
        for (const child of treeMap._internal.children) {
          flatTreeMapById[child.id] = child;
          this.getFlatTreeMapById(child, flatTreeMapById);
        }
        return flatTreeMapById;
      },

      flattenTreeMap(treeMap, rows = []) {
        for (const child of treeMap._internal.children) {
          rows.push(child.id);
          this.flattenTreeMap(child, rows);
        }
        return rows;
      },

      getRowsFromMap(flatTreeMap, rows) {
        return flatTreeMap.map(node => rows[node.id]);
      },

      getRowsFromIds(ids, rows) {
        const result = [];
        for (const id of ids) {
          result.push(rows[id]);
        }
        return result;
      },

      getRowsWithParentsExpanded(flatTreeMap, flatTreeMapById, rows) {
        const rowsWithParentsExpanded = [];
        next: for (const rowId of flatTreeMap) {
          for (const parentId of flatTreeMapById[rowId]._internal.parents) {
            const parent = rows[parentId];
            if (!parent.expanded) {
              continue next;
            }
          }
          rowsWithParentsExpanded.push(rowId);
        }
        return rowsWithParentsExpanded;
      },

      getRowsHeight(rows) {
        let height = 0;
        for (let row of rows) {
          height += row.height;
        }
        return height;
      },

      /**
       * Get visible rows - get rows that are inside current viewport (height)
       *
       * @param {array} rowsWithParentsExpanded rows that have parent expanded- they are visible
       */
      getVisibleRows(rowsWithParentsExpanded) {
        const rows = [];
        let currentOffset = 0;
        let rowOffset = 0;
        for (const row of rowsWithParentsExpanded) {
          if (
            currentOffset + row.height > $state.config.scroll.top &&
            currentOffset < $state.config.scroll.top + $state._internal.height
          ) {
            row.top = rowOffset;
            rowOffset += row.height;
            rows.push(row);
          }
          if (currentOffset > $state.config.scroll.top + $state._internal.height) {
            break;
          }
          currentOffset += row.height;
        }
        return rows;
      },

      /**
       * Normalize mouse wheel event to get proper scroll metrics
       *
       * @param {Event} event mouse wheel event
       */
      normalizeMouseWheelEvent(event) {
        let x = event.deltaX || 0;
        let y = event.deltaY || 0;
        let z = event.deltaZ || 0;
        const mode = event.deltaMode;
        const lineHeight = parseInt(getComputedStyle(event.target).getPropertyValue('line-height'));
        let scale = 1;
        switch (mode) {
          case 1:
            scale = lineHeight;
            break;
          case 2:
            scale = window.height;
            break;
        }
        x *= scale;
        y *= scale;
        z *= scale;
        return { x, y, z };
      },

      limitScroll(which, scroll) {
        if (which === 'top') {
          const height = state.get('_internal.list.expandedHeight') - state.get('_internal.height');
          if (scroll < 0) {
            scroll = 0;
          } else if (scroll > height) {
            scroll = height;
          }
          return scroll;
        } else {
          const width =
            state.get('_internal.chart.time.totalViewDurationPx') - state.get('_internal.chart.dimensions.width');
          if (scroll < 0) {
            scroll = 0;
          } else if (scroll > width) {
            scroll = width;
          }
          return scroll;
        }
      },

      time: timeApi(state),

      /**
       * Get scrollbar height - compute it from element
       *
       * @returns {number}
       */
      getScrollBarHeight() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.height = '100px';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
        var noScroll = outer.offsetHeight;
        outer.style.overflow = 'scroll';
        var inner = document.createElement('div');
        inner.style.height = '100%';
        outer.appendChild(inner);
        var withScroll = inner.offsetHeight;
        outer.parentNode.removeChild(outer);
        return noScroll - withScroll + 1; // +1 for scroll area inside scroll container
      },

      /**
       * Destroy things to release memory
       */
      destroy() {
        $state = undefined;
        for (const unsubscribe of unsubscribers) {
          unsubscribe();
        }
        unsubscribers = [];
        if (api.debug) {
          delete window.state;
        }
      }
    };

    if (api.debug) {
      window.state = state;
      window.api = api;
    }

    return api;
  }

  function ListToggle(props, { api, state, onDestroy, action, update, html, unsafeHTML }) {
      const componentName = 'list-expander-toggle';
      let className, componentAction, style;
      let classNameOpen, classNameClosed;
      let expanded = false;
      let iconOpen, iconClosed;
      onDestroy(state.subscribe('config.classNames', value => {
          if (props.row) {
              className = api.getClass(componentName, { row: props.row });
              classNameOpen = api.getClass(componentName + '-open', { row: props.row });
              classNameClosed = api.getClass(componentName + '-closed', { row: props.row });
          }
          else {
              className = api.getClass(componentName);
              classNameOpen = api.getClass(componentName + '-open');
              classNameClosed = api.getClass(componentName + '-closed');
          }
          componentAction = api.getAction(componentName);
          update();
      }));
      onDestroy(state.subscribeAll(['config.list.expander.size', 'config.list.expander.icons'], () => {
          const expander = state.get('config.list.expander');
          style = `--size: ${expander.size}px`;
          iconOpen = expander.icons.open;
          iconClosed = expander.icons.closed;
          update();
      }));
      if (props.row) {
          onDestroy(state.subscribe(`config.list.rows.${props.row.id}.expanded`, isExpanded => {
              expanded = isExpanded;
              update();
          }));
      }
      else {
          onDestroy(state.subscribe('config.list.rows.*.expanded', bulk => {
              for (const rowExpanded of bulk) {
                  if (rowExpanded.value) {
                      expanded = true;
                      break;
                  }
              }
              update();
          }, { bulk: true }));
      }
      function toggle() {
          expanded = !expanded;
          if (props.row) {
              state.update(`config.list.rows.${props.row.id}.expanded`, expanded);
          }
          else {
              state.update(`config.list.rows`, rows => {
                  for (const rowId in rows) {
                      rows[rowId].expanded = expanded;
                  }
                  return rows;
              }, { only: ['*.expanded'] });
          }
      }
      return () => html `
    <div
      class=${className}
      data-action=${action(componentAction, { row: props.row, api, state })}
      style=${style}
      @click=${toggle}
    >
      ${expanded
        ? html `
            <div class=${classNameOpen}>
              ${unsafeHTML(iconOpen)}
            </div>
          `
        : html `
            <div class=${classNameClosed}>
              ${unsafeHTML(iconClosed)}
            </div>
          `}
    </div>
  `;
  }
  //# sourceMappingURL=ListToggle.js.map

  function ListExpander(props, { api, state, onDestroy, action, update, html, createComponent }) {
      const componentName = 'list-expander';
      const componentAction = api.getAction(componentName);
      let className, padding, width, paddingClass, children = [];
      onDestroy(state.subscribe('config.classNames', value => {
          if (props.row) {
              className = api.getClass(componentName, { row: props.row });
              paddingClass = api.getClass(componentName + '-padding', { row: props.row });
          }
          else {
              className = api.getClass(componentName);
              paddingClass = api.getClass(componentName + '-padding');
          }
          update();
      }));
      onDestroy(state.subscribeAll(['config.list.expander.padding'], value => {
          padding = value;
          update();
      }));
      if (props.row) {
          onDestroy(state.subscribe(`_internal.list.rows.${props.row.id}.parentId`, parentId => {
              width = 'width:' + props.row._internal.parents.length * padding + 'px';
              children = props.row._internal.children;
              update();
          }));
      }
      else {
          width = 'width:0px';
          children = [];
      }
      // @ts-ignore
      const listToggle = createComponent(ListToggle, props.row ? { row: props.row } : {});
      onDestroy(listToggle.destroy);
      return () => html `
    <div class=${className} data-action=${action(componentAction, { row: props.row, api, state })}>
      <div class=${paddingClass} style=${width}></div>
      ${children.length || !props.row ? listToggle.html() : ''}
    </div>
  `;
  }
  //# sourceMappingURL=ListExpander.js.map

  function ListColumnRow({ rowId, columnId }, core) {
      const { api, state, onDestroy, action, update, html, createComponent } = core;
      let row, rowPath = `config.list.rows.${rowId}`;
      let style;
      onDestroy(state.subscribe(rowPath, value => {
          row = value;
          style = `--height: ${row.height}px`;
          update();
      }));
      let column, columnPath = `config.list.columns.data.${columnId}`;
      onDestroy(state.subscribe(columnPath, val => {
          column = val;
          update();
      }));
      const componentName = 'list-column-row';
      const componentAction = api.getAction(componentName);
      let className;
      onDestroy(state.subscribe('config.classNames', value => {
          className = api.getClass(componentName, { row, column });
          update();
      }));
      function getHtml() {
          if (typeof column.data === 'function')
              return html `
        ${column.data(row)}
      `;
          return html `
      ${row[column.data]}
    `;
      }
      function getText() {
          if (typeof column.data === 'function')
              return column.data(row);
          return row[column.data];
      }
      const listExpander = createComponent(ListExpander, { row });
      onDestroy(listExpander.destroy);
      return props => html `
    <div
      class=${className}
      style=${style}
      data-action=${action(componentAction, {
        column,
        row,
        api,
        state
    })}
    >
      ${typeof column.expander === 'boolean' && column.expander ? listExpander.html() : ''}
      ${typeof column.html === 'string' ? getHtml() : getText()}
    </div>
  `;
  }
  //# sourceMappingURL=ListColumnRow.js.map

  function ListColumnHeaderResizer({ columnId }, core) {
      const { api, state, onDestroy, update, html, action } = core;
      const componentName = 'list-column-header-resizer';
      const componentAction = api.getAction(componentName);
      let column;
      onDestroy(state.subscribe(`config.list.columns.data.${columnId}`, val => {
          column = val;
          update();
      }));
      let className, containerClass, dotsClass, dotClass, lineClass, calculatedWidth, dotsWidth;
      let inRealTime = false;
      onDestroy(state.subscribe('config.classNames', value => {
          className = api.getClass(componentName, { column });
          containerClass = api.getClass(componentName + '-container', { column });
          dotsClass = api.getClass(componentName + '-dots', { column });
          dotClass = api.getClass(componentName + '-dots-dot', { column });
          lineClass = api.getClass(componentName + '-line', { column });
          update();
      }));
      onDestroy(state.subscribeAll([
          `config.list.columns.data.${column.id}.width`,
          'config.list.columns.percent',
          'config.list.columns.resizer.width',
          'config.list.columns.resizer.inRealTime'
      ], (value, path) => {
          const list = state.get('config.list');
          calculatedWidth = column.width * list.columns.percent * 0.01;
          dotsWidth = `width: ${list.columns.resizer.width}px`;
          inRealTime = list.columns.resizer.inRealTime;
          update();
      }));
      let dots = [1, 2, 3, 4, 5, 6, 7, 8];
      onDestroy(state.subscribe('config.list.columns.resizer.dots', value => {
          dots = [];
          for (let i = 0; i < value; i++) {
              dots.push(i);
          }
          update();
      }));
      let isMoving = false;
      let left = calculatedWidth;
      const columnWidthPath = `config.list.columns.data.${column.id}.width`;
      function onMouseDown(event) {
          isMoving = true;
          state.update('_internal.list.columns.resizer.active', true);
      }
      function onMouseMove(event) {
          if (isMoving) {
              left += event.movementX;
              if (left < 0) {
                  left = 0;
              }
              if (inRealTime) {
                  state.update(columnWidthPath, left);
              }
          }
      }
      function onMouseUp(event) {
          if (isMoving) {
              state.update('_internal.list.columns.resizer.active', false);
              state.update(columnWidthPath, left);
              isMoving = false;
          }
      }
      document.body.addEventListener('mousemove', onMouseMove);
      onDestroy(() => document.body.removeEventListener('mousemove', onMouseMove));
      document.body.addEventListener('mouseup', onMouseUp);
      onDestroy(() => document.body.removeEventListener('mouseup', onMouseUp));
      return props => html `
    <div class=${className} data-action=${action(componentAction, { column, api, state })}>
      <div class=${containerClass}>
        ${column.header.html
        ? html `
              ${column.header.html}
            `
        : column.header.content}
      </div>
      <div class=${dotsClass} style=${'--' + dotsWidth} @mousedown=${onMouseDown}>
        ${dots.map(dot => html `
              <div class=${dotClass} />
            `)}
      </div>
    </div>
  `;
  }
  //# sourceMappingURL=ListColumnHeaderResizer.js.map

  function ListColumnHeader({ columnId }, core) {
      const { api, state, onDestroy, action, update, createComponent, html } = core;
      const componentName = 'list-column-header';
      const componentAction = api.getAction(componentName);
      let column;
      onDestroy(state.subscribe(`config.list.columns.data.${columnId}`, val => {
          column = val;
          update();
      }));
      let className, contentClass, style;
      onDestroy(state.subscribeAll(['config.classNames', 'config.headerHeight'], () => {
          const value = state.get('config');
          className = api.getClass(componentName, { column });
          contentClass = api.getClass(componentName + '-content', { column });
          style = `--height: ${value.headerHeight}px;`;
          update();
      }));
      const ListColumnHeaderResizer$1 = createComponent(ListColumnHeaderResizer, { columnId });
      onDestroy(ListColumnHeaderResizer$1.destroy);
      // @ts-ignore
      const listExpander = createComponent(ListExpander, {});
      onDestroy(listExpander.destroy);
      function withExpander() {
          return html `
      <div class=${contentClass}>
        ${listExpander.html()}${ListColumnHeaderResizer$1.html(column)}
      </div>
    `;
      }
      function withoutExpander() {
          return html `
      <div class=${contentClass}>
        ${ListColumnHeaderResizer$1.html(column)}
      </div>
    `;
      }
      return function () {
          return html `
      <div class=${className} style=${style} data-action=${action(componentAction, { column, api, state })}>
        ${typeof column.expander === 'boolean' && column.expander ? withExpander() : withoutExpander()}
      </div>
    `;
      };
  }
  //# sourceMappingURL=ListColumnHeader.js.map

  function ListColumnComponent({ columnId }, core) {
      const { api, state, onDestroy, action, update, createComponent, html, repeat } = core;
      let column, columnPath = `config.list.columns.data.${columnId}`;
      onDestroy(state.subscribe(columnPath, val => {
          column = val;
          update();
      }));
      const componentName = 'list-column';
      const rowsComponentName = componentName + '-rows';
      const componentAction = api.getAction(componentName);
      const rowsAction = api.getAction(rowsComponentName);
      let className, classNameContainer, calculatedWidth, width, styleContainer;
      onDestroy(state.subscribe('config.classNames', value => {
          className = api.getClass(componentName, { column });
          classNameContainer = api.getClass(rowsComponentName, { column });
          update();
      }));
      let visibleRows = [];
      onDestroy(state.subscribe('_internal.list.visibleRows;', val => {
          visibleRows.forEach(row => row.component.destroy());
          visibleRows = val.map(row => ({
              id: row.id,
              component: createComponent(ListColumnRow, { columnId, rowId: row.id })
          }));
          update();
      }));
      onDestroy(() => {
          visibleRows.forEach(row => row.component.destroy());
      });
      onDestroy(state.subscribeAll([
          'config.list.columns.percent',
          'config.list.columns.resizer.width',
          `config.list.columns.data.${column.id}.width`,
          'config.height',
          'config.headerHeight'
      ], bulk => {
          const list = state.get('config.list');
          calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
          width = `width: ${calculatedWidth + list.columns.resizer.width}px`;
          styleContainer = `height: ${state.get('config.height')}px`;
      }, { bulk: true }));
      const ListColumnHeader$1 = createComponent(ListColumnHeader, { columnId });
      onDestroy(ListColumnHeader$1.destroy);
      return props => html `
    <div class=${className} data-action=${action(componentAction, { column, state: state, api: api })} style=${width}>
      ${ListColumnHeader$1.html()}
      <div class=${classNameContainer} style=${styleContainer} data-action=${action(rowsAction, { api, state })}>
        ${visibleRows.map(row => row.component.html())}
      </div>
    </div>
  `;
  }
  //# sourceMappingURL=ListColumn.js.map

  function List(core) {
      const { api, state, onDestroy, action, update, createComponent, html, repeat } = core;
      const componentName = 'list';
      const componentAction = api.getAction(componentName);
      let className;
      let list, percent;
      onDestroy(state.subscribe('config.list', () => {
          list = state.get('config.list');
          percent = list.columns.percent;
          update();
      }));
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName, { list });
          update();
      }));
      let columns, listColumns = [];
      onDestroy(state.subscribe('config.list.columns.data;', data => {
          // only 'config.list.columns.data;' because listcolumn component will watch nested values
          listColumns.forEach(ls => ls.component.destroy());
          columns = Object.keys(data);
          listColumns = columns.map(columnId => {
              const component = createComponent(ListColumnComponent, {
                  columnId
              });
              return { id: columnId, component };
          });
          update();
      }));
      onDestroy(() => {
          listColumns.forEach(c => c.component.destroy());
      });
      let style;
      onDestroy(state.subscribe('config.height', height => {
          style = `height: ${height}px`;
          update();
      }));
      function onScroll(event) {
          if (event.type === 'scroll') {
              state.update('config.scroll.top', event.target.scrollTop);
          }
          else {
              const wheel = api.normalizeMouseWheelEvent(event);
              state.update('config.scroll.top', top => {
                  return api.limitScroll('top', (top += wheel.y * state.get('config.scroll.yMultiplier')));
              });
          }
      }
      let width;
      function mainAction(element) {
          if (!width) {
              width = element.clientWidth;
              if (percent === 0) {
                  width = 0;
              }
              state.update('_internal.list.width', width);
              state.update('_internal.elements.List', element);
          }
          if (typeof action === 'function') {
              componentAction(element, { list, columns, state, api });
          }
      }
      return props => list.columns.percent > 0
          ? html `
          <div
            class=${className}
            data-action=${action(mainAction)}
            style=${style}
            @scroll=${onScroll}
            @wheel=${onScroll}
          >
            ${listColumns.map(c => c.component.html())}
          </div>
        `
          : null;
  }
  //# sourceMappingURL=List.js.map

  function CalendarDate({ date }, core) {
      const { api, state, onDestroy, action, update, createComponent, html, repeat } = core;
      const componentName = 'chart-calendar-date';
      const componentAction = api.getAction(componentName);
      let className, formattedClassName, formattedYearClassName, formattedMonthClassName, formattedDayClassName, formattedDayWordClassName;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName, { date });
          formattedClassName = api.getClass(`${componentName}-formatted`, { date });
          formattedYearClassName = api.getClass(`${componentName}-formatted-year`, { date });
          formattedMonthClassName = api.getClass(`${componentName}-formatted-month`, { date });
          formattedDayClassName = api.getClass(`${componentName}-formatted-day`, { date });
          formattedDayWordClassName = api.getClass(`${componentName}-formatted-day-word`, { date });
          update();
      }));
      let time, period, small, smallFormatted, year, month, day, dayWord, style, daySize;
      onDestroy(state.subscribeAll(['_internal.chart.time', 'config.chart.calendar.vertical.smallFormat'], function updateDate() {
          time = state.get('_internal.chart.time');
          daySize = time.zoom <= 22 ? 18 : 13;
          period = time.period;
          const dateMod = api.time.date(date.leftGlobal);
          const maxWidth = time.maxWidth;
          small = maxWidth <= 40;
          const smallFormat = state.get('config.chart.calendar.vertical.smallFormat');
          smallFormatted = dateMod.format(smallFormat);
          year = dateMod.format('YYYY');
          month = dateMod.format('MMMM');
          day = dateMod.format('DD');
          dayWord = dateMod.format('dddd');
          if (maxWidth <= 70) {
              year = dateMod.format('YY');
              month = dateMod.format('MMM');
              day = dateMod.format('DD');
              dayWord = dateMod.format('ddd');
          }
          else if (maxWidth <= 150) {
              dayWord = dateMod.format('ddd');
          }
          style = `width: ${date.width}px; margin-left:-${date.subPx}px; --day-size: ${daySize}px`;
          update();
      }, { bulk: true }));
      return props => html `
    <div class=${className} style=${style} data-action=${action(componentAction, { date, api, state })}>
      ${small
        ? html `
            <div class=${formattedClassName} style="transform: rotate(90deg);">${smallFormatted}</div>
          `
        : html `
            <div class=${formattedClassName}>
              <div class=${formattedYearClassName}>${year}</div>
              <div class=${formattedMonthClassName}>${month}</div>
              <div class=${formattedDayClassName}>${day}</div>
              <div class=${formattedDayWordClassName}>${dayWord}</div>
            </div>
          `}
    </div>
  `;
  }
  //# sourceMappingURL=CalendarDate.js.map

  function Calendar(core) {
      const { api, state, onDestroy, action, update, createComponent, html, repeat } = core;
      const componentName = 'chart-calendar';
      const componentAction = api.getAction(componentName);
      let className;
      onDestroy(state.subscribe('config.classNames', value => {
          className = api.getClass(componentName);
          update();
      }));
      let headerHeight, style = '';
      onDestroy(state.subscribe('config.headerHeight', value => {
          headerHeight = value;
          style = `height: ${headerHeight}px;`;
          update();
      }));
      let dates, datesComponents = [];
      onDestroy(state.subscribe('_internal.chart.time.dates', value => {
          dates = value;
          datesComponents.forEach(date => date.component.destroy());
          datesComponents = [];
          for (const date of dates) {
              datesComponents.push({ id: date.id, component: createComponent(CalendarDate, { date }) });
          }
          update();
      }));
      onDestroy(() => {
          datesComponents.forEach(date => date.component.destroy());
      });
      function mainAction(element) {
          state.update('_internal.elements.Calendar', element);
          if (typeof componentAction === 'function') {
              componentAction({ api, state });
          }
      }
      return props => html `
    <div class=${className} data-action=${action(mainAction)} style=${style}>
      ${repeat(datesComponents, d => d.id, d => d.component.html())}
    </div>
  `;
  }
  //# sourceMappingURL=Calendar.js.map

  function GanttGridBlock({ row, time, top }, core) {
      const { api, state, onDestroy, action, update, html } = core;
      const componentName = 'chart-gantt-grid-block';
      const componentAction = api.getAction(componentName, { row, time, top });
      let className = api.getClass(componentName, { row });
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName);
          update();
      }));
      let style = `width: ${time.width}px;height: 100%;margin-left:-${time.subPx}px`;
      return props => html `
      <div class=${className} data-action=${action(componentAction, { row, time, top, api, state })} style=${style} />
    `;
  }
  //# sourceMappingURL=GanttGridBlock.js.map

  function GanttGridRow({ row }, core) {
      const { api, state, onDestroy, action, update, html, createComponent, repeat } = core;
      const componentName = 'chart-gantt-grid-row';
      const componentAction = api.getAction(componentName, { row });
      let className;
      onDestroy(state.subscribe('config.classNames', value => {
          className = api.getClass(componentName, { row });
          update();
      }));
      let rowsBlocksComponents = [];
      for (const block of row.blocks) {
          rowsBlocksComponents.push({
              id: block.id,
              component: createComponent(GanttGridBlock, { row, time: block.date, top: block.top })
          });
      }
      onDestroy(() => {
          rowsBlocksComponents.forEach(row => row.component.destroy());
      });
      let style = `height: ${row.rowData.height}px;`;
      return props => html `
    <div class=${className} data-action=${action(componentAction, { row, api, state })} style=${style}>
      ${rowsBlocksComponents.map(r => r.component.html())}
    </div>
  `;
  }
  //# sourceMappingURL=GanttGridRow.js.map

  //import GridBlock from './GanttGridBlock.svelte';
  function GanttGrid(core) {
      const { api, state, onDestroy, action, update, html, createComponent, repeat } = core;
      const componentName = 'chart-gantt-grid';
      const componentAction = api.getAction(componentName);
      let className;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName);
          update();
      }));
      let height, style;
      onDestroy(state.subscribe('_internal.height', h => {
          height = h;
          style = `height: ${height}px`;
          update();
      }));
      let rows, rowsComponents = [];
      onDestroy(state.subscribeAll(['_internal.chart.time.dates', '_internal.list.visibleRows', 'config.chart.grid.block'], function generateBlocks() {
          const rowsData = state.get('_internal.list.visibleRows');
          const dates = state.get('_internal.chart.time.dates');
          rowsComponents.forEach(row => row.component.destroy());
          rowsComponents = [];
          let top = 0;
          rows = [];
          for (const rowId in rowsData) {
              const rowData = rowsData[rowId];
              const blocks = [];
              let index = 0;
              for (const date of dates) {
                  blocks.push({ id: index++, date, row: rowData, top });
              }
              const row = { id: rowData.id, blocks, rowData, top };
              rows.push(row);
              rowsComponents.push({ id: rowData.id, component: createComponent(GanttGridRow, { row }) });
              top += rowData.height;
              update();
          }
      }, { bulk: true }));
      onDestroy(() => {
          rowsComponents.forEach(row => row.component.destroy());
      });
      return props => html `
    <div class=${className} data-action=${action(componentAction, { api, state })} style=${style}>
      ${rowsComponents.map(r => r.component.html())}
    </div>
  `;
  }
  //# sourceMappingURL=GanttGrid.js.map

  function GanttItemsRowItem({ rowId, itemId }, core) {
      const { api, state, onDestroy, action, update, html } = core;
      let row, rowPath = `config.list.rows.${rowId}`;
      onDestroy(state.subscribe(rowPath, value => {
          row = value;
          update();
      }));
      let item, itemPath = `config.chart.items.${itemId}`;
      onDestroy(state.subscribe(itemPath, value => {
          item = value;
          update();
      }));
      const componentName = 'chart-gantt-items-row-item';
      const componentAction = api.getAction(componentName, { row, item });
      let className, contentClassName, labelClassName;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName, { row, item });
          contentClassName = api.getClass(componentName + '-content', { row, item });
          labelClassName = api.getClass(componentName + '-content-label', { row, item });
          update();
      }));
      let style, itemLeftPx = 0, itemWidthPx = 0;
      onDestroy(state.subscribeAll(['_internal.chart.time', 'config.scroll'], bulk => {
          let time = state.get('_internal.chart.time');
          itemLeftPx = (item.time.start - time.from) / time.timePerPixel;
          itemWidthPx = (item.time.end - item.time.start) / time.timePerPixel;
          const inViewPort = api.isItemInViewport(item, time.leftGlobal, time.rightGlobal);
          style = `left:${itemLeftPx}px;width:${itemWidthPx}px;${inViewPort ? 'display:block;' : 'visibility:hidden;'}`;
          update();
      }, { bulk: true }));
      return props => html `
    <div
      class=${className}
      data-action=${action(componentAction, { item, row, left: itemLeftPx, width: itemWidthPx, api, state })}
      style=${style}
    >
      <div class=${contentClassName}>
        <div class=${labelClassName}">${item.label}</div>
      </div>
    </div>
  `;
  }
  //# sourceMappingURL=GanttItemsRowItem.js.map

  function GanttItemsRow({ rowId }, core) {
      const { api, state, onDestroy, action, update, html, createComponent, repeat } = core;
      let rowPath = `_internal.flatTreeMapById.${rowId}`;
      let row, element, style, styleInner;
      onDestroy(state.subscribeAll([rowPath, '_internal.chart'], bulk => {
          row = state.get(rowPath);
          const chart = state.get('_internal.chart');
          style = `width:${chart.dimensions.width}px;height:${row.height}px;--row-height:${row.height}px;`;
          styleInner = `width: ${chart.time.totalViewDurationPx}px;height: 100%;`;
          if (element) {
              element.scrollLeft = chart.time.leftPx;
          }
          update();
      }));
      let items, itemComponents = [];
      onDestroy(state.subscribe(`_internal.flatTreeMapById.${rowId}._internal.items;`, value => {
          items = value;
          itemComponents.forEach(item => item.component.destroy());
          itemComponents = [];
          for (const item of items) {
              itemComponents.push({ id: item.id, component: createComponent(GanttItemsRowItem, { rowId, itemId: item.id }) });
          }
          update();
      }));
      onDestroy(() => {
          itemComponents.forEach(item => item.component.destroy());
      });
      const componentName = 'chart-gantt-items-row';
      const componentNameInner = componentName + '-inner';
      const componentAction = api.getAction(componentName, { row });
      let className, classNameInner;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName, { row });
          classNameInner = api.getClass(componentNameInner, { row });
          update();
      }));
      function mainAction(el) {
          element = el;
          if (typeof componentAction === 'function') {
              componentAction({ row, api, state });
          }
      }
      return props => html `
    <div class=${className} data-action=${action(mainAction)} style=${style}>
      <div class=${classNameInner} style=${styleInner}>
        ${repeat(itemComponents, i => i.id, i => i.component.html())}
      </div>
    </div>
  `;
  }
  //# sourceMappingURL=GanttItemsRow.js.map

  function GnattItems(core) {
      const { api, state, onDestroy, action, update, html, createComponent, repeat } = core;
      const componentName = 'chart-gantt-items';
      const componentAction = api.getAction(componentName);
      let className;
      onDestroy(state.subscribe('config.classNames', () => {
          className = api.getClass(componentName);
          update();
      }));
      let rows = [], rowsComponents = [];
      onDestroy(state.subscribe('_internal.list.visibleRows;', visibleRows => {
          rows = visibleRows;
          rowsComponents.forEach(row => row.component.destroy());
          rowsComponents = [];
          for (const row of rows) {
              rowsComponents.push({ id: row.id, component: createComponent(GanttItemsRow, { rowId: row.id }) });
          }
          update();
      }));
      onDestroy(() => {
          rowsComponents.forEach(row => row.component.destroy());
      });
      return props => html `
    <div class=${className} data-action=${action(componentAction, { api, state })}>
      ${rowsComponents.map(r => r.component.html())}
    </div>
  `;
  }
  //# sourceMappingURL=GanttItems.js.map

  function Gantt(core) {
      const { api, state, onDestroy, action, update, html, createComponent } = core;
      const componentName = 'chart-gantt';
      const componentAction = api.getAction(componentName);
      const Grid = createComponent(GanttGrid);
      onDestroy(Grid.destroy);
      const Items = createComponent(GnattItems);
      onDestroy(Items.destroy);
      let className, classNameInner;
      onDestroy(state.subscribe('config.classNames', value => {
          className = api.getClass(componentName);
          classNameInner = api.getClass(componentName + '-inner');
          update();
      }));
      let style = '', styleInner = '';
      onDestroy(state.subscribeAll(['_internal.height', '_internal.list.expandedHeight'], () => {
          style = `height: ${state.get('_internal.height')}px`;
          styleInner = `height: ${state.get('_internal.list.expandedHeight')}px;`;
          update();
      }));
      function mainAction(element) {
          state.update('_internal.elements.Gantt', element);
          if (typeof componentAction === 'function') {
              componentAction({ api, state });
          }
      }
      return props => html `
    <div class=${className} style=${style} data-action=${action(mainAction)} @wheel=${api.onScroll}>
      <div class=${classNameInner} style=${styleInner}>
        ${Grid.html()}${Items.html()}
      </div>
    </div>
  `;
  }
  //# sourceMappingURL=Gantt.js.map

  function Chart(core) {
      const { api, state, onDestroy, action, update, html, createComponent } = core;
      const componentName = 'chart';
      const Calendar$1 = createComponent(Calendar);
      onDestroy(Calendar$1.destroy);
      const Gantt$1 = createComponent(Gantt);
      onDestroy(Gantt$1.destroy);
      let className, classNameScroll, classNameScrollInner, scrollElement, styleScroll = '', styleScrollInner = '', componentAction = api.getAction(componentName);
      onDestroy(state.subscribe('config.classNames', value => {
          className = api.getClass(componentName);
          classNameScroll = api.getClass('horizontal-scroll');
          classNameScrollInner = api.getClass('horizontal-scroll-inner');
          update();
      }));
      onDestroy(state.subscribe('config.scroll.left', left => {
          if (scrollElement && scrollElement.scrollLeft !== left) {
              scrollElement.scrollLeft = left;
          }
          update();
      }));
      onDestroy(state.subscribeAll(['_internal.chart.dimensions.width', '_internal.chart.time.totalViewDurationPx'], function horizontalScroll(value, eventInfo) {
          styleScroll = `width: ${state.get('_internal.chart.dimensions.width')}px`;
          styleScrollInner = `width: ${state.get('_internal.chart.time.totalViewDurationPx')}px; height:1px`;
          update();
      }));
      const onScroll = {
          handleEvent(event) {
              if (event.type === 'scroll') {
                  state.update('config.scroll.left', event.target.scrollLeft);
              }
              else {
                  const wheel = api.normalizeMouseWheelEvent(event);
                  const xMultiplier = state.get('config.scroll.xMultiplier');
                  const yMultiplier = state.get('config.scroll.yMultiplier');
                  if (event.shiftKey && wheel.y) {
                      state.update('config.scroll.left', left => {
                          return api.limitScroll('left', (left += wheel.y * xMultiplier));
                      });
                  }
                  else if (wheel.x) {
                      state.update('config.scroll.left', left => {
                          return api.limitScroll('left', (left += wheel.x * xMultiplier));
                      });
                  }
                  else {
                      state.update('config.scroll.top', top => {
                          return api.limitScroll('top', (top += wheel.y * yMultiplier));
                      });
                  }
              }
          },
          passive: true
      };
      function bindElement(element) {
          scrollElement = element;
      }
      return props => html `
    <div class=${className} data-action=${action(componentAction, { api, state })} @wheel=${onScroll}>
      ${Calendar$1.html()}${Gantt$1.html()}
      <div class=${classNameScroll} style=${styleScroll} data-action=${action(bindElement)} @scroll=${onScroll}>
        <div class=${classNameScrollInner} style=${styleScrollInner} />
      </div>
    </div>
  `;
  }
  //# sourceMappingURL=Chart.js.map

  function Main(core) {
      const { api, state, onDestroy, action, update, createComponent, html } = core;
      const componentName = api.name;
      const List$1 = createComponent(List);
      onDestroy(List$1.destroy);
      const Chart$1 = createComponent(Chart);
      onDestroy(Chart$1.destroy);
      let pluginsPath = 'config.plugins';
      onDestroy(state.subscribe(pluginsPath, plugins => {
          if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
              for (const plugin of plugins) {
                  plugin(state, api);
              }
          }
      }));
      const componentAction = api.getAction('');
      let className, classNameVerticalScroll, style, styleVerticalScroll, styleVerticalScrollArea;
      let verticalScrollBarElement;
      let expandedHeight = 0;
      let resizerActive = false;
      onDestroy(state.subscribe('config.classNames', classNames => {
          const config = state.get('config');
          className = api.getClass(componentName, { config });
          if (resizerActive) {
              className += ` ${componentName}__list-column-header-resizer--active`;
          }
          classNameVerticalScroll = api.getClass('vertical-scroll', { config });
          update();
      }));
      onDestroy(state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], () => {
          const config = state.get('config');
          const scrollBarHeight = state.get('_internal.scrollBarHeight');
          const height = config.height - config.headerHeight - scrollBarHeight;
          state.update('_internal.height', height);
          style = `--height: ${config.height}px`;
          styleVerticalScroll = `height: ${height}px; width: ${scrollBarHeight}px; margin-top: ${config.headerHeight}px;`;
          update();
      }));
      onDestroy(state.subscribe('_internal.list.columns.resizer.active', active => {
          resizerActive = active;
          className = api.getClass(api.name);
          if (resizerActive) {
              className += ` ${api.name}__list-column-header-resizer--active`;
          }
          update();
      }));
      onDestroy(state.subscribeAll(['config.list.rows;', 'config.chart.items;', 'config.list.rows.*.parentId', 'config.chart.items.*.rowId'], (bulk, eventInfo) => {
          if (state.get('_internal.flatTreeMap').length && eventInfo.type === 'subscribe') {
              return;
          }
          const configRows = state.get('config.list.rows');
          const rows = [];
          for (const rowId in configRows) {
              rows.push(configRows[rowId]);
          }
          api.fillEmptyRowValues(rows);
          const configItems = state.get('config.chart.items');
          const items = [];
          for (const itemId in configItems) {
              items.push(configItems[itemId]);
          }
          const treeMap = api.makeTreeMap(rows, items);
          state.update('_internal.treeMap', treeMap);
          state.update('_internal.flatTreeMapById', api.getFlatTreeMapById(treeMap));
          state.update('_internal.flatTreeMap', api.flattenTreeMap(treeMap));
          update();
      }, { bulk: true }));
      onDestroy(state.subscribeAll(['config.list.rows.*.expanded', '_internal.treeMap;'], bulk => {
          const configRows = state.get('config.list.rows');
          const rowsWithParentsExpanded = api.getRowsFromIds(api.getRowsWithParentsExpanded(state.get('_internal.flatTreeMap'), state.get('_internal.flatTreeMapById'), configRows), configRows);
          expandedHeight = api.getRowsHeight(rowsWithParentsExpanded);
          state.update('_internal.list.expandedHeight', expandedHeight);
          state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
          update();
      }, { bulk: true }));
      onDestroy(state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], () => {
          const visibleRows = api.getVisibleRows(state.get('_internal.list.rowsWithParentsExpanded'));
          state.update('_internal.list.visibleRows', visibleRows);
          update();
      }));
      onDestroy(state.subscribeAll(['config.scroll.top', '_internal.list.visibleRows'], () => {
          const top = state.get('config.scroll.top');
          styleVerticalScrollArea = `height: ${expandedHeight}px; width: 1px`;
          if (verticalScrollBarElement && verticalScrollBarElement.scrollTop !== top) {
              verticalScrollBarElement.scrollTop = top;
          }
          update();
      }));
      function generateAndAddDates(internalTime, chartWidth) {
          const dates = [];
          let leftGlobal = internalTime.leftGlobal;
          const rightGlobal = internalTime.rightGlobal;
          const timePerPixel = internalTime.timePerPixel;
          const period = internalTime.period;
          let sub = leftGlobal - api.time.date(leftGlobal).startOf(period);
          let subPx = sub / timePerPixel;
          let leftPx = 0;
          let maxWidth = 0;
          let id = 0;
          while (leftGlobal < rightGlobal) {
              const date = {
                  id: id++,
                  sub,
                  subPx,
                  leftGlobal,
                  rightGlobal: api.time
                      .date(leftGlobal)
                      .endOf(period)
                      .valueOf(),
                  width: 0,
                  leftPx: 0,
                  rightPx: 0
              };
              date.width = (date.rightGlobal - date.leftGlobal + sub) / timePerPixel;
              if (date.width > chartWidth) {
                  date.width = chartWidth;
              }
              maxWidth = date.width > maxWidth ? date.width : maxWidth;
              date.leftPx = leftPx;
              leftPx += date.width;
              date.rightPx = leftPx;
              dates.push(date);
              leftGlobal = date.rightGlobal + 1;
              sub = 0;
              subPx = 0;
          }
          internalTime.maxWidth = maxWidth;
          internalTime.dates = dates;
      }
      onDestroy(state.subscribeAll([
          'config.chart.time',
          '_internal.dimensions.width',
          'config.scroll.left',
          '_internal.scrollBarHeight',
          '_internal.list.width'
      ], function recalculateTimesAction() {
          const chartWidth = state.get('_internal.dimensions.width') - state.get('_internal.list.width');
          const chartInnerWidth = chartWidth - state.get('_internal.scrollBarHeight');
          state.update('_internal.chart.dimensions', { width: chartWidth, innerWidth: chartInnerWidth });
          let time = api.mergeDeep({}, state.get('config.chart.time'));
          time = api.time.recalculateFromTo(time);
          const zoomPercent = time.zoom * 0.01;
          let scrollLeft = state.get('config.scroll.left');
          time.timePerPixel = zoomPercent + Math.pow(2, time.zoom);
          time.totalViewDurationMs = api.time.date(time.to).diff(time.from, 'milliseconds');
          time.totalViewDurationPx = time.totalViewDurationMs / time.timePerPixel;
          if (scrollLeft > time.totalViewDurationPx) {
              scrollLeft = time.totalViewDurationPx - chartWidth;
          }
          time.leftGlobal = scrollLeft * time.timePerPixel + time.from;
          time.rightGlobal = time.leftGlobal + chartWidth * time.timePerPixel;
          time.leftInner = time.leftGlobal - time.from;
          time.rightInner = time.rightGlobal - time.from;
          time.leftPx = time.leftInner / time.timePerPixel;
          time.rightPx = time.rightInner / time.timePerPixel;
          if (Math.round(time.rightGlobal / time.timePerPixel) > Math.round(time.to / time.timePerPixel)) {
              time.rightGlobal = time.to;
              time.rightInner = time.rightGlobal - time.from;
              time.totalViewDurationMs = time.to - time.from;
              time.totalViewDurationPx = time.rightPx;
              time.timePerPixel = time.totalViewDurationMs / time.totalViewDurationPx;
          }
          generateAndAddDates(time, chartWidth);
          state.update(`_internal.chart.time`, time);
          update();
      }));
      state.update('_internal.scrollBarHeight', api.getScrollBarHeight());
      const onScroll = {
          handleEvent(event) {
              state.update('config.scroll.top', event.target.scrollTop);
          },
          passive: false
      };
      const dimensions = { width: 0, height: 0 };
      function mainAction(element) {
          if (dimensions.width === 0) {
              const width = element.clientWidth;
              const height = element.clientHeight;
              if (dimensions.width !== width || dimensions.height !== height) {
                  dimensions.width = width;
                  dimensions.height = height;
                  state.update('_internal.dimensions', dimensions);
              }
          }
          if (typeof action === 'function') {
              componentAction(element, { state, api });
          }
      }
      function bindElement(element) {
          verticalScrollBarElement = element;
      }
      return props => html `
      <div class=${className} @scroll=${onScroll} data-action=${action(mainAction)}>
        ${List$1.html()} ${Chart$1.html()}
        <div
          class=${classNameVerticalScroll}
          style=${styleVerticalScroll}
          @scroll=${onScroll}
          data-action=${action(bindElement)}
        >
          <div style=${styleVerticalScrollArea} />
        </div>
      </div>
    `;
  }
  //# sourceMappingURL=Main.js.map

  const _internal = {
      components: {
          Main
      },
      scrollBarHeight: 17,
      height: 0,
      treeMap: {},
      flatTreeMap: [],
      flatTreeMapById: {},
      list: {
          expandedHeight: 0,
          visibleRows: [],
          rows: {},
          width: 0
      },
      dimensions: {
          width: 0,
          height: 0
      },
      chart: {
          dimensions: {
              width: 0,
              innerWidth: 0
          },
          visibleItems: [],
          time: {
              dates: [],
              timePerPixel: 0,
              firstTaskTime: 0,
              lastTaskTime: 0,
              totalViewDurationMs: 0,
              totalViewDurationPx: 0,
              leftGlobal: 0,
              rightGlobal: 0,
              leftPx: 0,
              rightPx: 0,
              leftInner: 0,
              rightInner: 0
          }
      },
      elements: {}
  };
  const GSTC = options => {
      const state = options.state;
      const api = getInternalApi(state);
      // @ts-ignore
      window.state = state;
      state.update('', oldValue => {
          return {
              config: oldValue.config,
              _internal
          };
      });
      // @ts-ignore
      const vido = Vido(state, api);
      const app = vido.createApp(Main, options.element);
      return { state };
  };
  GSTC.api = publicApi;

  return GSTC;

}));
//# sourceMappingURL=index.umd.js.map
