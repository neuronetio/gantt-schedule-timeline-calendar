(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.CalendarScroll = factory());
}(this, (function () { 'use strict';

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
  const t=t=>(...e)=>{const n=t(...e);return n.isDirective=!0,n};class e{constructor(){this.isDirective=!0,this.isClass=!0;}body(t){}}const n=t=>null!=t&&"boolean"==typeof t.isDirective,o="undefined"!=typeof window&&(null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback),s=(t,e,n=null,o=null)=>{for(;e!==n;){const n=e.nextSibling;t.insertBefore(e,o),e=n;}},i=(t,e,n=null)=>{for(;e!==n;){const n=e.nextSibling;t.removeChild(e),e=n;}},r={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,c=`\x3c!--${l}--\x3e`,h=new RegExp(`${l}|${c}`),d="$lit$";
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
   */class p{constructor(t,e){this.parts=[],this.element=e;const n=[],o=[],s=document.createTreeWalker(e.content,133,null,!1);let i=0,r=-1,a=0;const{strings:c,values:{length:p}}=t;for(;a<p;){const t=s.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:n}=e;let o=0;for(let t=0;t<n;t++)u(e[t].name,d)&&o++;for(;o-- >0;){const e=c[a],n=f.exec(e)[2],o=n.toLowerCase()+d,s=t.getAttribute(o);t.removeAttribute(o);const i=s.split(h);this.parts.push({type:"attribute",index:r,name:n,strings:i,sanitizer:void 0}),a+=i.length-1;}}"TEMPLATE"===t.tagName&&(o.push(t),s.currentNode=t.content);}else if(3===t.nodeType){const e=t.data;if(e.indexOf(l)>=0){const o=t.parentNode,s=e.split(h),i=s.length-1;for(let e=0;e<i;e++){let n,i=s[e];if(""===i)n=y();else{const t=f.exec(i);null!==t&&u(t[2],d)&&(i=i.slice(0,t.index)+t[1]+t[2].slice(0,-d.length)+t[3]),n=document.createTextNode(i);}o.insertBefore(n,t),this.parts.push({type:"node",index:++r});}""===s[i]?(o.insertBefore(y(),t),n.push(t)):t.data=s[i],a+=i;}}else if(8===t.nodeType)if(t.data===l){const e=t.parentNode;null!==t.previousSibling&&r!==i||(r++,e.insertBefore(y(),t)),i=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(n.push(t),r--),a++;}else{let e=-1;for(;-1!==(e=t.data.indexOf(l,e+1));)this.parts.push({type:"node",index:-1}),a++;}}else s.currentNode=o.pop();}for(const t of n)t.parentNode.removeChild(t);}}const u=(t,e)=>{const n=t.length-e.length;return n>=0&&t.slice(n)===e},m=t=>-1!==t.index,v=document.createComment(""),y=()=>v.cloneNode(),f=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
  class g{constructor(t,e,n){this.__parts=[],this.template=t,this.processor=e,this.options=n;}update(t){let e=0;for(const n of this.__parts)void 0!==n&&n.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit();}_clone(){const t=o?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],n=this.template.parts,s=document.createTreeWalker(t,133,null,!1);let i,r=0,a=0,l=s.nextNode();for(;r<n.length;)if(i=n[r],m(i)){for(;a<i.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),s.currentNode=l.content),null===(l=s.nextNode())&&(s.currentNode=e.pop(),l=s.nextNode());if("node"===i.type){const t=this.processor.handleTextExpression(this.options,i);t.insertAfterNode(l.previousSibling),this.__parts.push(t);}else this.__parts.push(...this.processor.handleAttributeExpressions(l,i.name,i.strings,this.options,i));r++;}else this.__parts.push(void 0),r++;return o&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
   */let x;const b=` ${l} `,_=document.createElement("template");class w{constructor(t,e,n,o){this.strings=t,this.values=e,this.type=n,this.processor=o;}getHTML(){const t=this.strings.length-1;let e="",n=!1;for(let o=0;o<t;o++){const t=this.strings[o],s=t.lastIndexOf("\x3c!--");n=(s>-1||n)&&-1===t.indexOf("--\x3e",s+1);const i=f.exec(t);e+=null===i?t+(n?b:c):t.substr(0,i.index)+i[1]+i[2]+d+i[3]+l;}return e+=this.strings[t],e}getTemplateElement(){const t=_.cloneNode();return t.innerHTML=function(t){const e=window,n=e.trustedTypes||e.TrustedTypes;return n&&!x&&(x=n.createPolicy("lit-html",{createHTML:t=>t})),x?x.createHTML(t):t}(this.getHTML()),t}}class N extends w{getHTML(){return `<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),e=t.content,n=e.firstChild;return e.removeChild(n),s(e,n.firstChild),t}}
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
   */const E=t=>null===t||!("object"==typeof t||"function"==typeof t),P=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]),A=t=>t,T=(t,e,n)=>A;let M=T;const Y=document.createTextNode("");class X{constructor(t,e,n,o,s="attribute"){this.dirty=!0,this.element=t,this.name=e,this.strings=n,this.parts=[];let i=o&&o.sanitizer;void 0===i&&(i=M(t,e,s),void 0!==o&&(o.sanitizer=i)),this.sanitizer=i;for(let t=0;t<n.length-1;t++)this.parts[t]=this._createPart();}_createPart(){return new I(this)}_getValue(){const t=this.strings,e=this.parts,n=t.length-1;if(1===n&&""===t[0]&&""===t[1]&&void 0!==e[0]){const t=e[0].value;if(!P(t))return t}let o="";for(let s=0;s<n;s++){o+=t[s];const n=e[s];if(void 0!==n){const t=n.value;if(E(t)||!P(t))o+="string"==typeof t?t:String(t);else for(const e of t)o+="string"==typeof e?e:String(e);}}return o+=t[n],o}commit(){if(this.dirty){this.dirty=!1;let t=this._getValue();t=this.sanitizer(t),"symbol"==typeof t&&(t=String(t)),this.element.setAttribute(this.name,t);}}}class I{constructor(t){this.value=void 0,this.committer=t;}setValue(t){t===r||E(t)&&t===this.value||(this.value=t,n(t)||(this.committer.dirty=!0));}commit(){for(;n(this.value);){const t=this.value;this.value=r,t.isClass?t.body(this):t(this);}this.value!==r&&this.committer.commit();}}class S{constructor(t,e){this.value=void 0,this.__pendingValue=void 0,this.textSanitizer=void 0,this.options=t,this.templatePart=e;}appendInto(t){this.startNode=t.appendChild(y()),this.endNode=t.appendChild(y());}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling;}appendIntoPart(t){t.__insert(this.startNode=y()),t.__insert(this.endNode=y());}insertAfterPart(t){t.__insert(this.startNode=y()),this.endNode=t.endNode,t.endNode=this.startNode;}setValue(t){this.__pendingValue=t;}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t.isClass?t.body(this):t(this);}const t=this.__pendingValue;t!==r&&(E(t)?t!==this.value&&this.__commitText(t):t instanceof w?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):P(t)?this.__commitIterable(t):t===a?(this.value=a,this.clear()):this.__commitText(t));}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode);}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t);}__commitText(t){const e=this.startNode.nextSibling;if(t=null==t?"":t,e===this.endNode.previousSibling&&3===e.nodeType){void 0===this.textSanitizer&&(this.textSanitizer=M(e,"data","property"));const n=this.textSanitizer(t);e.data="string"==typeof n?n:String(n);}else{const e=Y.cloneNode();this.__commitNode(e),void 0===this.textSanitizer&&(this.textSanitizer=M(e,"data","property"));const n=this.textSanitizer(t);e.data="string"==typeof n?n:String(n);}this.value=t;}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof g&&this.value.template===e)this.value.update(t.values);else{const n=this.endNode.parentNode;if(M!==T&&"STYLE"===n.nodeName||"SCRIPT"===n.nodeName)return void this.__commitText("/* lit-html will not write TemplateResults to scripts and styles */");const o=new g(e,t.processor,this.options),s=o._clone();o.update(t.values),this.__commitNode(s),this.value=o;}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let n,o=0;for(const s of t)n=e[o],void 0===n&&(n=new S(this.options,this.templatePart),e.push(n),0===o?n.appendIntoPart(this):n.insertAfterPart(e[o-1])),n.setValue(s),n.commit(),o++;o<e.length&&(e.length=o,this.clear(n&&n.endNode));}clear(t=this.startNode){i(this.startNode.parentNode,t.nextSibling,this.endNode);}}class C{constructor(t,e,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=n;}setValue(t){this.__pendingValue=t;}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t.isClass?t.body(this):t(this);}if(this.__pendingValue===r)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=r;}}class V extends X{constructor(t,e,n,o){super(t,e,n,o,"property"),this.single=2===n.length&&""===n[0]&&""===n[1];}_createPart(){return new L(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){if(this.dirty){this.dirty=!1;let t=this._getValue();t=this.sanitizer(t),this.element[this.name]=t;}}}class L extends I{}let k=!1;(()=>{try{const t={get capture(){return k=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t);}catch(t){}})();class D{constructor(t,e,n){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=n,this.__boundHandleEvent=t=>this.handleEvent(t);}setValue(t){this.__pendingValue=t;}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t.isClass?t.body(this):t(this);}if(this.__pendingValue===r)return;const t=this.__pendingValue,e=this.value,o=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=null!=t&&(null==e||o);o&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=z(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=r;}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t);}}const z=t=>t&&(k?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);
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
   */class F{handleAttributeExpressions(t,e,n,o,s){const i=e[0];if("."===i){return new V(t,e.slice(1),n,s).parts}return "@"===i?[new D(t,e.slice(1),o.eventContext)]:"?"===i?[new C(t,e.slice(1),n)]:new X(t,e,n,s).parts}handleTextExpression(t,e){return new S(t,e)}}const B=new F;
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
   */function W(t){let e=$.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},$.set(t.type,e));let n=e.stringsArray.get(t.strings);if(void 0!==n)return n;const o=t.strings.join(l);return n=e.keyString.get(o),void 0===n&&(n=new p(t,t.getTemplateElement()),e.keyString.set(o,n)),e.stringsArray.set(t.strings,n),n}const $=new Map,H=new WeakMap,R=(t,e,n)=>{let o=H.get(e);void 0===o&&(i(e,e.firstChild),H.set(e,o=new S(Object.assign({templateFactory:W},n),void 0)),o.appendInto(e)),o.setValue(t),o.commit();};
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
   */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.5");const O=(t,...e)=>new w(t,e,"html",B),U=(t,...e)=>new N(t,e,"svg",B);var j=Object.freeze({__proto__:null,html:O,svg:U,DefaultTemplateProcessor:F,defaultTemplateProcessor:B,directive:t,Directive:e,isDirective:n,removeNodes:i,reparentNodes:s,noChange:r,nothing:a,AttributeCommitter:X,AttributePart:I,BooleanAttributePart:C,EventPart:D,isIterable:P,isPrimitive:E,NodePart:S,PropertyCommitter:V,PropertyPart:L,get sanitizerFactory(){return M},setSanitizerFactory:t=>{if(M!==T)throw new Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");M=t;},parts:H,render:R,templateCaches:$,templateFactory:W,TemplateInstance:g,SVGTemplateResult:N,TemplateResult:w,createMarker:y,isTemplatePartActive:m,Template:p});
  const mt=document.createElement("template");
  class Nt{constructor(){this.isAction=!0;}}Nt.prototype.isAction=!0;const Et={element:document.createTextNode(""),axis:"xy",threshold:10,onDown(t){},onMove(t){},onUp(t){},onWheel(t){}};

  /**
   * CalendarScroll plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  function CalendarScroll(options = {}) {
      let state, api, schedule;
      const defaultOptions = {
          speed: 1,
          hideScroll: false,
          onChange(time) { }
      };
      options = Object.assign(Object.assign({}, defaultOptions), options);
      class CalendarScrollAction extends Nt {
          constructor(element) {
              super();
              this.isMoving = false;
              this.lastX = 0;
              this.onPointerStart = this.onPointerStart.bind(this);
              this.onPointerMove = this.onPointerMove.bind(this);
              this.onPointerEnd = this.onPointerEnd.bind(this);
              element.addEventListener('touchstart', this.onPointerStart);
              document.addEventListener('touchmove', this.onPointerMove);
              document.addEventListener('touchend', this.onPointerEnd);
              element.addEventListener('mousedown', this.onPointerStart);
              document.addEventListener('mousemove', this.onPointerMove);
              document.addEventListener('mouseup', this.onPointerEnd);
              element.style.cursor = 'move';
              const horizontalScroll = state.get('_internal.elements.horizontal-scroll');
              // @ts-ignore
              if (options.hideScroll && horizontalScroll) {
                  horizontalScroll.style.visibility = 'hidden';
              }
          }
          onPointerStart(ev) {
              if (ev.type === 'mousedown' && ev.button !== 0)
                  return;
              ev.stopPropagation();
              this.isMoving = true;
              const normalized = api.normalizePointerEvent(ev);
              this.lastX = normalized.x;
          }
          onPointerMove(ev) {
              if (!this.isMoving)
                  return;
              const normalized = api.normalizePointerEvent(ev);
              const movedX = normalized.x - this.lastX;
              const time = state.get('_internal.chart.time');
              // @ts-ignore
              const movedTime = -Math.round(movedX * time.timePerPixel * options.speed);
              state.update('config.chart.time', configTime => {
                  if (configTime.from === 0)
                      configTime.from = time.from;
                  if (configTime.to === 0)
                      configTime.to = time.to;
                  configTime.from += movedTime;
                  configTime.to += movedTime;
                  // @ts-ignore
                  options.onChange(configTime);
                  return configTime;
              });
              this.lastX = normalized.x;
          }
          onPointerEnd() {
              this.isMoving = false;
              this.lastX = 0;
          }
          destroy(element, data) {
              element.removeEventListener('touchstart', this.onPointerStart);
              document.removeEventListener('touchmove', this.onPointerMove);
              document.removeEventListener('touchend', this.onPointerEnd);
              element.removeEventListener('mousedown', this.onPointerStart);
              document.removeEventListener('mousemove', this.onPointerMove);
              document.removeEventListener('mouseup', this.onPointerEnd);
          }
      }
      return function initialize(vido) {
          api = vido.api;
          state = vido.state;
          schedule = vido.schedule;
          state.update('config.actions.chart-calendar', actions => {
              actions.push(CalendarScrollAction);
              return actions;
          });
      };
  }

  return CalendarScroll;

})));
//# sourceMappingURL=CalendarScroll.plugin.js.map
