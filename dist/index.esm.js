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
const t=new WeakMap,e=e=>(...n)=>{const s=e(...n);return t.set(s,!0),s},n=e=>"function"==typeof e&&t.has(e),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(t,e,n=null,s=null)=>{for(;e!==n;){const n=e.nextSibling;t.insertBefore(e,s),e=n}},o=(t,e,n=null)=>{for(;e!==n;){const n=e.nextSibling;t.removeChild(e),e=n}},r={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,c=`\x3c!--${l}--\x3e`,d=new RegExp(`${l}|${c}`),h="$lit$";class u{constructor(t,e){this.parts=[],this.element=e;const n=[],s=[],i=document.createTreeWalker(e.content,133,null,!1);let o=0,r=-1,a=0;const{strings:c,values:{length:u}}=t;for(;a<u;){const t=i.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:n}=e;let s=0;for(let t=0;t<n;t++)p(e[t].name,h)&&s++;for(;s-- >0;){const e=c[a],n=g.exec(e)[2],s=n.toLowerCase()+h,i=t.getAttribute(s);t.removeAttribute(s);const o=i.split(d);this.parts.push({type:"attribute",index:r,name:n,strings:o}),a+=o.length-1}}"TEMPLATE"===t.tagName&&(s.push(t),i.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(l)>=0){const s=t.parentNode,i=e.split(d),o=i.length-1;for(let e=0;e<o;e++){let n,o=i[e];if(""===o)n=m();else{const t=g.exec(o);null!==t&&p(t[2],h)&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-h.length)+t[3]),n=document.createTextNode(o)}s.insertBefore(n,t),this.parts.push({type:"node",index:++r})}""===i[o]?(s.insertBefore(m(),t),n.push(t)):t.data=i[o],a+=o}}else if(8===t.nodeType)if(t.data===l){const e=t.parentNode;null!==t.previousSibling&&r!==o||(r++,e.insertBefore(m(),t)),o=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(n.push(t),r--),a++}else{let e=-1;for(;-1!==(e=t.data.indexOf(l,e+1));)this.parts.push({type:"node",index:-1}),a++}}else i.currentNode=s.pop()}for(const t of n)t.parentNode.removeChild(t)}}const p=(t,e)=>{const n=t.length-e.length;return n>=0&&t.slice(n)===e},f=t=>-1!==t.index,m=()=>document.createComment(""),g=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
class v{constructor(t,e,n){this.__parts=[],this.template=t,this.processor=e,this.options=n}update(t){let e=0;for(const n of this.__parts)void 0!==n&&n.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],n=this.template.parts,i=document.createTreeWalker(t,133,null,!1);let o,r=0,a=0,l=i.nextNode();for(;r<n.length;)if(o=n[r],f(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),i.currentNode=l.content),null===(l=i.nextNode())&&(i.currentNode=e.pop(),l=i.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return s&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const b=` ${l} `;class y{constructor(t,e,n,s){this.strings=t,this.values=e,this.type=n,this.processor=s}getHTML(){const t=this.strings.length-1;let e="",n=!1;for(let s=0;s<t;s++){const t=this.strings[s],i=t.lastIndexOf("\x3c!--");n=(i>-1||n)&&-1===t.indexOf("--\x3e",i+1);const o=g.exec(t);e+=null===o?t+(n?b:c):t.substr(0,o.index)+o[1]+o[2]+h+o[3]+l}return e+=this.strings[t]}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}class _ extends y{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),e=t.content,n=e.firstChild;return e.removeChild(n),i(e,n.firstChild),t}}
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
 */const w=t=>null===t||!("object"==typeof t||"function"==typeof t),$=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class x{constructor(t,e,n){this.dirty=!0,this.element=t,this.name=e,this.strings=n,this.parts=[];for(let t=0;t<n.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new M(this)}_getValue(){const t=this.strings,e=t.length-1;let n="";for(let s=0;s<e;s++){n+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(w(t)||!$(t))n+="string"==typeof t?t:String(t);else for(const e of t)n+="string"==typeof e?e:String(e)}}return n+=t[e]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class M{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===r||w(t)&&t===this.value||(this.value=t,n(t)||(this.committer.dirty=!0))}commit(){for(;n(this.value);){const t=this.value;this.value=r,t(this)}this.value!==r&&this.committer.commit()}}class A{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(m()),this.endNode=t.appendChild(m())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=m()),t.__insert(this.endNode=m())}insertAfterPart(t){t.__insert(this.startNode=m()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}const t=this.__pendingValue;t!==r&&(w(t)?t!==this.value&&this.__commitText(t):t instanceof y?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):$(t)?this.__commitIterable(t):t===a?(this.value=a,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,n="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=n:this.__commitNode(document.createTextNode(n)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof v&&this.value.template===e)this.value.update(t.values);else{const n=new v(e,t.processor,this.options),s=n._clone();n.update(t.values),this.__commitNode(s),this.value=n}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let n,s=0;for(const i of t)void 0===(n=e[s])&&(n=new A(this.options),e.push(n),0===s?n.appendIntoPart(this):n.insertAfterPart(e[s-1])),n.setValue(i),n.commit(),s++;s<e.length&&(e.length=s,this.clear(n&&n.endNode))}clear(t=this.startNode){o(this.startNode.parentNode,t.nextSibling,this.endNode)}}class N{constructor(t,e,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=n}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=r}}class O extends x{constructor(t,e,n){super(t,e,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new P(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class P extends M{}let C=!1;try{const t={get capture(){return C=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class D{constructor(t,e,n){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=n,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=E(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=r}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const E=t=>t&&(C?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);
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
 */const T=new class{handleAttributeExpressions(t,e,n,s){const i=e[0];if("."===i){return new O(t,e.slice(1),n).parts}return"@"===i?[new D(t,e.slice(1),s.eventContext)]:"?"===i?[new N(t,e.slice(1),n)]:new x(t,e,n).parts}handleTextExpression(t){return new A(t)}};
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
 */function I(t){let e=S.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},S.set(t.type,e));let n=e.stringsArray.get(t.strings);if(void 0!==n)return n;const s=t.strings.join(l);return void 0===(n=e.keyString.get(s))&&(n=new u(t,t.getTemplateElement()),e.keyString.set(s,n)),e.stringsArray.set(t.strings,n),n}const S=new Map,L=new WeakMap,V=(t,e,n)=>{let s=L.get(e);void 0===s&&(o(e,e.firstChild),L.set(e,s=new A(Object.assign({templateFactory:I},n))),s.appendInto(e)),s.setValue(t),s.commit()};
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
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const k=(t,...e)=>new y(t,e,"html",T),H=(t,...e)=>new _(t,e,"svg",T),R=new WeakMap,Y=e(t=>e=>{if(!(e instanceof A))throw new Error("cache can only be used in text bindings");let n=R.get(e);void 0===n&&(n=new WeakMap,R.set(e,n));const s=e.value;if(s instanceof v){if(t instanceof y&&s.template===e.options.templateFactory(t))return void e.setValue(t);{let t=n.get(s.template);void 0===t&&(t={instance:s,nodes:document.createDocumentFragment()},n.set(s.template,t)),i(t.nodes,e.startNode.nextSibling,e.endNode)}}if(t instanceof y){const s=e.options.templateFactory(t),i=n.get(s);void 0!==i&&(e.setValue(i.nodes),e.commit(),e.value=i.instance)}e.setValue(t)}),W=new WeakMap,j=e(t=>e=>{if(!(e instanceof M)||e instanceof P||"class"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:n}=e,{element:s}=n;W.has(e)||(s.className=n.strings.join(" "));const{classList:i}=s,o=W.get(e);for(const e in o)e in t||i.remove(e);for(const e in t){const n=t[e];if(!o||n!==o[e]){i[n?"add":"remove"](e)}}W.set(e,t)}),z=new WeakMap,G=e((t,e)=>n=>{const s=z.get(n);if(Array.isArray(t)){if(Array.isArray(s)&&s.length===t.length&&t.every((t,e)=>t===s[e]))return}else if(s===t&&(void 0!==t||z.has(n)))return;n.setValue(e()),z.set(n,Array.isArray(t)?Array.from(t):t)}),F=e(t=>e=>{if(void 0===t&&e instanceof M){if(t!==e.value){const t=e.committer.name;e.committer.element.removeAttribute(t)}}else e.setValue(t)}),B=(t,e)=>{const n=t.startNode.parentNode,s=void 0===e?t.endNode:e.startNode,i=n.insertBefore(m(),s);n.insertBefore(m(),s);const o=new A(t.options);return o.insertAfterNode(i),o},U=(t,e)=>(t.setValue(e),t.commit(),t),J=(t,e,n)=>{const s=t.startNode.parentNode,o=n?n.startNode:t.endNode,r=e.endNode.nextSibling;r!==o&&i(s,e.startNode,r,o)},q=t=>{o(t.startNode.parentNode,t.startNode,t.endNode.nextSibling)},Z=(t,e,n)=>{const s=new Map;for(let i=e;i<=n;i++)s.set(t[i],i);return s},X=new WeakMap,K=new WeakMap,Q=e((t,e,n)=>{let s;return void 0===n?n=e:void 0!==e&&(s=e),e=>{if(!(e instanceof A))throw new Error("repeat can only be used in text bindings");const i=X.get(e)||[],o=K.get(e)||[],r=[],a=[],l=[];let c,d,h=0;for(const e of t)l[h]=s?s(e,h):h,a[h]=n(e,h),h++;let u=0,p=i.length-1,f=0,m=a.length-1;for(;u<=p&&f<=m;)if(null===i[u])u++;else if(null===i[p])p--;else if(o[u]===l[f])r[f]=U(i[u],a[f]),u++,f++;else if(o[p]===l[m])r[m]=U(i[p],a[m]),p--,m--;else if(o[u]===l[m])r[m]=U(i[u],a[m]),J(e,i[u],r[m+1]),u++,m--;else if(o[p]===l[f])r[f]=U(i[p],a[f]),J(e,i[p],i[u]),p--,f++;else if(void 0===c&&(c=Z(l,f,m),d=Z(o,u,p)),c.has(o[u]))if(c.has(o[p])){const t=d.get(l[f]),n=void 0!==t?i[t]:null;if(null===n){const t=B(e,i[u]);U(t,a[f]),r[f]=t}else r[f]=U(n,a[f]),J(e,n,i[u]),i[t]=null;f++}else q(i[p]),p--;else q(i[u]),u++;for(;f<=m;){const t=B(e,r[m+1]);U(t,a[f]),r[f++]=t}for(;u<=p;){const t=i[u++];null!==t&&q(t)}X.set(e,r),K.set(e,l)}}),tt=new WeakMap,et=e(t=>e=>{if(!(e instanceof M)||e instanceof P||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:n}=e,{style:s}=n.element;tt.has(e)||(s.cssText=n.strings.join(" "));const i=tt.get(e);for(const e in i)e in t||(-1===e.indexOf("-")?s[e]=null:s.removeProperty(e));for(const e in t)-1===e.indexOf("-")?s[e]=t[e]:s.setProperty(e,t[e]);tt.set(e,t)}),nt=new WeakMap,st=e(t=>e=>{if(!(e instanceof A))throw new Error("unsafeHTML can only be used in text bindings");const n=nt.get(e);if(void 0!==n&&w(t)&&t===n.value&&e.value===n.fragment)return;const s=document.createElement("template");s.innerHTML=t;const i=document.importNode(s.content,!0);e.setValue(i),nt.set(e,{value:t,fragment:i})}),it=new WeakMap,ot=e((...t)=>e=>{let n=it.get(e);void 0===n&&(n={lastRenderedIndex:2147483647,values:[]},it.set(e,n));const s=n.values;let i=s.length;n.values=t;for(let o=0;o<t.length&&!(o>n.lastRenderedIndex);o++){const r=t[o];if(w(r)||"function"!=typeof r.then){e.setValue(r),n.lastRenderedIndex=o;break}o<i&&r===s[o]||(n.lastRenderedIndex=2147483647,i=0,Promise.resolve(r).then(t=>{const s=n.values.indexOf(r);s>-1&&s<n.lastRenderedIndex&&(n.lastRenderedIndex=s,e.setValue(t),e.commit())}))}});function rt(t,n){let s=0;const i={};let o,r,a=[],l=0;const c=Promise.resolve();function d(t){return e((function(e,n){return function(s){const i=s.committer.element;for(const s of e)if("function"==typeof s){const e=a.find(e=>e.instance===t&&e.componentAction.create===s&&e.element===i);if(e)e.props=n;else{void 0!==i.__vido__&&delete i.__vido__;const e={create:s,update(){},destroy(){}};a.push({instance:t,componentAction:e,element:i,props:n})}}}}))}const h={state:t,api:n,html:k,svg:H,directive:e,cache:Y,classMap:j,guard:G,ifDefined:F,repeat:Q,styleMap:et,unsafeHTML:st,until:ot,actions(t,e){},createComponent(t,e){const n=t.name+":"+s++,o=function(t){return{instance:t,destroy:()=>h.destroyComponent(t),update:()=>h.updateTemplate(),html:(e={})=>i[t].update(e)}}(n);const r=[];const a=Object.assign(Object.assign({},h),{update:function(){h.updateTemplate()},onDestroy:function(t){r.push(t)},instance:n,actions:d(n)});let l,c;if("function"==typeof(l=e?t(e,a):t(a))){c={update:l,destroy:()=>{r.forEach(t=>t())}}}else{const t=c.destroy,e=()=>{r.forEach(t=>t()),t()};c=Object.assign(Object.assign({},l),{destroy:e})}return i[n]=c,o},destroyComponent(t){"function"==typeof i[t].destroy&&i[t].destroy(),a=a.filter(e=>(e.instance===t&&"function"==typeof e.componentAction.destroy&&e.componentAction.destroy(e.element,e.props),e.instance!==t)),delete i[t]},updateTemplate(){const t=++l,e=this;c.then((function(){t===l&&(e.render(),l=0)}))},createApp(t,e){r=e;const n=this.createComponent(t);return o=n.instance,this.render(),n},executeActions(){for(const t of a)if(void 0===t.element.__vido__){if("function"==typeof t.componentAction.create){const e=t.componentAction.create(t.element,t.props);void 0!==e&&("function"==typeof e.update&&(t.componentAction.update=e.update),"function"==typeof e.destroy&&(t.componentAction.destroy=e.destroy))}}else"function"==typeof t.componentAction.update&&t.componentAction.update(t.element,t.props);for(const t of a)t.element.__vido__={instance:t.instance,props:t.props}},render(){V(i[o].update(),r),h.executeActions()}};return h}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */const at=["","list","list-column","list-column-header","list-expander","list-expander-toggle","list-column-header-resizer","list-column-row","chart","chart-calendar","chart-gantt","chart-gantt-grid","chart-gantt-grid-row","chart-gantt-items","chart-gantt-items-row","chart-gantt-items-row-item","chart-calendar-date","chart-gantt-grid-column","chart-gantt-grid-block"];const lt={height:740,headerHeight:86,list:{rows:{},rowHeight:40,columns:{percent:100,resizer:{width:10,inRealTime:!0,dots:6},data:{}},expander:{padding:20,size:20,icons:{open:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',closed:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'}}},scroll:{top:0,left:0,xMultiplier:1.5,yMultiplier:1,percent:{top:0,left:0}},chart:{time:{from:0,to:0,zoom:21,period:"day",dates:[]},calendar:{vertical:{smallFormat:"YYYY-MM-DD"}},grid:{},items:{}},classNames:{},actions:function(){const t={};return at.forEach(e=>t[e]=[]),t}(),locale:{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekStart:1,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},ordinal:t=>{const e=["th","st","nd","rd"],n=t%100;return`[${t}${e[(n-20)%10]||e[n]||e[0]}]`}}};"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var ct=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t,e){t.exports=function(){var t="millisecond",e="second",n="minute",s="hour",i="day",o="week",r="month",a="quarter",l="year",c=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,d=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,h=function(t,e,n){var s=String(t);return!s||s.length>=e?t:""+Array(e+1-s.length).join(n)+t},u={s:h,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),s=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+h(s,2,"0")+":"+h(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),s=t.clone().add(n,r),i=e-s<0,o=t.clone().add(n+(i?-1:1),r);return Number(-(n+(e-s)/(i?s-o:o-s))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(c){return{M:r,y:l,w:o,d:i,h:s,m:n,s:e,ms:t,Q:a}[c]||String(c||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},p={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},f="en",m={};m[f]=p;var g=function(t){return t instanceof _},v=function(t,e,n){var s;if(!t)return f;if("string"==typeof t)m[t]&&(s=t),e&&(m[t]=e,s=t);else{var i=t.name;m[i]=t,s=i}return n||(f=s),s},b=function(t,e,n){if(g(t))return t.clone();var s=e?"string"==typeof e?{format:e,pl:n}:e:{};return s.date=t,new _(s)},y=u;y.l=v,y.i=g,y.w=function(t,e){return b(t,{locale:e.$L,utc:e.$u})};var _=function(){function h(t){this.$L=this.$L||v(t.locale,null,!0),this.parse(t)}var u=h.prototype;return u.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(y.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var s=e.match(c);if(s)return n?new Date(Date.UTC(s[1],s[2]-1,s[3]||1,s[4]||0,s[5]||0,s[6]||0,s[7]||0)):new Date(s[1],s[2]-1,s[3]||1,s[4]||0,s[5]||0,s[6]||0,s[7]||0)}return new Date(e)}(t),this.init()},u.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},u.$utils=function(){return y},u.isValid=function(){return!("Invalid Date"===this.$d.toString())},u.isSame=function(t,e){var n=b(t);return this.startOf(e)<=n&&n<=this.endOf(e)},u.isAfter=function(t,e){return b(t)<this.startOf(e)},u.isBefore=function(t,e){return this.endOf(e)<b(t)},u.$g=function(t,e,n){return y.u(t)?this[e]:this.set(n,t)},u.year=function(t){return this.$g(t,"$y",l)},u.month=function(t){return this.$g(t,"$M",r)},u.day=function(t){return this.$g(t,"$W",i)},u.date=function(t){return this.$g(t,"$D","date")},u.hour=function(t){return this.$g(t,"$H",s)},u.minute=function(t){return this.$g(t,"$m",n)},u.second=function(t){return this.$g(t,"$s",e)},u.millisecond=function(e){return this.$g(e,"$ms",t)},u.unix=function(){return Math.floor(this.valueOf()/1e3)},u.valueOf=function(){return this.$d.getTime()},u.startOf=function(t,a){var c=this,d=!!y.u(a)||a,h=y.p(t),u=function(t,e){var n=y.w(c.$u?Date.UTC(c.$y,e,t):new Date(c.$y,e,t),c);return d?n:n.endOf(i)},p=function(t,e){return y.w(c.toDate()[t].apply(c.toDate(),(d?[0,0,0,0]:[23,59,59,999]).slice(e)),c)},f=this.$W,m=this.$M,g=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case l:return d?u(1,0):u(31,11);case r:return d?u(1,m):u(0,m+1);case o:var b=this.$locale().weekStart||0,_=(f<b?f+7:f)-b;return u(d?g-_:g+(6-_),m);case i:case"date":return p(v+"Hours",0);case s:return p(v+"Minutes",1);case n:return p(v+"Seconds",2);case e:return p(v+"Milliseconds",3);default:return this.clone()}},u.endOf=function(t){return this.startOf(t,!1)},u.$set=function(o,a){var c,d=y.p(o),h="set"+(this.$u?"UTC":""),u=(c={},c[i]=h+"Date",c.date=h+"Date",c[r]=h+"Month",c[l]=h+"FullYear",c[s]=h+"Hours",c[n]=h+"Minutes",c[e]=h+"Seconds",c[t]=h+"Milliseconds",c)[d],p=d===i?this.$D+(a-this.$W):a;if(d===r||d===l){var f=this.clone().set("date",1);f.$d[u](p),f.init(),this.$d=f.set("date",Math.min(this.$D,f.daysInMonth())).toDate()}else u&&this.$d[u](p);return this.init(),this},u.set=function(t,e){return this.clone().$set(t,e)},u.get=function(t){return this[y.p(t)]()},u.add=function(t,a){var c,d=this;t=Number(t);var h=y.p(a),u=function(e){var n=b(d);return y.w(n.date(n.date()+Math.round(e*t)),d)};if(h===r)return this.set(r,this.$M+t);if(h===l)return this.set(l,this.$y+t);if(h===i)return u(1);if(h===o)return u(7);var p=(c={},c[n]=6e4,c[s]=36e5,c[e]=1e3,c)[h]||1,f=this.valueOf()+t*p;return y.w(f,this)},u.subtract=function(t,e){return this.add(-1*t,e)},u.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",s=y.z(this),i=this.$locale(),o=this.$H,r=this.$m,a=this.$M,l=i.weekdays,c=i.months,h=function(t,s,i,o){return t&&(t[s]||t(e,n))||i[s].substr(0,o)},u=function(t){return y.s(o%12||12,t,"0")},p=i.meridiem||function(t,e,n){var s=t<12?"AM":"PM";return n?s.toLowerCase():s},f={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:y.s(a+1,2,"0"),MMM:h(i.monthsShort,a,c,3),MMMM:c[a]||c(this,n),D:this.$D,DD:y.s(this.$D,2,"0"),d:String(this.$W),dd:h(i.weekdaysMin,this.$W,l,2),ddd:h(i.weekdaysShort,this.$W,l,3),dddd:l[this.$W],H:String(o),HH:y.s(o,2,"0"),h:u(1),hh:u(2),a:p(o,r,!0),A:p(o,r,!1),m:String(r),mm:y.s(r,2,"0"),s:String(this.$s),ss:y.s(this.$s,2,"0"),SSS:y.s(this.$ms,3,"0"),Z:s};return n.replace(d,(function(t,e){return e||f[t]||s.replace(":","")}))},u.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},u.diff=function(t,c,d){var h,u=y.p(c),p=b(t),f=6e4*(p.utcOffset()-this.utcOffset()),m=this-p,g=y.m(this,p);return g=(h={},h[l]=g/12,h[r]=g,h[a]=g/3,h[o]=(m-f)/6048e5,h[i]=(m-f)/864e5,h[s]=m/36e5,h[n]=m/6e4,h[e]=m/1e3,h)[u]||m,d?g:y.a(g)},u.daysInMonth=function(){return this.endOf(r).$D},u.$locale=function(){return m[this.$L]},u.locale=function(t,e){if(!t)return this.$L;var n=this.clone();return n.$L=v(t,e,!0),n},u.clone=function(){return y.w(this.toDate(),this)},u.toDate=function(){return new Date(this.$d)},u.toJSON=function(){return this.isValid()?this.toISOString():null},u.toISOString=function(){return this.$d.toISOString()},u.toString=function(){return this.$d.toUTCString()},h}();return b.prototype=_.prototype,b.extend=function(t,e){return t(e,_,b),b},b.locale=v,b.isDayjs=g,b.unix=function(t){return b(1e3*t)},b.en=m[f],b.Ls=m,b}()}));
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function dt(t,e){const n=t.get("config.locale");return ct.locale(n,null,!0),{date:t=>t?ct(t).locale(n.name):ct().locale(n.name),recalculateFromTo(e){0!==(e={...e}).from&&(e.from=this.date(e.from).startOf("day").valueOf()),0!==e.to&&(e.to=this.date(e.to).endOf("day").valueOf());let n=Number.MAX_SAFE_INTEGER,s=0;const i=t.get("config.chart.items");if(0===Object.keys(i).length)return e;if(0===e.from||0===e.to){for(let t in i){const e=i[t];n>e.time.start&&(n=e.time.start),s<e.time.end&&(s=e.time.end)}0===e.from&&(e.from=this.date(n).startOf("day").valueOf()),0===e.to&&(e.to=this.date(s).endOf("day").valueOf())}return e}}}class ht{constructor(t,e="*"){this.wchar=e,this.pattern=t,this.segments=[],this.starCount=0,this.minLength=0,this.maxLength=0,this.segStartIndex=0;for(let n=0,s=t.length;n<s;n+=1){const s=t[n];s===e&&(this.starCount+=1,n>this.segStartIndex&&this.segments.push(t.substring(this.segStartIndex,n)),this.segments.push(s),this.segStartIndex=n+1)}this.segStartIndex<t.length&&this.segments.push(t.substring(this.segStartIndex)),this.starCount?(this.minLength=t.length-this.starCount,this.maxLength=1/0):this.maxLength=this.minLength=t.length}match(t){if(this.pattern===this.wchar)return!0;if(0===this.segments.length)return this.pattern===t;const{length:e}=t;if(e<this.minLength||e>this.maxLength)return!1;let n=this.segments.length-1,s=t.length-1,i=!1;for(;;){const e=this.segments[n];if(n-=1,e===this.wchar)i=!0;else{const n=s+1-e.length,o=t.lastIndexOf(e,n);if(-1===o||o>n)return!1;if(i)s=o-1,i=!1;else{if(o!==n)return!1;s-=e.length}}if(0>n)break}return!0}}class ut{constructor(t,e,n){this.obj=t,this.delimeter=e,this.wildcard=n}simpleMatch(t,e){if(t===e)return!0;if(t===this.wildcard)return!0;const n=t.indexOf(this.wildcard);if(n>-1){const s=t.substr(n+1);if(0===n||e.substring(0,n)===t.substring(0,n)){const t=s.length;return!(t>0)||e.substr(-t)===s}}return!1}match(t,e){return t===e||t===this.wildcard||e===this.wildcard||this.simpleMatch(t,e)||new ht(t).match(e)}handleArray(t,e,n,s,i={}){let o=t.indexOf(this.delimeter,n),r=!1;-1===o&&(r=!0,o=t.length);const a=t.substring(n,o);let l=0;for(const n of e){const e=l.toString(),c=""===s?e:s+this.delimeter+l;(a===this.wildcard||a===e||this.simpleMatch(a,e))&&(r?i[c]=n:this.goFurther(t,n,o+1,c,i)),l++}return i}handleObject(t,e,n,s,i={}){let o=t.indexOf(this.delimeter,n),r=!1;-1===o&&(r=!0,o=t.length);const a=t.substring(n,o);for(let n in e){n=n.toString();const l=""===s?n:s+this.delimeter+n;(a===this.wildcard||a===n||this.simpleMatch(a,n))&&(r?i[l]=e[n]:this.goFurther(t,e[n],o+1,l,i))}return i}goFurther(t,e,n,s,i={}){return Array.isArray(e)?this.handleArray(t,e,n,s,i):this.handleObject(t,e,n,s,i)}get(t){return this.goFurther(t,this.obj,0,"")}}class pt{static get(t,e,n=null){if(null===n&&(n=t.slice()),0===n.length||void 0===e)return e;const s=n.shift();return e.hasOwnProperty(s)?0===n.length?e[s]:pt.get(t,e[s],n):void 0}static set(t,e,n,s=null){if(null===s&&(s=t.slice()),0===s.length){for(const t in n)delete n[t];for(const t in e)n[t]=e[t];return}const i=s.shift();0!==s.length?(n.hasOwnProperty(i)||(n[i]={}),pt.set(t,e,n[i],s)):n[i]=e}}const ft={delimeter:".",notRecursive:";",param:":",wildcard:"*",log:function(t,e){console.debug(t,e)}},mt={bulk:!1,debug:!1,source:"",data:void 0},gt={only:[],source:"",debug:!1,data:void 0};class vt{constructor(t={},e=ft){this.listeners={},this.data=t,this.options=Object.assign(Object.assign({},ft),e),this.id=0,this.pathGet=pt.get,this.pathSet=pt.set,this.scan=new ut(this.data,this.options.delimeter,this.options.wildcard)}getListeners(){return this.listeners}destroy(){this.data=void 0,this.listeners={}}match(t,e){return t===e||(t===this.options.wildcard||e===this.options.wildcard||this.scan.match(t,e))}cutPath(t,e){return this.split(this.cleanNotRecursivePath(t)).slice(0,this.split(this.cleanNotRecursivePath(e)).length).join(this.options.delimeter)}trimPath(t){return this.cleanNotRecursivePath(t).replace(new RegExp(`^\\${this.options.delimeter}{1}`),"")}split(t){return""===t?[]:t.split(this.options.delimeter)}isWildcard(t){return t.includes(this.options.wildcard)}isNotRecursive(t){return t.endsWith(this.options.notRecursive)}cleanNotRecursivePath(t){return this.isNotRecursive(t)?t.slice(0,-this.options.notRecursive.length):t}hasParams(t){return t.includes(this.options.param)}getParamsInfo(t){let e={replaced:"",original:t,params:{}},n=0,s=[];for(const i of this.split(t)){e.params[n]={original:i,replaced:"",name:""};const t=new RegExp(`\\${this.options.param}([^\\${this.options.delimeter}\\${this.options.param}]+)`,"g");let o=t.exec(i);o?(e.params[n].name=o[1],t.lastIndex=0,e.params[n].replaced=i.replace(t,this.options.wildcard),s.push(e.params[n].replaced),n++):(delete e.params[n],s.push(i),n++)}return e.replaced=s.join(this.options.delimeter),e}getParams(t,e){if(!t)return;const n=this.split(e),s={};for(const e in t.params){s[t.params[e].name]=n[e]}return s}subscribeAll(t,e,n=mt){let s=[];for(const i of t)s.push(this.subscribe(i,e,n));return()=>{for(const t of s)t();s=[]}}getCleanListenersCollection(t={}){return Object.assign({listeners:{},isRecursive:!1,isWildcard:!1,hasParams:!1,match:void 0,paramsInfo:void 0,path:void 0,count:0},t)}getCleanListener(t,e=mt){return{fn:t,options:Object.assign(Object.assign({},mt),e)}}getListenerCollectionMatch(t,e,n){return t=this.cleanNotRecursivePath(t),s=>(e&&(s=this.cutPath(s,t)),!(!n||!this.match(t,s))||t===s)}getListenersCollection(t,e){if(void 0!==this.listeners[t]){let n=this.listeners[t];return this.id++,n.listeners[this.id]=e,n}let n={isRecursive:!0,isWildcard:!1,hasParams:!1,paramsInfo:void 0,originalPath:t,path:t};this.hasParams(n.path)&&(n.paramsInfo=this.getParamsInfo(n.path),n.path=n.paramsInfo.replaced,n.hasParams=!0),n.isWildcard=this.isWildcard(n.path),this.isNotRecursive(n.path)&&(n.isRecursive=!1);let s=this.listeners[n.path]=this.getCleanListenersCollection(Object.assign(Object.assign({},n),{match:this.getListenerCollectionMatch(n.path,n.isRecursive,n.isWildcard)}));return this.id++,s.listeners[this.id]=e,s}subscribe(t,e,n=mt,s="subscribe"){let i=this.getCleanListener(e,n);const o=this.getListenersCollection(t,i);if(o.count++,t=o.path,o.isWildcard){const r=this.scan.get(this.cleanNotRecursivePath(t));if(n.bulk){const a=[];for(const t in r)a.push({path:t,params:this.getParams(o.paramsInfo,t),value:r[t]});e(a,{type:s,listener:i,listenersCollection:o,path:{listener:t,update:void 0,resolved:void 0},options:n,params:void 0})}else for(const a in r)e(r[a],{type:s,listener:i,listenersCollection:o,path:{listener:t,update:void 0,resolved:this.cleanNotRecursivePath(a)},params:this.getParams(o.paramsInfo,a),options:n})}else e(this.pathGet(this.split(this.cleanNotRecursivePath(t)),this.data),{type:s,listener:i,listenersCollection:o,path:{listener:t,update:void 0,resolved:this.cleanNotRecursivePath(t)},params:this.getParams(o.paramsInfo,t),options:n});return this.debugSubscribe(i,o,t),this.unsubscribe(t,this.id)}unsubscribe(t,e){const n=this.listeners,s=n[t];return function(){delete s.listeners[e],s.count--,0===s.count&&delete n[t]}}same(t,e){return(["number","string","undefined","boolean"].includes(typeof t)||null===t)&&e===t}notifyListeners(t,e=[],n=!0){const s=[];for(const i in t){let{single:o,bulk:r}=t[i];for(const t of o){if(e.includes(t))continue;const i=this.debugTime(t);t.listener.fn(t.value(),t.eventInfo),n&&s.push(t),this.debugListener(i,t)}for(const t of r){if(e.includes(t))continue;const i=this.debugTime(t),o=t.value.map(t=>Object.assign(Object.assign({},t),{value:t.value()}));t.listener.fn(o,t.eventInfo),n&&s.push(t),this.debugListener(i,t)}}return s}getSubscribedListeners(t,e,n,s="update",i=null){n=Object.assign(Object.assign({},gt),n);const o={};for(let r in this.listeners){const a=this.listeners[r];if(o[r]={single:[],bulk:[],bulkData:[]},a.match(t)){const l=a.paramsInfo?this.getParams(a.paramsInfo,t):void 0,c=a.isRecursive||a.isWildcard?()=>this.get(this.cutPath(t,r)):()=>e,d=[{value:c,path:t,params:l}];for(const e in a.listeners){const h=a.listeners[e];h.options.bulk?o[r].bulk.push({listener:h,listenersCollection:a,eventInfo:{type:s,listener:h,path:{listener:r,update:i||t,resolved:void 0},params:l,options:n},value:d}):o[r].single.push({listener:h,listenersCollection:a,eventInfo:{type:s,listener:h,path:{listener:r,update:i||t,resolved:this.cleanNotRecursivePath(t)},params:l,options:n},value:c})}}}return o}notifySubscribedListeners(t,e,n,s="update",i=null){return this.notifyListeners(this.getSubscribedListeners(t,e,n,s,i))}getNestedListeners(t,e,n,s="update",i=null){const o={};for(let r in this.listeners){o[r]={single:[],bulk:[]};const a=this.listeners[r],l=this.cutPath(r,t);if(this.match(l,t)){const c=this.trimPath(r.substr(l.length)),d=new ut(e,this.options.delimeter,this.options.wildcard).get(c),h=a.paramsInfo?this.getParams(a.paramsInfo,t):void 0,u=[],p={};for(const e in d){const l=()=>d[e],c=[t,e].join(this.options.delimeter);for(const e in a.listeners){const d=a.listeners[e],f={type:s,listener:d,listenersCollection:a,path:{listener:r,update:i||t,resolved:this.cleanNotRecursivePath(c)},params:h,options:n};d.options.bulk?(u.push({value:l,path:c,params:h}),p[e]=d):o[r].single.push({listener:d,listenersCollection:a,eventInfo:f,value:l})}}for(const e in p){const i=p[e],l={type:s,listener:i,listenersCollection:a,path:{listener:r,update:t,resolved:void 0},options:n,params:h};o[r].bulk.push({listener:i,listenersCollection:a,eventInfo:l,value:u})}}}return o}notifyNestedListeners(t,e,n,s="update",i,o=null){return this.notifyListeners(this.getNestedListeners(t,e,n,s,o),i,!1)}getNotifyOnlyListeners(t,e,n,s="update",i=null){const o={};if("object"!=typeof n.only||!Array.isArray(n.only)||void 0===n.only[0]||!this.canBeNested(e))return o;for(const r of n.only){const a=new ut(e,this.options.delimeter,this.options.wildcard).get(r);o[r]={bulk:[],single:[]};for(const e in a){const l=t+this.options.delimeter+e;for(const c in this.listeners){const d=this.listeners[c],h=d.paramsInfo?this.getParams(d.paramsInfo,l):void 0;if(this.match(c,l)){const u=()=>a[e],p=[{value:u,path:l,params:h}];for(const e in d.listeners){const a=d.listeners[e],f={type:s,listener:a,listenersCollection:d,path:{listener:c,update:i||t,resolved:this.cleanNotRecursivePath(l)},params:h,options:n};a.options.bulk?o[r].bulk.some(t=>t.listener===a)||o[r].bulk.push({listener:a,listenersCollection:d,eventInfo:f,value:p}):o[r].single.push({listener:a,listenersCollection:d,eventInfo:f,value:u})}}}}}return o}notifyOnly(t,e,n,s="update",i=null){return void 0!==this.notifyListeners(this.getNotifyOnlyListeners(t,e,n,s,i))[0]}canBeNested(t){return"object"==typeof t&&null!==t}getUpdateValues(t,e,n){"object"==typeof t&&null!==t&&(t=Array.isArray(t)?t.slice():Object.assign({},t));let s=n;return"function"==typeof n&&(s=n(this.pathGet(e,this.data))),{newValue:s,oldValue:t}}wildcardUpdate(t,e,n=gt){n=Object.assign(Object.assign({},gt),n);const s=this.scan.get(t),i={};for(const t in s){const n=this.split(t),{oldValue:o,newValue:r}=this.getUpdateValues(s[t],n,e);this.same(r,o)||(i[t]=r)}const o=[];for(const e in i){const s=i[e];n.only.length?o.push(this.getNotifyOnlyListeners(e,s,n,"update",t)):(o.push(this.getSubscribedListeners(e,s,n,"update",t)),this.canBeNested(s)&&o.push(this.getNestedListeners(e,s,n,"update",t))),n.debug&&this.options.log("Wildcard update",{path:e,newValue:s}),this.pathSet(this.split(e),s,this.data)}let r=[];for(const t of o)r=[...r,...this.notifyListeners(t,r)]}update(t,e,n=gt){if(this.isWildcard(t))return this.wildcardUpdate(t,e,n);const s=this.split(t),{oldValue:i,newValue:o}=this.getUpdateValues(this.pathGet(s,this.data),s,e);if(n.debug&&this.options.log(`Updating ${t} ${n.source?`from ${n.source}`:""}`,i,o),this.same(o,i))return o;if(this.pathSet(s,o,this.data),n=Object.assign(Object.assign({},gt),n),this.notifyOnly(t,o,n))return o;const r=this.notifySubscribedListeners(t,o,n);return this.canBeNested(o)&&this.notifyNestedListeners(t,o,n,"update",r),o}get(t){return void 0===t||""===t?this.data:this.pathGet(this.split(t),this.data)}debugSubscribe(t,e,n){t.options.debug&&this.options.log("listener subscribed",n,t,e)}debugListener(t,e){(e.eventInfo.options.debug||e.listener.options.debug)&&this.options.log("Listener fired",{time:Date.now()-t,info:e})}debugTime(t){return t.listener.options.debug||t.eventInfo.options.debug?Date.now():0}}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */const bt="gantt-schedule-timeline-calendar";function yt(t){return t&&"object"==typeof t&&!Array.isArray(t)}function _t(t,...e){const n=e.shift();if(yt(t)&&yt(n))for(const e in n)if(yt(n[e]))void 0===t[e]&&(t[e]={}),t[e]=_t(t[e],n[e]);else if(Array.isArray(n[e])){t[e]=[];for(let s of n[e])yt(s)?t[e].push(_t({},s)):t[e].push(s)}else t[e]=n[e];return e.length?_t(t,...e):t}const wt={name:bt,stateFromConfig:function(t){const e=function(t){const e=_t({},lt.actions),n=_t({},t.actions),s=[Object.keys(e),Object.keys(n)].flatMap((t,e,n)=>1===e?t.filter(t=>!n[0].includes(t)):t),i={};for(const t of s)i[t]=[],void 0!==e[t]&&Array.isArray(e[t])&&(i[t]=[...e[t]]),void 0!==n[t]&&Array.isArray(n[t])&&(i[t]=[...i[t],...n[t]]);return delete t.actions,delete lt.actions,i}(t),n={config:_t({},lt,t)};return n.config.actions=e,new vt(n,{delimeter:"."})},mergeDeep:_t,date:t=>t?ct(t):ct(),dayjs:ct};var $t=function(){if("undefined"!=typeof Map)return Map;function t(t,e){var n=-1;return t.some((function(t,s){return t[0]===e&&(n=s,!0)})),n}return(function(){function e(){this.__entries__=[]}return Object.defineProperty(e.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),e.prototype.get=function(e){var n=t(this.__entries__,e),s=this.__entries__[n];return s&&s[1]},e.prototype.set=function(e,n){var s=t(this.__entries__,e);~s?this.__entries__[s][1]=n:this.__entries__.push([e,n])},e.prototype.delete=function(e){var n=this.__entries__,s=t(n,e);~s&&n.splice(s,1)},e.prototype.has=function(e){return!!~t(this.__entries__,e)},e.prototype.clear=function(){this.__entries__.splice(0)},e.prototype.forEach=function(t,e){void 0===e&&(e=null);for(var n=0,s=this.__entries__;n<s.length;n++){var i=s[n];t.call(e,i[1],i[0])}},e}())}(),xt="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,Mt="undefined"!=typeof global&&global.Math===Math?global:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),At="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(Mt):function(t){return setTimeout((function(){return t(Date.now())}),1e3/60)},Nt=2;var Ot=20,Pt=["top","right","bottom","left","width","height","size","weight"],Ct="undefined"!=typeof MutationObserver,Dt=function(){function t(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=function(t,e){var n=!1,s=!1,i=0;function o(){n&&(n=!1,t()),s&&a()}function r(){At(o)}function a(){var t=Date.now();if(n){if(t-i<Nt)return;s=!0}else n=!0,s=!1,setTimeout(r,e);i=t}return a}(this.refresh.bind(this),Ot)}return t.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},t.prototype.removeObserver=function(t){var e=this.observers_,n=e.indexOf(t);~n&&e.splice(n,1),!e.length&&this.connected_&&this.disconnect_()},t.prototype.refresh=function(){this.updateObservers_()&&this.refresh()},t.prototype.updateObservers_=function(){var t=this.observers_.filter((function(t){return t.gatherActive(),t.hasActive()}));return t.forEach((function(t){return t.broadcastActive()})),t.length>0},t.prototype.connect_=function(){xt&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),Ct?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},t.prototype.disconnect_=function(){xt&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},t.prototype.onTransitionEnd_=function(t){var e=t.propertyName,n=void 0===e?"":e;Pt.some((function(t){return!!~n.indexOf(t)}))&&this.refresh()},t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},t.instance_=null,t}(),Et=function(t,e){for(var n=0,s=Object.keys(e);n<s.length;n++){var i=s[n];Object.defineProperty(t,i,{value:e[i],enumerable:!1,writable:!1,configurable:!0})}return t},Tt=function(t){return t&&t.ownerDocument&&t.ownerDocument.defaultView||Mt},It=Rt(0,0,0,0);function St(t){return parseFloat(t)||0}function Lt(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return e.reduce((function(e,n){return e+St(t["border-"+n+"-width"])}),0)}function Vt(t){var e=t.clientWidth,n=t.clientHeight;if(!e&&!n)return It;var s=Tt(t).getComputedStyle(t),i=function(t){for(var e={},n=0,s=["top","right","bottom","left"];n<s.length;n++){var i=s[n],o=t["padding-"+i];e[i]=St(o)}return e}(s),o=i.left+i.right,r=i.top+i.bottom,a=St(s.width),l=St(s.height);if("border-box"===s.boxSizing&&(Math.round(a+o)!==e&&(a-=Lt(s,"left","right")+o),Math.round(l+r)!==n&&(l-=Lt(s,"top","bottom")+r)),!function(t){return t===Tt(t).document.documentElement}(t)){var c=Math.round(a+o)-e,d=Math.round(l+r)-n;1!==Math.abs(c)&&(a-=c),1!==Math.abs(d)&&(l-=d)}return Rt(i.left,i.top,a,l)}var kt="undefined"!=typeof SVGGraphicsElement?function(t){return t instanceof Tt(t).SVGGraphicsElement}:function(t){return t instanceof Tt(t).SVGElement&&"function"==typeof t.getBBox};function Ht(t){return xt?kt(t)?function(t){var e=t.getBBox();return Rt(0,0,e.width,e.height)}(t):Vt(t):It}function Rt(t,e,n,s){return{x:t,y:e,width:n,height:s}}var Yt=function(){function t(t){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=Rt(0,0,0,0),this.target=t}return t.prototype.isActive=function(){var t=Ht(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},t.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t},t}(),Wt=function(t,e){var n,s,i,o,r,a,l,c=(s=(n=e).x,i=n.y,o=n.width,r=n.height,a="undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object,l=Object.create(a.prototype),Et(l,{x:s,y:i,width:o,height:r,top:i,right:s+o,bottom:r+i,left:s}),l);Et(this,{target:t,contentRect:c})},jt=function(){function t(t,e,n){if(this.activeObservations_=[],this.observations_=new $t,"function"!=typeof t)throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=t,this.controller_=e,this.callbackCtx_=n}return t.prototype.observe=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof Tt(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)||(e.set(t,new Yt(t)),this.controller_.addObserver(this),this.controller_.refresh())}},t.prototype.unobserve=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof Tt(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)&&(e.delete(t),e.size||this.controller_.removeObserver(this))}},t.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},t.prototype.gatherActive=function(){var t=this;this.clearActive(),this.observations_.forEach((function(e){e.isActive()&&t.activeObservations_.push(e)}))},t.prototype.broadcastActive=function(){if(this.hasActive()){var t=this.callbackCtx_,e=this.activeObservations_.map((function(t){return new Wt(t.target,t.broadcastRect())}));this.callback_.call(t,e,t),this.clearActive()}},t.prototype.clearActive=function(){this.activeObservations_.splice(0)},t.prototype.hasActive=function(){return this.activeObservations_.length>0},t}(),zt="undefined"!=typeof WeakMap?new WeakMap:new $t,Gt=function t(e){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var n=Dt.getInstance(),s=new jt(e,n,this);zt.set(this,s)};["observe","unobserve","disconnect"].forEach((function(t){Gt.prototype[t]=function(){var e;return(e=zt.get(this))[t].apply(e,arguments)}}));var Ft=void 0!==Mt.ResizeObserver?Mt.ResizeObserver:Gt;
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Bt(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,unsafeHTML:l}=e,c="list-expander-toggle",d=n.getActions(c);let h,u,p,f,m,g,v=!1;function b(){v=!v,t.row?s.update(`config.list.rows.${t.row.id}.expanded`,v):s.update("config.list.rows",t=>{for(const e in t)t[e].expanded=v;return t},{only:["*.expanded"]})}return i(s.subscribe("config.classNames",e=>{t.row?(h=n.getClass(c,{row:t.row}),p=n.getClass(c+"-open",{row:t.row}),f=n.getClass(c+"-closed",{row:t.row})):(h=n.getClass(c),p=n.getClass(c+"-open"),f=n.getClass(c+"-closed")),r()})),i(s.subscribeAll(["config.list.expander.size","config.list.expander.icons"],()=>{const t=s.get("config.list.expander");u=`--size: ${t.size}px`,m=t.icons.open,g=t.icons.closed,r()})),t.row?i(s.subscribe(`config.list.rows.${t.row.id}.expanded`,t=>{v=t,r()})):i(s.subscribe("config.list.rows.*.expanded",t=>{for(const e of t)if(e.value){v=!0;break}r()},{bulk:!0})),()=>a`
    <div
      class=${h}
      data-actions=${o(d,{row:t.row,api:n,state:s})}
      style=${u}
      @click=${b}
    >
      ${v?a`
            <div class=${p}>
              ${l(m)}
            </div>
          `:a`
            <div class=${f}>
              ${l(g)}
            </div>
          `}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Ut(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,createComponent:l}=e,c=n.getActions("list-expander");let d,h,u,p,f=[];i(s.subscribe("config.classNames",e=>{t.row?(d=n.getClass("list-expander",{row:t.row}),p=n.getClass("list-expander-padding",{row:t.row})):(d=n.getClass("list-expander"),p=n.getClass("list-expander-padding")),r()})),i(s.subscribeAll(["config.list.expander.padding"],t=>{h=t,r()})),t.row?i(s.subscribe(`_internal.list.rows.${t.row.id}.parentId`,e=>{u="width:"+t.row._internal.parents.length*h+"px",f=t.row._internal.children,r()})):(u="width:0px",f=[]);const m=l(Bt,t.row?{row:t.row}:{});return i(m.destroy),()=>a`
    <div class=${d} data-action=${o(c,{row:t.row,api:n,state:s})}>
      <div class=${p} style=${u}></div>
      ${f.length||!t.row?m.html():""}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Jt({rowId:t,columnId:e},n){const{api:s,state:i,onDestroy:o,actions:r,update:a,html:l,createComponent:c}=n;let d,h,u=`config.list.rows.${t}`;o(i.subscribe(u,t=>{h=`--height: ${(d=t).height}px`,a()}));let p,f=`config.list.columns.data.${e}`;o(i.subscribe(f,t=>{p=t,a()}));const m=s.getActions("list-column-row");let g;o(i.subscribe("config.classNames",t=>{g=s.getClass("list-column-row",{row:d,column:p}),a()}));const v=c(Ut,{row:d});return o(v.destroy),t=>l`
    <div
      class=${g}
      style=${h}
      data-actions=${r(m,{column:p,row:d,api:s,state:i})}
    >
      ${"boolean"==typeof p.expander&&p.expander?v.html():""}
      ${"string"==typeof p.html?"function"==typeof p.data?l`
        ${p.data(d)}
      `:l`
      ${d[p.data]}
    `:"function"==typeof p.data?p.data(d):d[p.data]}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function qt({columnId:t},e){const{api:n,state:s,onDestroy:i,update:o,html:r,actions:a}=e,l="list-column-header-resizer",c=n.getActions(l);let d,h,u,p,f,m,g,v;i(s.subscribe(`config.list.columns.data.${t}`,t=>{d=t,o()}));let b=!1;i(s.subscribe("config.classNames",t=>{h=n.getClass(l,{column:d}),u=n.getClass(l+"-container",{column:d}),p=n.getClass(l+"-dots",{column:d}),f=n.getClass(l+"-dots-dot",{column:d}),m=n.getClass(l+"-line",{column:d}),o()})),i(s.subscribeAll([`config.list.columns.data.${d.id}.width`,"config.list.columns.percent","config.list.columns.resizer.width","config.list.columns.resizer.inRealTime"],(t,e)=>{const n=s.get("config.list");g=d.width*n.columns.percent*.01,v=`width: ${n.columns.resizer.width}px`,b=n.columns.resizer.inRealTime,o()}));let y=[1,2,3,4,5,6,7,8];i(s.subscribe("config.list.columns.resizer.dots",t=>{y=[];for(let e=0;e<t;e++)y.push(e);o()}));let _=!1,w=g;const $=`config.list.columns.data.${d.id}.width`;function x(t){_=!0,s.update("_internal.list.columns.resizer.active",!0)}function M(t){_&&((w+=t.movementX)<0&&(w=0),b&&s.update($,w))}function A(t){_&&(s.update("_internal.list.columns.resizer.active",!1),s.update($,w),_=!1)}return document.body.addEventListener("mousemove",M),i(()=>document.body.removeEventListener("mousemove",M)),document.body.addEventListener("mouseup",A),i(()=>document.body.removeEventListener("mouseup",A)),t=>r`
    <div class=${h} data-actions=${a(c,{column:d,api:n,state:s})}>
      <div class=${u}>
        ${d.header.html?r`
              ${d.header.html}
            `:d.header.content}
      </div>
      <div class=${p} style=${"--"+v} @mousedown=${x}>
        ${y.map(t=>r`
              <div class=${f} />
            `)}
      </div>
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Zt({columnId:t},e){const{api:n,state:s,onDestroy:i,actions:o,update:r,createComponent:a,html:l}=e,c=n.getActions("list-column-header");let d,h,u,p;i(s.subscribe(`config.list.columns.data.${t}`,t=>{d=t,r()})),i(s.subscribeAll(["config.classNames","config.headerHeight"],()=>{const t=s.get("config");h=n.getClass("list-column-header",{column:d}),u=n.getClass("list-column-header-content",{column:d}),p=`--height: ${t.headerHeight}px;`,r()}));const f=a(qt,{columnId:t});i(f.destroy);const m=a(Ut,{});return i(m.destroy),function(){return l`
      <div class=${h} style=${p} data-actions=${o(c,{column:d,api:n,state:s})}>
        ${"boolean"==typeof d.expander&&d.expander?l`
      <div class=${u}>
        ${m.html()}${f.html(d)}
      </div>
    `:l`
      <div class=${u}>
        ${f.html(d)}
      </div>
    `}
      </div>
    `}}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Xt({columnId:t},e){const{api:n,state:s,onDestroy:i,actions:o,update:r,createComponent:a,html:l,repeat:c}=e;let d,h=`config.list.columns.data.${t}`;i(s.subscribe(h,t=>{d=t,r()}));const u=n.getActions("list-column"),p=n.getActions("list-column-rows");let f,m,g,v,b;i(s.subscribe("config.classNames",t=>{f=n.getClass("list-column",{column:d}),m=n.getClass("list-column-rows",{column:d}),r()}));let y=[];i(s.subscribe("_internal.list.visibleRows;",e=>{y.forEach(t=>t.component.destroy()),y=e.map(e=>({id:e.id,component:a(Jt,{columnId:t,rowId:e.id})})),r()})),i(()=>{y.forEach(t=>t.component.destroy())}),i(s.subscribeAll(["config.list.columns.percent","config.list.columns.resizer.width",`config.list.columns.data.${d.id}.width`,"config.height","config.headerHeight"],t=>{const e=s.get("config.list");g=e.columns.data[d.id].width*e.columns.percent*.01,v=`width: ${g+e.columns.resizer.width}px`,b=`height: ${s.get("config.height")}px`},{bulk:!0}));const _=a(Zt,{columnId:t});return i(_.destroy),t=>l`
    <div
      class=${f}
      data-actions=${o(u,{column:d,state:s,api:n})}
      style=${v}
    >
      ${_.html()}
      <div class=${m} style=${b} data-actions=${o(p,{api:n,state:s})}>
        ${y.map(t=>t.component.html())}
      </div>
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Kt(t){const{api:e,state:n,onDestroy:s,actions:i,update:o,createComponent:r,html:a,repeat:l}=t,c=e.getActions("list");let d,h,u;s(n.subscribe("config.list",()=>{h=n.get("config.list"),u=h.columns.percent,o()})),s(n.subscribe("config.classNames",()=>{d=e.getClass("list",{list:h}),o()}));let p,f,m,g=[];function v(t){if(t.stopPropagation(),t.preventDefault(),"scroll"===t.type)n.update("config.scroll.top",t.target.scrollTop);else{const s=e.normalizeMouseWheelEvent(t);n.update("config.scroll.top",t=>e.limitScroll("top",t+=s.y*n.get("config.scroll.yMultiplier")))}}function b(t){m||(m=t.clientWidth,0===u&&(m=0),n.update("_internal.list.width",m),n.update("_internal.elements.list",t))}return s(n.subscribe("config.list.columns.data;",t=>{g.forEach(t=>t.component.destroy()),p=Object.keys(t),g=p.map(t=>{return{id:t,component:r(Xt,{columnId:t})}}),o()})),s(()=>{g.forEach(t=>t.component.destroy())}),s(n.subscribe("config.height",t=>{f=`height: ${t}px`,o()})),c.push(t=>(n.update("_internal.elements.list",t),b(t),{update:b})),t=>h.columns.percent>0?a`
          <div
            class=${d}
            data-actions=${i(c)}
            style=${f}
            @scroll=${v}
            @wheel=${v}
          >
            ${g.map(t=>t.component.html())}
          </div>
        `:null}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Qt({date:t},e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a}=e,l="chart-calendar-date",c=n.getActions(l);let d,h,u,p,f,m,g,v,b,y,_,w,$,x,M,A;return i(s.subscribe("config.classNames",()=>{d=n.getClass(l,{date:t}),n.time.date(t.leftGlobal).format("YYYY-MM-DD")===n.time.date().format("YYYY-MM-DD")&&(d+=" current"),n.time.date(t.leftGlobal).subtract(1,"day").format("YYYY-MM-DD")===n.time.date().format("YYYY-MM-DD")&&(d+=" next"),n.time.date(t.leftGlobal).add(1,"day").format("YYYY-MM-DD")===n.time.date().format("YYYY-MM-DD")&&(d+=" previous"),h=n.getClass(`${l}-formatted`,{date:t}),u=n.getClass(`${l}-formatted-year`,{date:t}),p=n.getClass(`${l}-formatted-month`,{date:t}),f=n.getClass(`${l}-formatted-day`,{date:t}),m=n.getClass(`${l}-formatted-day-word`,{date:t}),r()})),i(s.subscribeAll(["_internal.chart.time","config.chart.calendar.vertical.smallFormat"],(function(){g=s.get("_internal.chart.time"),A=g.zoom<=22?18:13,v=g.period;const e=n.time.date(t.leftGlobal),i=g.maxWidth;b=i<=40;const o=s.get("config.chart.calendar.vertical.smallFormat");y=e.format(o),_=e.format("YYYY"),w=e.format("MMMM"),$=e.format("DD"),x=e.format("dddd"),i<=70?(_=e.format("YY"),w=e.format("MMM"),$=e.format("DD"),x=e.format("ddd")):i<=150&&(x=e.format("ddd")),M=`width: ${t.width}px; margin-left:-${t.subPx}px; --day-size: ${A}px`,r()}),{bulk:!0})),e=>a`
    <div class=${d} style=${M} data-actions=${o(c,{date:t,api:n,state:s})}>
      ${b?a`
            <div class=${h} style="transform: rotate(90deg);">${y}</div>
          `:a`
            <div class=${h}>
              <div class=${u}>${_}</div>
              <div class=${p}>${w}</div>
              <div class=${f}>${$}</div>
              <div class=${m}>${x}</div>
            </div>
          `}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function te(t){const{api:e,state:n,onDestroy:s,actions:i,update:o,createComponent:r,html:a,repeat:l}=t,c=e.getActions("chart-calendar");let d;s(n.subscribe("config.classNames",t=>{d=e.getClass("chart-calendar"),o()}));let h,u="";s(n.subscribe("config.headerHeight",t=>{u=`height: ${h=t}px;`,o()}));let p,f=[];return s(n.subscribe("_internal.chart.time.dates",t=>{p=t,f.forEach(t=>t.component.destroy()),f=[];for(const t of p)f.push({id:t.id,component:r(Qt,{date:t})});o()})),s(()=>{f.forEach(t=>t.component.destroy())}),c.push(t=>{n.update("_internal.elements.calendar",t)}),t=>a`
    <div class=${d} data-actions=${i(c)} style=${u}>
      ${l(f,t=>t.id,t=>t.component.html())}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function ee({row:t,time:e,top:n},s){const{api:i,state:o,onDestroy:r,actions:a,update:l,html:c}=s,d=i.getActions("chart-gantt-grid-block",{row:t,time:e,top:n});let h=i.getClass("chart-gantt-grid-block",{row:t});r(o.subscribe("config.classNames",()=>{h=i.getClass("chart-gantt-grid-block"),e.leftGlobal===i.time.date().startOf("day").valueOf()&&(h+=" current"),l()}));let u=`width: ${e.width}px;height: 100%;margin-left:-${e.subPx}px`;return s=>c`
      <div
        class=${h}
        data-actions=${a(d,{row:t,time:e,top:n,api:i,state:o})}
        style=${u}
      />
    `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function ne({row:t},e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,createComponent:l,repeat:c}=e,d=n.getActions("chart-gantt-grid-row");let h;i(s.subscribe("config.classNames",e=>{h=n.getClass("chart-gantt-grid-row",{row:t}),r()}));let u=[];for(const e of t.blocks)u.push({id:e.id,component:l(ee,{row:t,time:e.date,top:e.top})});i(()=>{u.forEach(t=>t.component.destroy())});let p=`height: ${t.rowData.height}px;`;return e=>a`
    <div class=${h} data-actions=${o(d,{row:t,api:n,state:s})} style=${p}>
      ${u.map(t=>t.component.html())}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function se(t){const{api:e,state:n,onDestroy:s,actions:i,update:o,html:r,createComponent:a,repeat:l}=t,c=e.getActions("chart-gantt-grid");let d,h,u;s(n.subscribe("config.classNames",()=>{d=e.getClass("chart-gantt-grid"),o()})),s(n.subscribe("_internal.height",t=>{u=`height: ${h=t}px`,o()}));let p,f=[];return s(n.subscribeAll(["_internal.chart.time.dates","_internal.list.visibleRows","config.chart.grid.block"],(function(){const t=n.get("_internal.list.visibleRows"),e=n.get("_internal.chart.time.dates");f.forEach(t=>t.component.destroy()),f=[];let s=0;p=[];for(const n in t){const i=t[n],r=[];let l=0;for(const t of e)r.push({id:l++,date:t,row:i,top:s});const c={id:i.id,blocks:r,rowData:i,top:s};p.push(c),f.push({id:i.id,component:a(ne,{row:c})}),s+=i.height,o()}}),{bulk:!0})),c.push(t=>{n.update("_internal.elements.grid")}),s(()=>{f.forEach(t=>t.component.destroy())}),t=>r`
    <div class=${d} data-actions=${i(c,{api:e,state:n})} style=${u}>
      ${f.map(t=>t.component.html())}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function ie({rowId:t,itemId:e},n){const{api:s,state:i,onDestroy:o,actions:r,update:a,html:l}=n;let c,d=`config.list.rows.${t}`;o(i.subscribe(d,t=>{c=t,a()}));let h,u=`config.chart.items.${e}`;o(i.subscribe(u,t=>{h=t,a()}));const p="chart-gantt-items-row-item",f=s.getActions(p);let m,g,v;o(i.subscribe("config.classNames",()=>{m=s.getClass(p,{row:c,item:h}),g=s.getClass(p+"-content",{row:c,item:h}),v=s.getClass(p+"-content-label",{row:c,item:h}),a()}));let b,y=0,_=0;return o(i.subscribeAll(["_internal.chart.time","config.scroll",u],t=>{h=i.get(u);let e=i.get("_internal.chart.time");y=(h.time.start-e.leftGlobal)/e.timePerPixel,_=(h.time.end-h.time.start)/e.timePerPixel,_-=i.get("config.chart.spacing");s.isItemInViewport(h,e.leftGlobal,e.rightGlobal);b=`left:${y}px;width:${_}px;`,a()},{bulk:!0})),t=>l`
    <div
      class=${m}
      data-actions=${r(f,{item:h,row:c,left:y,width:_,api:s,state:i})}
      style=${b}
    >
      <div class=${g}>
        <div class=${v}">${h.label}</div>
      </div>
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function oe({rowId:t},e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,createComponent:l,repeat:c}=e;let d,h,u,p=`_internal.flatTreeMapById.${t}`;i(s.subscribeAll([p,"_internal.chart"],t=>{d=s.get(p);const e=s.get("_internal.chart");h=`width:${e.dimensions.width}px;height:${d.height}px;--row-height:${d.height}px;`,u=`width: ${e.time.totalViewDurationPx}px;height: 100%;`,r()}));let f,m=[];i(s.subscribe(`_internal.flatTreeMapById.${t}._internal.items;`,e=>{f=e,m.forEach(t=>t.component.destroy()),m=[];for(const e of f)m.push({id:e.id,component:l(ie,{rowId:t,itemId:e.id})});r()})),i(()=>{m.forEach(t=>t.component.destroy())});const g=n.getActions("chart-gantt-items-row");let v,b;return i(s.subscribe("config.classNames",()=>{v=n.getClass("chart-gantt-items-row",{row:d}),b=n.getClass("chart-gantt-items-row-inner",{row:d}),r()})),t=>a`
    <div class=${v} data-actions=${o(g)} style=${h}>
      <div class=${b} style=${u}>
        ${c(m,t=>t.id,t=>t.component.html())}
      </div>
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function re(t){const{api:e,state:n,onDestroy:s,actions:i,update:o,html:r,createComponent:a,repeat:l}=t,c=e.getActions("chart-gantt-items");let d;s(n.subscribe("config.classNames",()=>{d=e.getClass("chart-gantt-items"),o()}));let h=[],u=[];return s(n.subscribe("_internal.list.visibleRows;",t=>{h=t,u.forEach(t=>t.component.destroy()),u=[];for(const t of h)u.push({id:t.id,component:a(oe,{rowId:t.id})});o()})),s(()=>{u.forEach(t=>t.component.destroy())}),t=>r`
    <div class=${d} data-actions=${i(c,{api:e,state:n})}>
      ${u.map(t=>t.component.html())}
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function ae(t){const{api:e,state:n,onDestroy:s,actions:i,update:o,html:r,createComponent:a}=t,l=e.getActions("chart-gantt"),c=a(se);s(c.destroy);const d=a(re);let h,u;s(d.destroy),s(n.subscribe("config.classNames",t=>{h=e.getClass("chart-gantt"),u=e.getClass("chart-gantt-inner"),o()}));let p="",f="";return s(n.subscribeAll(["_internal.height","_internal.list.rowsHeight"],()=>{p=`height: ${n.get("_internal.height")}px`,f=`height: ${n.get("_internal.list.rowsHeight")}px;`,o()})),l.push(t=>{n.update("_internal.elements.gantt",t)}),t=>r`
    <div class=${h} style=${p} data-actions=${i(l)} @wheel=${e.onScroll}>
      <div class=${u} style=${f}>
        ${c.html()}${d.html()}
      </div>
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function le(t){const{api:e,state:n,onDestroy:s,actions:i,update:o,html:r,createComponent:a}=t,l=a(te);s(l.destroy);const c=a(ae);s(c.destroy);let d,h,u,p,f="",m="",g=e.getActions("chart");s(n.subscribe("config.classNames",t=>{d=e.getClass("chart"),h=e.getClass("horizontal-scroll"),u=e.getClass("horizontal-scroll-inner"),o()})),s(n.subscribe("config.scroll.left",t=>{p&&p.scrollLeft!==t&&(p.scrollLeft=t),o()})),s(n.subscribeAll(["_internal.chart.dimensions.width","_internal.chart.time.totalViewDurationPx"],(function(t,e){f=`width: ${n.get("_internal.chart.dimensions.width")}px`,m=`width: ${n.get("_internal.chart.time.totalViewDurationPx")}px; height:1px`,o()})));const v={handleEvent(t){let s,i;if(t.stopPropagation(),t.preventDefault(),"scroll"===t.type)n.update("config.scroll.left",t.target.scrollLeft),s=t.target.scrollLeft;else{const o=e.normalizeMouseWheelEvent(t),r=n.get("config.scroll.xMultiplier"),a=n.get("config.scroll.yMultiplier");t.shiftKey&&o.y?n.update("config.scroll.left",t=>s=e.limitScroll("left",t+=o.y*r)):o.x?n.update("config.scroll.left",t=>s=e.limitScroll("left",t+=o.x*r)):n.update("config.scroll.top",t=>i=e.limitScroll("top",t+=o.y*a))}const o=n.get("_internal.elements.chart"),r=n.get("_internal.elements.horizontalScrollInner");if(o){const t=n.get("config.scroll.left");let e=0;t&&((e=Math.round(t/(r.clientWidth-o.clientWidth)*100))>100&&(e=100),console.log(`scrollLeft: ${t} percent: ${e} chart clientWidth: ${o.clientWidth}`)),n.update("config.scroll.percent.left",e)}},passive:!1};function b(t){p=t,n.update("_internal.elements.horizontalScroll",t)}function y(t){n.update("_internal.elements.horizontalScrollInner",t)}return g.push(t=>{n.update("_internal.elements.chart",t)}),t=>r`
    <div class=${d} data-actions=${i(g,{api:e,state:n})} @wheel=${v}>
      ${l.html()}${c.html()}
      <div class=${h} style=${f} data-actions=${i([b])} @scroll=${v}>
        <div class=${u} style=${m} data-actions=${i([y])} />
      </div>
    </div>
  `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function ce(t){const{api:e,state:n,onDestroy:s,actions:i,update:o,createComponent:r,html:a}=t,l=e.name,c=r(Kt);s(c.destroy);const d=r(le);s(d.destroy),s(n.subscribe("config.plugins",t=>{if(void 0!==t&&Array.isArray(t))for(const s of t)s(n,e)}));const h=e.getActions("");let u,p,f,m,g,v,b=0,y=!1;s(n.subscribe("config.classNames",t=>{const s=n.get("config");u=e.getClass(l,{config:s}),y&&(u+=` ${l}__list-column-header-resizer--active`),p=e.getClass("vertical-scroll",{config:s}),o()})),s(n.subscribeAll(["config.height","config.headerHeight","_internal.scrollBarHeight"],()=>{const t=n.get("config"),e=n.get("_internal.scrollBarHeight"),s=t.height-t.headerHeight-e;n.update("_internal.height",s),f=`--height: ${t.height}px`,m=`height: ${s}px; width: ${e}px; margin-top: ${t.headerHeight}px;`,o()})),s(n.subscribe("_internal.list.columns.resizer.active",t=>{y=t,u=e.getClass(e.name),y&&(u+=` ${e.name}__list-column-header-resizer--active`),o()})),s(n.subscribeAll(["config.list.rows;","config.chart.items;","config.list.rows.*.parentId","config.chart.items.*.rowId"],(t,s)=>{if(n.get("_internal.flatTreeMap").length&&"subscribe"===s.type)return;const i=n.get("config.list.rows"),r=[];for(const t in i)r.push(i[t]);e.fillEmptyRowValues(r);const a=n.get("config.chart.items"),l=[];for(const t in a)l.push(a[t]);const c=e.makeTreeMap(r,l);n.update("_internal.treeMap",c),n.update("_internal.flatTreeMapById",e.getFlatTreeMapById(c)),n.update("_internal.flatTreeMap",e.flattenTreeMap(c)),o()},{bulk:!0})),s(n.subscribeAll(["config.list.rows.*.expanded","_internal.treeMap;"],t=>{const s=n.get("config.list.rows"),i=e.getRowsFromIds(e.getRowsWithParentsExpanded(n.get("_internal.flatTreeMap"),n.get("_internal.flatTreeMapById"),s),s);b=e.getRowsHeight(i),n.update("_internal.list.rowsHeight",b),n.update("_internal.list.rowsWithParentsExpanded",i),o()},{bulk:!0})),s(n.subscribeAll(["_internal.list.rowsWithParentsExpanded","config.scroll.top"],()=>{const t=e.getVisibleRows(n.get("_internal.list.rowsWithParentsExpanded"));n.update("_internal.list.visibleRows",t),o()})),s(n.subscribeAll(["config.scroll.top","_internal.list.visibleRows"],()=>{const t=n.get("config.scroll.top");g=`height: ${b}px; width: 1px`,v&&v.scrollTop!==t&&(v.scrollTop=t),o()})),s(n.subscribeAll(["config.chart.time","_internal.dimensions.width","config.scroll.left","_internal.scrollBarHeight","_internal.list.width"],(function(){const t=n.get("_internal.dimensions.width")-n.get("_internal.list.width"),s=t-n.get("_internal.scrollBarHeight"),i=n.get("_internal.dimensions.height")-n.get("config.headerHeight");n.update("_internal.chart.dimensions",{width:t,innerWidth:s,height:i});let r=e.mergeDeep({},n.get("config.chart.time"));const a=.01*(r=e.time.recalculateFromTo(r)).zoom;let l=n.get("config.scroll.left");if(r.timePerPixel=a+Math.pow(2,r.zoom),r.totalViewDurationMs=e.time.date(r.to).diff(r.from,"milliseconds"),r.totalViewDurationPx=r.totalViewDurationMs/r.timePerPixel,l>r.totalViewDurationPx&&(l=r.totalViewDurationPx-t),r.leftGlobal=l*r.timePerPixel+r.from,r.rightGlobal=r.leftGlobal+t*r.timePerPixel,r.leftInner=r.leftGlobal-r.from,r.rightInner=r.rightGlobal-r.from,r.leftPx=r.leftInner/r.timePerPixel,r.rightPx=r.rightInner/r.timePerPixel,Math.round(r.rightGlobal/r.timePerPixel)>Math.round(r.to/r.timePerPixel)){const t=(r.rightGlobal-r.to)/(r.rightGlobal-r.from);r.timePerPixel=r.timePerPixel-r.timePerPixel*t,r.leftGlobal=l*r.timePerPixel+r.from,r.rightGlobal=r.to,r.rightInner=r.rightGlobal-r.from,r.totalViewDurationMs=r.to-r.from,r.totalViewDurationPx=r.totalViewDurationMs/r.timePerPixel,r.rightInner=r.rightGlobal-r.from,r.rightPx=r.rightInner/r.timePerPixel,r.leftPx=r.leftInner/r.timePerPixel}!function(t,n){const s=[];let i=t.leftGlobal;const o=t.rightGlobal,r=t.timePerPixel,a=t.period;let l=i-e.time.date(i).startOf(a),c=l/r,d=0,h=0,u=0;for(;i<o;){const t={id:u++,sub:l,subPx:c,leftGlobal:i,rightGlobal:e.time.date(i).endOf(a).valueOf(),width:0,leftPx:0,rightPx:0};t.width=(t.rightGlobal-t.leftGlobal+l)/r,t.width>n&&(t.width=n),h=t.width>h?t.width:h,t.leftPx=d,d+=t.width,t.rightPx=d,s.push(t),i=t.rightGlobal+1,l=0,c=0}t.maxWidth=h,t.dates=s}(r,t),n.update("_internal.chart.time",r),o()}))),n.update("_internal.scrollBarHeight",e.getScrollBarHeight());const _={handleEvent(t){t.stopPropagation(),t.preventDefault(),n.update("config.scroll",e=>{e.top=t.target.scrollTop;const s=n.get("_internal.elements.verticalScrollInner");if(s){const t=s.clientHeight;e.percent.top=e.top/t}return e},{only:["top","percent.top"]})},passive:!1},w={width:0,height:0};function $(t){v=t,n.update("_internal.elements.verticalScroll",t)}function x(t){n.update("_internal.elements.verticalScrollInner",t)}return h.push(t=>{new Ft((e,s)=>{const i=t.clientWidth,o=t.clientHeight;w.width===i&&w.height===o||(w.width=i,w.height=o,n.update("_internal.dimensions",w))}).observe(t),n.update("_internal.elements.main",t)}),t=>a`
      <div class=${u} style=${f} @scroll=${_} data-actions=${i(h)}>
        ${c.html()}${d.html()}
        <div
          class=${p}
          style=${m}
          @scroll=${_}
          data-action=${i([$])}
        >
          <div style=${g} data-actions=${i([x])} />
        </div>
      </div>
    `}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */const de={components:{Main:ce},scrollBarHeight:17,height:0,treeMap:{},flatTreeMap:[],flatTreeMapById:{},list:{expandedHeight:0,visibleRows:[],rows:{},width:0},dimensions:{width:0,height:0},chart:{dimensions:{width:0,innerWidth:0},visibleItems:[],time:{dates:[],timePerPixel:0,firstTaskTime:0,lastTaskTime:0,totalViewDurationMs:0,totalViewDurationPx:0,leftGlobal:0,rightGlobal:0,leftPx:0,rightPx:0,leftInner:0,rightInner:0}},elements:{}},he=t=>{const e=t.state,n=function(t){let e=t.get(),n=[];const s={name:bt,debug:!1,log(...t){this.debug&&console.log.call(console,...t)},mergeDeep:_t,getComponentData(t,e){const n={};return n.componentName=t,n.className=this.getClass(t,e),n.action=this.getAction(t),n},getClass(n,s){let i=`${bt}__${n}`;n===this.name&&(i=this.name);let o=`${i} `,r="-";if(void 0!==s)for(const t in s){if("Object"===s[t].constructor.name&&void 0!==s[t].id)return r+=`-${t}_${s[t].id}`,o+o.trim()+r;"string"!=typeof s[t]&&"number"!=typeof s[t]||(r+=`-${t}_${s[t]}`)}return"-"!=r&&(o+=i+r+" "),void 0!==e.config.classNames[n]&&t.get(`config.classNames.${n}`).forEach(t=>o+=t+" "),void 0!==e.config.classNames[n+r]&&t.get(`config.classNames.${n+r}`).forEach(t=>o+=t+" "),o.trim()},allActions:[],getActions(e){this.allActions.includes(e)||this.allActions.push(e);let n=t.get("config.actions."+e);return void 0===n&&(n=[]),n},isItemInViewport:(t,e,n)=>t.time.start>=e&&t.time.start<n||t.time.end>=e&&t.time.end<n,fillEmptyRowValues(t){let n=0;for(const s in t){const i=t[s];i._internal={parents:[],children:[],items:[]},"number"!=typeof i.height&&(i.height=e.config.list.rowHeight),"boolean"!=typeof i.expanded&&(i.expanded=!1),i.top=n,n+=i.height}return t},generateParents(t,e="parentId"){const n={};for(const s of t){const t=void 0!==s[e]?s[e]:"";void 0===n[t]&&(n[t]={}),n[t][s.id]=s}return n},fastTree(t,e,n=[]){const s=t[e.id];if(e._internal.parents=n,void 0===s)return e._internal.children=[],e;""!==e.id&&(n=[...n,e.id]),e._internal.children=Object.values(s);for(const e in s){const i=s[e];this.fastTree(t,i,n)}return e},makeTreeMap(t,e){const n=this.generateParents(e,"rowId");for(const e of t)e._internal.items=void 0!==n[e.id]?Object.values(n[e.id]):[];const s=this.generateParents(t);return this.fastTree(s,{id:"",_internal:{children:[],parents:[],items:[]}})},getFlatTreeMapById(t,e={}){for(const n of t._internal.children)e[n.id]=n,this.getFlatTreeMapById(n,e);return e},flattenTreeMap(t,e=[]){for(const n of t._internal.children)e.push(n.id),this.flattenTreeMap(n,e);return e},getRowsFromMap:(t,e)=>t.map(t=>e[t.id]),getRowsFromIds(t,e){const n=[];for(const s of t)n.push(e[s]);return n},getRowsWithParentsExpanded(t,e,n){const s=[];t:for(const i of t){for(const t of e[i]._internal.parents){if(!n[t].expanded)continue t}s.push(i)}return s},getRowsHeight(t){let e=0;for(let n of t)e+=n.height;return e},getVisibleRows(t){const n=[];let s=0,i=0;for(const o of t){if(s+o.height>e.config.scroll.top&&s<e.config.scroll.top+e._internal.height&&(o.top=i,i+=o.height,n.push(o)),s>e.config.scroll.top+e._internal.height)break;s+=o.height}return n},normalizeMouseWheelEvent(t){let e=t.deltaX||0,n=t.deltaY||0,s=t.deltaZ||0;const i=t.deltaMode,o=parseInt(getComputedStyle(t.target).getPropertyValue("line-height"));let r=1;switch(i){case 1:r=o;break;case 2:r=window.height}return{x:e*=r,y:n*=r,z:s*=r}},limitScroll(e,n){if("top"===e){const e=t.get("_internal.list.rowsHeight")-t.get("_internal.height");return n<0?n=0:n>e&&(n=e),n}{const e=t.get("_internal.chart.time.totalViewDurationPx")-t.get("_internal.chart.dimensions.width");return n<0?n=0:n>e&&(n=e),n}},time:dt(t),getScrollBarHeight(){const t=document.createElement("div");t.style.visibility="hidden",t.style.height="100px",t.style.msOverflowStyle="scrollbar",document.body.appendChild(t);var e=t.offsetHeight;t.style.overflow="scroll";var n=document.createElement("div");n.style.height="100%",t.appendChild(n);var s=n.offsetHeight;return t.parentNode.removeChild(t),e-s+1},destroy(){e=void 0;for(const t of n)t();n=[],s.debug&&delete window.state}};return s.debug&&(window.state=t,window.api=s),s}(e);window.state=e,e.update("",t=>({config:t.config,_internal:de}));rt(e,n).createApp(ce,t.element);return{state:e}};he.api=wt;export default he;
//# sourceMappingURL=index.esm.js.map
