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
            collCfg.path = this.cleanNotRecursivePath(collCfg.path);
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
            fn(this.pathGet(this.split(listenerPath), this.data), {
                type,
                path: {
                    listener: listenerPath,
                    update: undefined,
                    resolved: listenerPath
                },
                params: this.getParams(listenersCollection.paramsInfo, listenerPath),
                options
            });
        }
        else {
            const paths = this.scan.get(listenerPath);
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
                        path: {
                            listener: listenerPath,
                            update: undefined,
                            resolved: path
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
    empty(obj) {
        for (const key in obj) {
            return false;
        }
        return true;
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
                                path: {
                                    listener: listenerPath,
                                    update: originalPath ? originalPath : updatePath,
                                    resolved: updatePath
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
                            path: {
                                listener: listenerPath,
                                update: originalPath ? originalPath : updatePath,
                                resolved: fullPath
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
                                path: {
                                    listener: listenerPath,
                                    update: originalPath ? originalPath : updatePath,
                                    resolved: fullPath
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
            return (postfix += `-${key}_${attrs[key].id}`);
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
        $state.config.classNames[name].forEach(customClass => (className += customClass + ' '));
      }
      if (typeof $state.config.classNames[name + postfix] !== 'undefined') {
        $state.config.classNames[name + postfix].forEach(customClass => (className += customClass + ' '));
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
  unsubscribers.push(
    state.subscribe('', () => {
      $state = state.get();
    })
  );

  return api;
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};
//# sourceMappingURL=directive.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};
//# sourceMappingURL=dom.js.map

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};
//# sourceMappingURL=part.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
//# sourceMappingURL=template.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari dooes not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}
//# sourceMappingURL=template-instance.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment poisition.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceeding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceeding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
//# sourceMappingURL=template-result.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // tslint:disable-next-line:no-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attibute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // tslint:disable-next-line:no-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
try {
    const options = {
        get capture() {
            eventOptionsSupported = true;
            return false;
        }
    };
    // tslint:disable-next-line:no-any
    window.addEventListener('test', options, options);
    // tslint:disable-next-line:no-any
    window.removeEventListener('test', options, options);
}
catch (_e) {
}
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);
//# sourceMappingURL=parts.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();
//# sourceMappingURL=default-template-processor.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();
//# sourceMappingURL=template-factory.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};
//# sourceMappingURL=render.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
//# sourceMappingURL=lit-html.js.map

function Core(state, api) {
    const components = new WeakMap();
    const templates = new WeakMap();
    let app, element;
    function getAction(instance) {
        return directive(fn => part => {
            if (typeof fn === 'function') {
                fn(part.committer.element);
            }
        });
    }
    const core = {
        state,
        api,
        html,
        render,
        directive,
        action: element => { },
        createComponent(instance) {
            const componentInstance = {
                instance,
                destroy() {
                    return self.destroyComponent(instance);
                },
                update(props) {
                    return self.updateTemplate(instance, props);
                },
                html() {
                    return self.componentTemplate(instance);
                }
            };
            let oneTimeUpdate;
            let render = (props = {}) => (oneTimeUpdate = () => this.updateTemplate(instance, props));
            const destroyable = [];
            const onDestroy = fn => destroyable.push(fn);
            const instanceCore = Object.assign(Object.assign({}, core), { render, onDestroy, instance });
            instanceCore.action = getAction();
            let methods = instance(instanceCore);
            if (typeof methods === 'function') {
                const destroy = () => {
                    destroyable.forEach(d => d());
                };
                methods = { update: methods, destroy };
            }
            else {
                const originalDestroy = methods.destroy;
                const destroy = () => {
                    destroyable.forEach(d => d());
                    originalDestroy();
                };
                methods = Object.assign(Object.assign({}, methods), { destroy });
            }
            components.set(instance, methods);
            oneTimeUpdate();
            instanceCore.render = (props = {}) => this.updateTemplate(instance, props, true, instance);
            const self = this;
            return componentInstance;
        },
        destroyComponent(instance) {
            const methods = components.get(instance);
            if (typeof methods.destroy === 'function') {
                methods.destroy();
            }
            components.delete(instance);
            templates.delete(instance);
        },
        updateTemplate(instance, props, flush = true) {
            const methods = components.get(instance);
            templates.set(instance, methods.update(props));
            if (flush)
                this.flush(instance);
        },
        componentTemplate(instance) {
            return templates.get(instance);
        },
        createApp(instance, el) {
            element = el;
            const App = this.createComponent(instance);
            app = App.instance;
            this.flush();
            return App;
        },
        flush() {
            if (app) {
                this.updateTemplate(app, {}, false);
                render(this.componentTemplate(app), element);
            }
        }
    };
    return core;
}

function Main(input = {}) {
    return core => {
        const componentName = core.api.name;
        let className;
        core.onDestroy(core.state.subscribe('classNames', () => {
            className = core.api.getClass(componentName);
            core.render();
        }));
        let pluginsPath = 'config.plugins';
        core.onDestroy(core.state.subscribe(pluginsPath, plugins => {
            if (typeof plugins !== 'undefined' && Array.isArray(plugins)) {
                for (const plugin of plugins) {
                    plugin(core.state, core.api);
                }
            }
        }));
        const action = core.api.getAction('');
        return props => core.html `<div class="${className}" data-action="${core.action(action)}">Main</div>`;
    };
}
/*

  const action = core.api.getAction('');
  let className, classNameVerticalScroll, style, styleVerticalScroll, styleVerticalScrollArea;
  let verticalScrollBarElement;
  let expandedHeight = 0;
  let resizerActive = false;

  onDestroy(
    core.state.subscribe('config.classNames', classNames => {
      const config = core.state.get('config');
      className = core.api.getClass(core.api.name, { config });
      if (resizerActive) {
        className += ` ${core.api.name}__list-column-header-resizer--active`;
      }
      classNameVerticalScroll = core.api.getClass('vertical-scroll', { config });
    })
  );

  onDestroy(
    core.state.subscribeAll(['config.height', 'config.headerHeight', '_internal.scrollBarHeight'], () => {
      const config = core.state.get('config');
      const scrollBarHeight = core.state.get('_internal.scrollBarHeight');
      const height = config.height - config.headerHeight - scrollBarHeight;
      core.state.update('_internal.height', height);
      style = `--height: ${config.height}px`;
      styleVerticalScroll = `height: ${height}px; width: ${scrollBarHeight}px; margin-top: ${config.headerHeight}px;`;
    })
  );

  onDestroy(
    core.state.subscribe('_internal.list.columns.resizer.active', active => {
      resizerActive = active;
      className = core.api.getClass(core.api.name);
      if (resizerActive) {
        className += ` ${core.api.name}__list-column-header-resizer--active`;
      }
    })
  );

  onDestroy(
    core.state.subscribeAll(
      ['config.list.rows;', 'config.chart.items;', 'config.list.rows.*.parentId', 'config.chart.items.*.rowId'],
      (bulk, eventInfo) => {
        if (core.state.get('_internal.flatTreeMap').length && eventInfo.type === 'subscribe') {
          return;
        }
        const configRows = core.state.get('config.list.rows');
        const rows = [];
        for (const rowId in configRows) {
          rows.push(configRows[rowId]);
        }
        core.api.fillEmptyRowValues(rows);
        const configItems = core.state.get('config.chart.items');
        const items = [];
        for (const itemId in configItems) {
          items.push(configItems[itemId]);
        }
        const treeMap = core.api.makeTreeMap(rows, items);
        core.state.update('_internal.treeMap', treeMap);
        core.state.update('_internal.flatTreeMapById', core.api.getFlatTreeMapById(treeMap));
        core.state.update('_internal.flatTreeMap', core.api.flattenTreeMap(treeMap));
      },
      { bulk: true }
    )
  );

  onDestroy(
    core.state.subscribeAll(
      ['config.list.rows.*.expanded', '_internal.treeMap;'],
      bulk => {
        const configRows = core.state.get('config.list.rows');
        const rowsWithParentsExpanded = core.api.getRowsFromIds(
          core.api.getRowsWithParentsExpanded(
            core.state.get('_internal.flatTreeMap'),
            core.state.get('_internal.flatTreeMapById'),
            configRows
          ),
          configRows
        );
        expandedHeight = core.api.getRowsHeight(rowsWithParentsExpanded);
        core.state.update('_internal.list.expandedHeight', expandedHeight);
        core.state.update('_internal.list.rowsWithParentsExpanded', rowsWithParentsExpanded);
      },
      { bulk: true }
    )
  );

  onDestroy(
    core.state.subscribeAll(['_internal.list.rowsWithParentsExpanded', 'config.scroll.top'], () => {
      const visibleRows = core.api.getVisibleRows(core.state.get('_internal.list.rowsWithParentsExpanded'));
      core.state.update('_internal.list.visibleRows', visibleRows);
    })
  );

  onDestroy(
    core.state.subscribeAll(['config.scroll.top', '_internal.list.visibleRows'], () => {
      const top = core.state.get('config.scroll.top');
      styleVerticalScrollArea = `height: ${expandedHeight}px; width: 1px`;
      if (verticalScrollBarElement && verticalScrollBarElement.scrollTop !== top) {
        verticalScrollBarElement.scrollTop = top;
      }
    })
  );

  function generateAndAddDates(internalTime, chartWidth) {
    const dates = [];
    let leftGlobal = internalTime.leftGlobal;
    const rightGlobal = internalTime.rightGlobal;
    const timePerPixel = internalTime.timePerPixel;
    const period = internalTime.period;
    let sub = leftGlobal - core.api.time.date(leftGlobal).startOf(period);
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
        rightGlobal: core.api.time
          .date(leftGlobal)
          .endOf(period)
          .valueOf()
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

  onDestroy(
    core.state.subscribeAll(
      [
        'config.chart.time',
        '_internal.dimensions.width',
        'config.scroll.left',
        '_internal.scrollBarHeight',
        '_internal.list.width'
      ],
      function recalculateTimesAction() {
        const chartWidth = core.state.get('_internal.dimensions.width') - core.state.get('_internal.list.width');
        const chartInnerWidth = chartWidth - core.state.get('_internal.scrollBarHeight');
        core.state.update('_internal.chart.dimensions', { width: chartWidth, innerWidth: chartInnerWidth });
        let time = core.api.mergeDeep({}, core.state.get('config.chart.time'));
        time = core.api.time.recalculateFromTo(time);
        const zoomPercent = time.zoom * 0.01;
        let scrollLeft = core.state.get('config.scroll.left');
        let oldScrollPercentage = 0;
        time.timePerPixel = zoomPercent + Math.pow(2, time.zoom);
        time.totalViewDurationMs = core.api.time.date(time.to).diff(time.from, 'milliseconds');
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
          console.log(
            'right global > time.to',
            core.api.time.date(time.rightGlobal).format('YYYY-MM-DD'),
            core.api.time.date(time.to).format('YYYY-MM-DD'),
            (time.rightGlobal - time.to) / time.timePerPixel,
            time.totalViewDurationPx
          );
          time.rightGlobal = time.to;
          time.rightInner = time.rightGlobal - time.from;
          time.totalViewDurationMs = time.to - time.from;
          time.totalViewDurationPx = time.rightPx;
          time.timePerPixel = time.totalViewDurationMs / time.totalViewDurationPx;
          console.log(
            'after recalculation',
            core.api.time.date(time.rightGlobal).format('YYYY-MM-DD'),
            core.api.time.date(time.to).format('YYYY-MM-DD'),
            (time.rightGlobal - time.to) / time.timePerPixel,
            time.totalViewDurationPx
          );
        }
        generateAndAddDates(time, chartWidth);
        core.state.update(`_internal.chart.time`, time);
      }
    )
  );

  onMount(() => {
    core.state.update('_internal.scrollBarHeight', core.api.getScrollBarHeight());
  });

  let dimensions = { width: 0, height: 0 };
  let dims = { width: 0, height: 0 };
  $: if (dims.width !== dimensions.width || dims.height !== dimensions.height) {
    dims = { ...dimensions };
    core.state.update('_internal.dimensions', () => dims);
    core.state.update('_internal.scrollBarHeight', core.api.getScrollBarHeight());
  }

  function onScroll(event) {
    core.state.update('config.scroll.top', event.target.scrollTop);
  }
</script>

<svelte:options accessors={true} tag="gantt-shedule-timeline-calendar" />
<div
  class={className}
  use:action={{ core.state, core.api }}
  {style}
  bind:clientWidth={dimensions.width}
  bind:clientHeight={dimensions.height}>
  <List />
  <Chart />
  <div
    class={classNameVerticalScroll}
    style={styleVerticalScroll}
    on:scroll={onScroll}
    bind:this={verticalScrollBarElement}>
    <div style={styleVerticalScrollArea} />
  </div>
</div>
*/
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
    window.state = state;
    state.update('', oldValue => {
        return {
            config: oldValue.config,
            _internal
        };
    });
    const core = Core(state, api);
    const app = core.createApp(Main(), options.element);
    return { state };
};
GSTC.api = publicApi;
//# sourceMappingURL=index.js.map

export default GSTC;
//# sourceMappingURL=index.esm.js.map
