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
const e=new WeakMap,t=t=>(...n)=>{const s=t(...n);return e.set(s,!0),s},n=t=>"function"==typeof t&&e.has(t),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(e,t,n=null,s=null)=>{for(;t!==n;){const n=t.nextSibling;e.insertBefore(t,s),t=n}},o=(e,t,n=null)=>{for(;t!==n;){const n=t.nextSibling;e.removeChild(t),t=n}},r={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,c=`\x3c!--${l}--\x3e`,d=new RegExp(`${l}|${c}`),u="$lit$";class h{constructor(e,t){this.parts=[],this.element=t;const n=[],s=[],i=document.createTreeWalker(t.content,133,null,!1);let o=0,r=-1,a=0;const{strings:c,values:{length:h}}=e;for(;a<h;){const e=i.nextNode();if(null!==e){if(r++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:n}=t;let s=0;for(let e=0;e<n;e++)p(t[e].name,u)&&s++;for(;s-- >0;){const t=c[a],n=g.exec(t)[2],s=n.toLowerCase()+u,i=e.getAttribute(s);e.removeAttribute(s);const o=i.split(d);this.parts.push({type:"attribute",index:r,name:n,strings:o}),a+=o.length-1}}"TEMPLATE"===e.tagName&&(s.push(e),i.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(l)>=0){const s=e.parentNode,i=t.split(d),o=i.length-1;for(let t=0;t<o;t++){let n,o=i[t];if(""===o)n=f();else{const e=g.exec(o);null!==e&&p(e[2],u)&&(o=o.slice(0,e.index)+e[1]+e[2].slice(0,-u.length)+e[3]),n=document.createTextNode(o)}s.insertBefore(n,e),this.parts.push({type:"node",index:++r})}""===i[o]?(s.insertBefore(f(),e),n.push(e)):e.data=i[o],a+=o}}else if(8===e.nodeType)if(e.data===l){const t=e.parentNode;null!==e.previousSibling&&r!==o||(r++,t.insertBefore(f(),e)),o=r,this.parts.push({type:"node",index:r}),null===e.nextSibling?e.data="":(n.push(e),r--),a++}else{let t=-1;for(;-1!==(t=e.data.indexOf(l,t+1));)this.parts.push({type:"node",index:-1}),a++}}else i.currentNode=s.pop()}for(const e of n)e.parentNode.removeChild(e)}}const p=(e,t)=>{const n=e.length-t.length;return n>=0&&e.slice(n)===t},m=e=>-1!==e.index,f=()=>document.createComment(""),g=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
class v{constructor(e,t,n){this.__parts=[],this.template=e,this.processor=t,this.options=n}update(e){let t=0;for(const n of this.__parts)void 0!==n&&n.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],n=this.template.parts,i=document.createTreeWalker(e,133,null,!1);let o,r=0,a=0,l=i.nextNode();for(;r<n.length;)if(o=n[r],m(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(t.push(l),i.currentNode=l.content),null===(l=i.nextNode())&&(i.currentNode=t.pop(),l=i.nextNode());if("node"===o.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(l.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return s&&(document.adoptNode(e),customElements.upgrade(e)),e}}
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
 */const _=` ${l} `;class x{constructor(e,t,n,s){this.strings=e,this.values=t,this.type=n,this.processor=s}getHTML(){const e=this.strings.length-1;let t="",n=!1;for(let s=0;s<e;s++){const e=this.strings[s],i=e.lastIndexOf("\x3c!--");n=(i>-1||n)&&-1===e.indexOf("--\x3e",i+1);const o=g.exec(e);t+=null===o?e+(n?_:c):e.substr(0,o.index)+o[1]+o[2]+u+o[3]+l}return t+=this.strings[e]}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}class y extends x{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const e=super.getTemplateElement(),t=e.content,n=t.firstChild;return t.removeChild(n),i(t,n.firstChild),e}}
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
 */const N=e=>null===e||!("object"==typeof e||"function"==typeof e),w=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class b{constructor(e,t,n){this.dirty=!0,this.element=e,this.name=t,this.strings=n,this.parts=[];for(let e=0;e<n.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new V(this)}_getValue(){const e=this.strings,t=e.length-1;let n="";for(let s=0;s<t;s++){n+=e[s];const t=this.parts[s];if(void 0!==t){const e=t.value;if(N(e)||!w(e))n+="string"==typeof e?e:String(e);else for(const t of e)n+="string"==typeof t?t:String(t)}}return n+=e[t]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class V{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===r||N(e)&&e===this.value||(this.value=e,n(e)||(this.committer.dirty=!0))}commit(){for(;n(this.value);){const e=this.value;this.value=r,e(this)}this.value!==r&&this.committer.commit()}}class T{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(f()),this.endNode=e.appendChild(f())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=f()),e.__insert(this.endNode=f())}insertAfterPart(e){e.__insert(this.startNode=f()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=r,e(this)}const e=this.__pendingValue;e!==r&&(N(e)?e!==this.value&&this.__commitText(e):e instanceof x?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):w(e)?this.__commitIterable(e):e===a?(this.value=a,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,n="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=n:this.__commitNode(document.createTextNode(n)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof v&&this.value.template===t)this.value.update(e.values);else{const n=new v(t,e.processor,this.options),s=n._clone();n.update(e.values),this.__commitNode(s),this.value=n}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let n,s=0;for(const i of e)void 0===(n=t[s])&&(n=new T(this.options),t.push(n),0===s?n.appendIntoPart(this):n.insertAfterPart(t[s-1])),n.setValue(i),n.commit(),s++;s<t.length&&(t.length=s,this.clear(n&&n.endNode))}clear(e=this.startNode){o(this.startNode.parentNode,e.nextSibling,this.endNode)}}class A{constructor(e,t,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=n}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=r,e(this)}if(this.__pendingValue===r)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=r}}class E extends b{constructor(e,t,n){super(e,t,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new M(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class M extends V{}let S=!1;try{const e={get capture(){return S=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}class k{constructor(e,t,n){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=n,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=r,e(this)}if(this.__pendingValue===r)return;const e=this.__pendingValue,t=this.value,s=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),i=null!=e&&(null==t||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=C(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=r}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const C=e=>e&&(S?{capture:e.capture,passive:e.passive,once:e.once}:e.capture);
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
 */const L=new class{handleAttributeExpressions(e,t,n,s){const i=t[0];if("."===i){return new E(e,t.slice(1),n).parts}return"@"===i?[new k(e,t.slice(1),s.eventContext)]:"?"===i?[new A(e,t.slice(1),n)]:new b(e,t,n).parts}handleTextExpression(e){return new T(e)}};
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
 */function W(e){let t=H.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},H.set(e.type,t));let n=t.stringsArray.get(e.strings);if(void 0!==n)return n;const s=e.strings.join(l);return void 0===(n=t.keyString.get(s))&&(n=new h(e,e.getTemplateElement()),t.keyString.set(s,n)),t.stringsArray.set(e.strings,n),n}const H=new Map,I=new WeakMap,P=(e,t,n)=>{let s=I.get(t);void 0===s&&(o(t,t.firstChild),I.set(t,s=new T(Object.assign({templateFactory:W},n))),s.appendInto(t)),s.setValue(e),s.commit()};
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
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const O=(e,...t)=>new x(e,t,"html",L),j=(e,...t)=>new y(e,t,"svg",L),F=new WeakMap,R=t(e=>t=>{if(!(t instanceof T))throw new Error("cache can only be used in text bindings");let n=F.get(t);void 0===n&&(n=new WeakMap,F.set(t,n));const s=t.value;if(s instanceof v){if(e instanceof x&&s.template===t.options.templateFactory(e))return void t.setValue(e);{let e=n.get(s.template);void 0===e&&(e={instance:s,nodes:document.createDocumentFragment()},n.set(s.template,e)),i(e.nodes,t.startNode.nextSibling,t.endNode)}}if(e instanceof x){const s=t.options.templateFactory(e),i=n.get(s);void 0!==i&&(t.setValue(i.nodes),t.commit(),t.value=i.instance)}t.setValue(e)}),$=new WeakMap,B=t(e=>t=>{if(!(t instanceof V)||t instanceof M||"class"!==t.committer.name||t.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:n}=t,{element:s}=n;$.has(t)||(s.className=n.strings.join(" "));const{classList:i}=s,o=$.get(t);for(const t in o)t in e||i.remove(t);for(const t in e){const n=e[t];if(!o||n!==o[t]){i[n?"add":"remove"](t)}}$.set(t,e)}),D=new WeakMap,q=t((e,t)=>n=>{const s=D.get(n);if(Array.isArray(e)){if(Array.isArray(s)&&s.length===e.length&&e.every((e,t)=>e===s[t]))return}else if(s===e&&(void 0!==e||D.has(n)))return;n.setValue(t()),D.set(n,Array.isArray(e)?Array.from(e):e)}),z=t(e=>t=>{if(void 0===e&&t instanceof V){if(e!==t.value){const e=t.committer.name;t.committer.element.removeAttribute(e)}}else t.setValue(e)}),G=(e,t)=>{const n=e.startNode.parentNode,s=void 0===t?e.endNode:t.startNode,i=n.insertBefore(f(),s);n.insertBefore(f(),s);const o=new T(e.options);return o.insertAfterNode(i),o},J=(e,t)=>(e.setValue(t),e.commit(),e),K=(e,t,n)=>{const s=e.startNode.parentNode,o=n?n.startNode:e.endNode,r=t.endNode.nextSibling;r!==o&&i(s,t.startNode,r,o)},Q=e=>{o(e.startNode.parentNode,e.startNode,e.endNode.nextSibling)},U=(e,t,n)=>{const s=new Map;for(let i=t;i<=n;i++)s.set(e[i],i);return s},X=new WeakMap,Y=new WeakMap,Z=t((e,t,n)=>{let s;return void 0===n?n=t:void 0!==t&&(s=t),t=>{if(!(t instanceof T))throw new Error("repeat can only be used in text bindings");const i=X.get(t)||[],o=Y.get(t)||[],r=[],a=[],l=[];let c,d,u=0;for(const t of e)l[u]=s?s(t,u):u,a[u]=n(t,u),u++;let h=0,p=i.length-1,m=0,f=a.length-1;for(;h<=p&&m<=f;)if(null===i[h])h++;else if(null===i[p])p--;else if(o[h]===l[m])r[m]=J(i[h],a[m]),h++,m++;else if(o[p]===l[f])r[f]=J(i[p],a[f]),p--,f--;else if(o[h]===l[f])r[f]=J(i[h],a[f]),K(t,i[h],r[f+1]),h++,f--;else if(o[p]===l[m])r[m]=J(i[p],a[m]),K(t,i[p],i[h]),p--,m++;else if(void 0===c&&(c=U(l,m,f),d=U(o,h,p)),c.has(o[h]))if(c.has(o[p])){const e=d.get(l[m]),n=void 0!==e?i[e]:null;if(null===n){const e=G(t,i[h]);J(e,a[m]),r[m]=e}else r[m]=J(n,a[m]),K(t,n,i[h]),i[e]=null;m++}else Q(i[p]),p--;else Q(i[h]),h++;for(;m<=f;){const e=G(t,r[f+1]);J(e,a[m]),r[m++]=e}for(;h<=p;){const e=i[h++];null!==e&&Q(e)}X.set(t,r),Y.set(t,l)}}),ee=new WeakMap,te=t(e=>t=>{if(!(t instanceof V)||t instanceof M||"style"!==t.committer.name||t.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:n}=t,{style:s}=n.element;ee.has(t)||(s.cssText=n.strings.join(" "));const i=ee.get(t);for(const t in i)t in e||(-1===t.indexOf("-")?s[t]=null:s.removeProperty(t));for(const t in e)-1===t.indexOf("-")?s[t]=e[t]:s.setProperty(t,e[t]);ee.set(t,e)}),ne=new WeakMap,se=t(e=>t=>{if(!(t instanceof T))throw new Error("unsafeHTML can only be used in text bindings");const n=ne.get(t);if(void 0!==n&&N(e)&&e===n.value&&t.value===n.fragment)return;const s=document.createElement("template");s.innerHTML=e;const i=document.importNode(s.content,!0);t.setValue(i),ne.set(t,{value:e,fragment:i})}),ie=new WeakMap,oe=t((...e)=>t=>{let n=ie.get(t);void 0===n&&(n={lastRenderedIndex:2147483647,values:[]},ie.set(t,n));const s=n.values;let i=s.length;n.values=e;for(let o=0;o<e.length&&!(o>n.lastRenderedIndex);o++){const r=e[o];if(N(r)||"function"!=typeof r.then){t.setValue(r),n.lastRenderedIndex=o;break}o<i&&r===s[o]||(n.lastRenderedIndex=2147483647,i=0,Promise.resolve(r).then(e=>{const s=n.values.indexOf(r);s>-1&&s<n.lastRenderedIndex&&(n.lastRenderedIndex=s,t.setValue(e),t.commit())}))}});export default function(e,n){let s=0;const i={};let o,r,a=[],l=0;const c=Promise.resolve(),d={state:e,api:n,html:O,svg:j,directive:t,cache:R,classMap:B,guard:q,ifDefined:z,repeat:Z,styleMap:te,unsafeHTML:se,until:oe,actions:t((function(e,t){return function(n){if(void 0!==e)for(const s of e)a.push({componentAction:s,element:n.committer.element,props:t})}})),createComponent(e,t){const n=s++,o=function(e){return{instance:e,destroy:()=>d.destroyComponent(e),update:()=>d.updateTemplate(),html:(t={})=>i[e].update(t)}}(n);const r=[];const a=Object.assign(Object.assign({},d),{update:function(){d.updateTemplate()},onDestroy:function(e){r.push(e)},instance:n});let l,c;if("function"==typeof(l=t?e(t,a):e(a))){c={update:l,destroy:()=>{r.forEach(e=>e())}}}else{const e=c.destroy,t=()=>{r.forEach(e=>e()),e()};c=Object.assign(Object.assign({},l),{destroy:t})}return i[n]=c,o},destroyComponent(e){"function"==typeof i[e].destroy&&i[e].destroy(),delete i[e]},updateTemplate(){const e=++l,t=this;c.then((function(){e===l&&(t.render(),l=0)}))},createApp(e,t){r=t;const n=this.createComponent(e);return o=n.instance,this.render(),n},render(){P(i[o].update(),r);for(const e of a)void 0===e.element.__vido__?"function"==typeof e.componentAction.create&&e.componentAction.create(e.element,e.props):"function"==typeof e.componentAction.update&&e.componentAction.update(e.element,e.props);for(const e of a)e.element.__vido__={props:e.props};a=[]}};return d}
//# sourceMappingURL=vido.esm.js.map
