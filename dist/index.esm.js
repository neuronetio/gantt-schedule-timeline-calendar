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
const t=new WeakMap,e=e=>(...n)=>{const i=e(...n);return t.set(i,!0),i},n=e=>"function"==typeof e&&t.has(e),i=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,s=(t,e,n=null,i=null)=>{for(;e!==n;){const n=e.nextSibling;t.insertBefore(e,i),e=n}},o=(t,e,n=null)=>{for(;e!==n;){const n=e.nextSibling;t.removeChild(e),e=n}},r={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,c=`\x3c!--${l}--\x3e`,d=new RegExp(`${l}|${c}`),h="$lit$";class u{constructor(t,e){this.parts=[],this.element=e;const n=[],i=[],s=document.createTreeWalker(e.content,133,null,!1);let o=0,r=-1,a=0;const{strings:c,values:{length:u}}=t;for(;a<u;){const t=s.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:n}=e;let i=0;for(let t=0;t<n;t++)p(e[t].name,h)&&i++;for(;i-- >0;){const e=c[a],n=g.exec(e)[2],i=n.toLowerCase()+h,s=t.getAttribute(i);t.removeAttribute(i);const o=s.split(d);this.parts.push({type:"attribute",index:r,name:n,strings:o}),a+=o.length-1}}"TEMPLATE"===t.tagName&&(i.push(t),s.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(l)>=0){const i=t.parentNode,s=e.split(d),o=s.length-1;for(let e=0;e<o;e++){let n,o=s[e];if(""===o)n=m();else{const t=g.exec(o);null!==t&&p(t[2],h)&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-h.length)+t[3]),n=document.createTextNode(o)}i.insertBefore(n,t),this.parts.push({type:"node",index:++r})}""===s[o]?(i.insertBefore(m(),t),n.push(t)):t.data=s[o],a+=o}}else if(8===t.nodeType)if(t.data===l){const e=t.parentNode;null!==t.previousSibling&&r!==o||(r++,e.insertBefore(m(),t)),o=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(n.push(t),r--),a++}else{let e=-1;for(;-1!==(e=t.data.indexOf(l,e+1));)this.parts.push({type:"node",index:-1}),a++}}else s.currentNode=i.pop()}for(const t of n)t.parentNode.removeChild(t)}}const p=(t,e)=>{const n=t.length-e.length;return n>=0&&t.slice(n)===e},f=t=>-1!==t.index,m=()=>document.createComment(""),g=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
class v{constructor(t,e,n){this.__parts=[],this.template=t,this.processor=e,this.options=n}update(t){let e=0;for(const n of this.__parts)void 0!==n&&n.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=i?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],n=this.template.parts,s=document.createTreeWalker(t,133,null,!1);let o,r=0,a=0,l=s.nextNode();for(;r<n.length;)if(o=n[r],f(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),s.currentNode=l.content),null===(l=s.nextNode())&&(s.currentNode=e.pop(),l=s.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return i&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const b=` ${l} `;class y{constructor(t,e,n,i){this.strings=t,this.values=e,this.type=n,this.processor=i}getHTML(){const t=this.strings.length-1;let e="",n=!1;for(let i=0;i<t;i++){const t=this.strings[i],s=t.lastIndexOf("\x3c!--");n=(s>-1||n)&&-1===t.indexOf("--\x3e",s+1);const o=g.exec(t);e+=null===o?t+(n?b:c):t.substr(0,o.index)+o[1]+o[2]+h+o[3]+l}return e+=this.strings[t]}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}class w extends y{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),e=t.content,n=e.firstChild;return e.removeChild(n),s(e,n.firstChild),t}}
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
 */const _=t=>null===t||!("object"==typeof t||"function"==typeof t),$=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class x{constructor(t,e,n){this.dirty=!0,this.element=t,this.name=e,this.strings=n,this.parts=[];for(let t=0;t<n.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new M(this)}_getValue(){const t=this.strings,e=t.length-1;let n="";for(let i=0;i<e;i++){n+=t[i];const e=this.parts[i];if(void 0!==e){const t=e.value;if(_(t)||!$(t))n+="string"==typeof t?t:String(t);else for(const e of t)n+="string"==typeof e?e:String(e)}}return n+=t[e]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class M{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===r||_(t)&&t===this.value||(this.value=t,n(t)||(this.committer.dirty=!0))}commit(){for(;n(this.value);){const t=this.value;this.value=r,t(this)}this.value!==r&&this.committer.commit()}}class C{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(m()),this.endNode=t.appendChild(m())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=m()),t.__insert(this.endNode=m())}insertAfterPart(t){t.__insert(this.startNode=m()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}const t=this.__pendingValue;t!==r&&(_(t)?t!==this.value&&this.__commitText(t):t instanceof y?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):$(t)?this.__commitIterable(t):t===a?(this.value=a,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,n="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=n:this.__commitNode(document.createTextNode(n)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof v&&this.value.template===e)this.value.update(t.values);else{const n=new v(e,t.processor,this.options),i=n._clone();n.update(t.values),this.__commitNode(i),this.value=n}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let n,i=0;for(const s of t)void 0===(n=e[i])&&(n=new C(this.options),e.push(n),0===i?n.appendIntoPart(this):n.insertAfterPart(e[i-1])),n.setValue(s),n.commit(),i++;i<e.length&&(e.length=i,this.clear(n&&n.endNode))}clear(t=this.startNode){o(this.startNode.parentNode,t.nextSibling,this.endNode)}}class T{constructor(t,e,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=n}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=r}}class P extends x{constructor(t,e,n){super(t,e,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new A(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class A extends M{}let I=!1;try{const t={get capture(){return I=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class N{constructor(t,e,n){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=n,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=this.__pendingValue,e=this.value,i=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=null!=t&&(null==e||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=O(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=r}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const O=t=>t&&(I?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);
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
 */const D=new class{handleAttributeExpressions(t,e,n,i){const s=e[0];if("."===s){return new P(t,e.slice(1),n).parts}return"@"===s?[new N(t,e.slice(1),i.eventContext)]:"?"===s?[new T(t,e.slice(1),n)]:new x(t,e,n).parts}handleTextExpression(t){return new C(t)}};
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
 */function L(t){let e=E.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},E.set(t.type,e));let n=e.stringsArray.get(t.strings);if(void 0!==n)return n;const i=t.strings.join(l);return void 0===(n=e.keyString.get(i))&&(n=new u(t,t.getTemplateElement()),e.keyString.set(i,n)),e.stringsArray.set(t.strings,n),n}const E=new Map,S=new WeakMap,k=(t,e,n)=>{let i=S.get(e);void 0===i&&(o(e,e.firstChild),S.set(e,i=new C(Object.assign({templateFactory:L},n))),i.appendInto(e)),i.setValue(t),i.commit()};
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
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const R=(t,...e)=>new y(t,e,"html",D),V=(t,...e)=>new w(t,e,"svg",D),H=new WeakMap,j=e(t=>e=>{if(!(e instanceof C))throw new Error("cache can only be used in text bindings");let n=H.get(e);void 0===n&&(n=new WeakMap,H.set(e,n));const i=e.value;if(i instanceof v){if(t instanceof y&&i.template===e.options.templateFactory(t))return void e.setValue(t);{let t=n.get(i.template);void 0===t&&(t={instance:i,nodes:document.createDocumentFragment()},n.set(i.template,t)),s(t.nodes,e.startNode.nextSibling,e.endNode)}}if(t instanceof y){const i=e.options.templateFactory(t),s=n.get(i);void 0!==s&&(e.setValue(s.nodes),e.commit(),e.value=s.instance)}e.setValue(t)}),Y=new WeakMap,W=e(t=>e=>{if(!(e instanceof M)||e instanceof A||"class"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:n}=e,{element:i}=n;Y.has(e)||(i.className=n.strings.join(" "));const{classList:s}=i,o=Y.get(e);for(const e in o)e in t||s.remove(e);for(const e in t){const n=t[e];if(!o||n!==o[e]){s[n?"add":"remove"](e)}}Y.set(e,t)}),z=new WeakMap,G=e((t,e)=>n=>{const i=z.get(n);if(Array.isArray(t)){if(Array.isArray(i)&&i.length===t.length&&t.every((t,e)=>t===i[e]))return}else if(i===t&&(void 0!==t||z.has(n)))return;n.setValue(e()),z.set(n,Array.isArray(t)?Array.from(t):t)}),B=e(t=>e=>{if(void 0===t&&e instanceof M){if(t!==e.value){const t=e.committer.name;e.committer.element.removeAttribute(t)}}else e.setValue(t)}),F=(t,e)=>{const n=t.startNode.parentNode,i=void 0===e?t.endNode:e.startNode,s=n.insertBefore(m(),i);n.insertBefore(m(),i);const o=new C(t.options);return o.insertAfterNode(s),o},U=(t,e)=>(t.setValue(e),t.commit(),t),J=(t,e,n)=>{const i=t.startNode.parentNode,o=n?n.startNode:t.endNode,r=e.endNode.nextSibling;r!==o&&s(i,e.startNode,r,o)},q=t=>{o(t.startNode.parentNode,t.startNode,t.endNode.nextSibling)},Z=(t,e,n)=>{const i=new Map;for(let s=e;s<=n;s++)i.set(t[s],s);return i},X=new WeakMap,K=new WeakMap,Q=e((t,e,n)=>{let i;return void 0===n?n=e:void 0!==e&&(i=e),e=>{if(!(e instanceof C))throw new Error("repeat can only be used in text bindings");const s=X.get(e)||[],o=K.get(e)||[],r=[],a=[],l=[];let c,d,h=0;for(const e of t)l[h]=i?i(e,h):h,a[h]=n(e,h),h++;let u=0,p=s.length-1,f=0,m=a.length-1;for(;u<=p&&f<=m;)if(null===s[u])u++;else if(null===s[p])p--;else if(o[u]===l[f])r[f]=U(s[u],a[f]),u++,f++;else if(o[p]===l[m])r[m]=U(s[p],a[m]),p--,m--;else if(o[u]===l[m])r[m]=U(s[u],a[m]),J(e,s[u],r[m+1]),u++,m--;else if(o[p]===l[f])r[f]=U(s[p],a[f]),J(e,s[p],s[u]),p--,f++;else if(void 0===c&&(c=Z(l,f,m),d=Z(o,u,p)),c.has(o[u]))if(c.has(o[p])){const t=d.get(l[f]),n=void 0!==t?s[t]:null;if(null===n){const t=F(e,s[u]);U(t,a[f]),r[f]=t}else r[f]=U(n,a[f]),J(e,n,s[u]),s[t]=null;f++}else q(s[p]),p--;else q(s[u]),u++;for(;f<=m;){const t=F(e,r[m+1]);U(t,a[f]),r[f++]=t}for(;u<=p;){const t=s[u++];null!==t&&q(t)}X.set(e,r),K.set(e,l)}}),tt=new WeakMap,et=e(t=>e=>{if(!(e instanceof M)||e instanceof A||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:n}=e,{style:i}=n.element;tt.has(e)||(i.cssText=n.strings.join(" "));const s=tt.get(e);for(const e in s)e in t||(-1===e.indexOf("-")?i[e]=null:i.removeProperty(e));for(const e in t)-1===e.indexOf("-")?i[e]=t[e]:i.setProperty(e,t[e]);tt.set(e,t)}),nt=new WeakMap,it=e(t=>e=>{if(!(e instanceof C))throw new Error("unsafeHTML can only be used in text bindings");const n=nt.get(e);if(void 0!==n&&_(t)&&t===n.value&&e.value===n.fragment)return;const i=document.createElement("template");i.innerHTML=t;const s=document.importNode(i.content,!0);e.setValue(s),nt.set(e,{value:t,fragment:s})}),st=new WeakMap,ot=e((...t)=>e=>{let n=st.get(e);void 0===n&&(n={lastRenderedIndex:2147483647,values:[]},st.set(e,n));const i=n.values;let s=i.length;n.values=t;for(let o=0;o<t.length&&!(o>n.lastRenderedIndex);o++){const r=t[o];if(_(r)||"function"!=typeof r.then){e.setValue(r),n.lastRenderedIndex=o;break}o<s&&r===i[o]||(n.lastRenderedIndex=2147483647,s=0,Promise.resolve(r).then(t=>{const i=n.values.indexOf(r);i>-1&&i<n.lastRenderedIndex&&(n.lastRenderedIndex=i,e.setValue(t),e.commit())}))}});function rt(t,n){let i=0;const s={};let o,r,a=[],l=0;const c=Promise.resolve();function d(t){return e((function(e,n){return function(i){const s=i.committer.element;for(const i of e)if("function"==typeof i){const e=a.find(e=>e.instance===t&&e.componentAction.create===i&&e.element===s);if(e)e.props=n;else{void 0!==s.__vido__&&delete s.__vido__;const e={create:i,update(){},destroy(){}};a.push({instance:t,componentAction:e,element:s,props:n})}}}}))}const h={state:t,api:n,html:R,svg:V,directive:e,cache:j,classMap:W,guard:G,ifDefined:B,repeat:Q,styleMap:et,unsafeHTML:it,until:ot,actions(t,e){},createComponent(t,e){const n=t.name+":"+i++,o=function(t){return{instance:t,destroy:()=>h.destroyComponent(t),update:()=>h.updateTemplate(),html:(e={})=>s[t].update(e)}}(n);const r=[];const a=Object.assign(Object.assign({},h),{update:function(){h.updateTemplate()},onDestroy:function(t){r.push(t)},instance:n,actions:d(n)});let l,c;if("function"==typeof(l=e?t(e,a):t(a))){c={update:l,destroy:()=>{r.forEach(t=>t())}}}else{const t=c.destroy,e=()=>{r.forEach(t=>t()),t()};c=Object.assign(Object.assign({},l),{destroy:e})}return s[n]=c,o},destroyComponent(t){"function"==typeof s[t].destroy&&s[t].destroy(),a=a.filter(e=>(e.instance===t&&"function"==typeof e.componentAction.destroy&&e.componentAction.destroy(e.element,e.props),e.instance!==t)),delete s[t]},updateTemplate(){const t=++l,e=this;c.then((function(){t===l&&(e.render(),l=0)}))},createApp(t,e){r=e;const n=this.createComponent(t);return o=n.instance,this.render(),n},executeActions(){for(const t of a)if(void 0===t.element.__vido__){if("function"==typeof t.componentAction.create){const e=t.componentAction.create(t.element,t.props);void 0!==e&&("function"==typeof e.update&&(t.componentAction.update=e.update),"function"==typeof e.destroy&&(t.componentAction.destroy=e.destroy))}}else"function"==typeof t.componentAction.update&&t.componentAction.update(t.element,t.props);for(const t of a)t.element.__vido__={instance:t.instance,props:t.props}},render(){k(s[o].update(),r),h.executeActions()}};return h}var at=function(){if("undefined"!=typeof Map)return Map;function t(t,e){var n=-1;return t.some((function(t,i){return t[0]===e&&(n=i,!0)})),n}return(function(){function e(){this.__entries__=[]}return Object.defineProperty(e.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),e.prototype.get=function(e){var n=t(this.__entries__,e),i=this.__entries__[n];return i&&i[1]},e.prototype.set=function(e,n){var i=t(this.__entries__,e);~i?this.__entries__[i][1]=n:this.__entries__.push([e,n])},e.prototype.delete=function(e){var n=this.__entries__,i=t(n,e);~i&&n.splice(i,1)},e.prototype.has=function(e){return!!~t(this.__entries__,e)},e.prototype.clear=function(){this.__entries__.splice(0)},e.prototype.forEach=function(t,e){void 0===e&&(e=null);for(var n=0,i=this.__entries__;n<i.length;n++){var s=i[n];t.call(e,s[1],s[0])}},e}())}(),lt="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,ct="undefined"!=typeof global&&global.Math===Math?global:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),dt="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(ct):function(t){return setTimeout((function(){return t(Date.now())}),1e3/60)},ht=2;var ut=20,pt=["top","right","bottom","left","width","height","size","weight"],ft="undefined"!=typeof MutationObserver,mt=function(){function t(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=function(t,e){var n=!1,i=!1,s=0;function o(){n&&(n=!1,t()),i&&a()}function r(){dt(o)}function a(){var t=Date.now();if(n){if(t-s<ht)return;i=!0}else n=!0,i=!1,setTimeout(r,e);s=t}return a}(this.refresh.bind(this),ut)}return t.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},t.prototype.removeObserver=function(t){var e=this.observers_,n=e.indexOf(t);~n&&e.splice(n,1),!e.length&&this.connected_&&this.disconnect_()},t.prototype.refresh=function(){this.updateObservers_()&&this.refresh()},t.prototype.updateObservers_=function(){var t=this.observers_.filter((function(t){return t.gatherActive(),t.hasActive()}));return t.forEach((function(t){return t.broadcastActive()})),t.length>0},t.prototype.connect_=function(){lt&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),ft?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},t.prototype.disconnect_=function(){lt&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},t.prototype.onTransitionEnd_=function(t){var e=t.propertyName,n=void 0===e?"":e;pt.some((function(t){return!!~n.indexOf(t)}))&&this.refresh()},t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},t.instance_=null,t}(),gt=function(t,e){for(var n=0,i=Object.keys(e);n<i.length;n++){var s=i[n];Object.defineProperty(t,s,{value:e[s],enumerable:!1,writable:!1,configurable:!0})}return t},vt=function(t){return t&&t.ownerDocument&&t.ownerDocument.defaultView||ct},bt=Mt(0,0,0,0);function yt(t){return parseFloat(t)||0}function wt(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return e.reduce((function(e,n){return e+yt(t["border-"+n+"-width"])}),0)}function _t(t){var e=t.clientWidth,n=t.clientHeight;if(!e&&!n)return bt;var i=vt(t).getComputedStyle(t),s=function(t){for(var e={},n=0,i=["top","right","bottom","left"];n<i.length;n++){var s=i[n],o=t["padding-"+s];e[s]=yt(o)}return e}(i),o=s.left+s.right,r=s.top+s.bottom,a=yt(i.width),l=yt(i.height);if("border-box"===i.boxSizing&&(Math.round(a+o)!==e&&(a-=wt(i,"left","right")+o),Math.round(l+r)!==n&&(l-=wt(i,"top","bottom")+r)),!function(t){return t===vt(t).document.documentElement}(t)){var c=Math.round(a+o)-e,d=Math.round(l+r)-n;1!==Math.abs(c)&&(a-=c),1!==Math.abs(d)&&(l-=d)}return Mt(s.left,s.top,a,l)}var $t="undefined"!=typeof SVGGraphicsElement?function(t){return t instanceof vt(t).SVGGraphicsElement}:function(t){return t instanceof vt(t).SVGElement&&"function"==typeof t.getBBox};function xt(t){return lt?$t(t)?function(t){var e=t.getBBox();return Mt(0,0,e.width,e.height)}(t):_t(t):bt}function Mt(t,e,n,i){return{x:t,y:e,width:n,height:i}}var Ct=function(){function t(t){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=Mt(0,0,0,0),this.target=t}return t.prototype.isActive=function(){var t=xt(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},t.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t},t}(),Tt=function(t,e){var n,i,s,o,r,a,l,c=(i=(n=e).x,s=n.y,o=n.width,r=n.height,a="undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object,l=Object.create(a.prototype),gt(l,{x:i,y:s,width:o,height:r,top:s,right:i+o,bottom:r+s,left:i}),l);gt(this,{target:t,contentRect:c})},Pt=function(){function t(t,e,n){if(this.activeObservations_=[],this.observations_=new at,"function"!=typeof t)throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=t,this.controller_=e,this.callbackCtx_=n}return t.prototype.observe=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof vt(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)||(e.set(t,new Ct(t)),this.controller_.addObserver(this),this.controller_.refresh())}},t.prototype.unobserve=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof vt(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)&&(e.delete(t),e.size||this.controller_.removeObserver(this))}},t.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},t.prototype.gatherActive=function(){var t=this;this.clearActive(),this.observations_.forEach((function(e){e.isActive()&&t.activeObservations_.push(e)}))},t.prototype.broadcastActive=function(){if(this.hasActive()){var t=this.callbackCtx_,e=this.activeObservations_.map((function(t){return new Tt(t.target,t.broadcastRect())}));this.callback_.call(t,e,t),this.clearActive()}},t.prototype.clearActive=function(){this.activeObservations_.splice(0)},t.prototype.hasActive=function(){return this.activeObservations_.length>0},t}(),At="undefined"!=typeof WeakMap?new WeakMap:new at,It=function t(e){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var n=mt.getInstance(),i=new Pt(e,n,this);At.set(this,i)};["observe","unobserve","disconnect"].forEach((function(t){It.prototype[t]=function(){var e;return(e=At.get(this))[t].apply(e,arguments)}}));var Nt=void 0!==ct.ResizeObserver?ct.ResizeObserver:It;
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Ot(t){const{api:e,state:n,onDestroy:i,actions:s,update:o,createComponent:r,html:a}=t,l=e.name;let c,d;i(n.subscribe("config.components.List",t=>c=t)),i(n.subscribe("config.components.Chart",t=>d=t));const h=r(c);i(h.destroy);const u=r(d);let p;i(u.destroy),i(n.subscribe("config.plugins",t=>{if(void 0!==t&&Array.isArray(t))for(const i of t)i(n,e)})),i(n.subscribe("config.wrappers.Main",t=>p=t));const f=e.getActions("");let m,g,v,b,y,w,_=0,$=!1;i(n.subscribe("config.classNames",t=>{const i=n.get("config");m=e.getClass(l,{config:i}),$&&(m+=` ${l}__list-column-header-resizer--active`),g=e.getClass("vertical-scroll",{config:i}),o()})),i(n.subscribeAll(["config.height","config.headerHeight","_internal.scrollBarHeight"],()=>{const t=n.get("config"),e=n.get("_internal.scrollBarHeight"),i=t.height-t.headerHeight-e;n.update("_internal.height",i),v=`--height: ${t.height}px`,b=`height: ${i}px; width: ${e}px; margin-top: ${t.headerHeight}px;`,o()})),i(n.subscribe("_internal.list.columns.resizer.active",t=>{$=t,m=e.getClass(e.name),$&&(m+=` ${e.name}__list-column-header-resizer--active`),o()})),i(n.subscribeAll(["config.list.rows;","config.chart.items;","config.list.rows.*.parentId","config.chart.items.*.rowId"],(t,i)=>{if(n.get("_internal.flatTreeMap").length&&"subscribe"===i.type)return;const s=n.get("config.list.rows"),r=[];for(const t in s)r.push(s[t]);e.fillEmptyRowValues(r);const a=n.get("config.chart.items"),l=[];for(const t in a)l.push(a[t]);const c=e.makeTreeMap(r,l);n.update("_internal.treeMap",c),n.update("_internal.flatTreeMapById",e.getFlatTreeMapById(c)),n.update("_internal.flatTreeMap",e.flattenTreeMap(c)),o()},{bulk:!0})),i(n.subscribeAll(["config.list.rows.*.expanded","_internal.treeMap;"],t=>{const i=n.get("config.list.rows"),s=e.getRowsFromIds(e.getRowsWithParentsExpanded(n.get("_internal.flatTreeMap"),n.get("_internal.flatTreeMapById"),i),i);_=e.getRowsHeight(s),n.update("_internal.list.rowsHeight",_),n.update("_internal.list.rowsWithParentsExpanded",s),o()},{bulk:!0})),i(n.subscribeAll(["_internal.list.rowsWithParentsExpanded","config.scroll.top"],()=>{const t=e.getVisibleRows(n.get("_internal.list.rowsWithParentsExpanded"));n.update("_internal.list.visibleRows",t),o()})),i(n.subscribeAll(["config.scroll.top","_internal.list.visibleRows"],()=>{const t=n.get("config.scroll.top");y=`height: ${_}px; width: 1px`,w&&w.scrollTop!==t&&(w.scrollTop=t),o()})),i(n.subscribeAll(["config.chart.time","_internal.dimensions.width","config.scroll.left","_internal.scrollBarHeight","_internal.list.width"],(function(){const t=n.get("_internal.dimensions.width")-n.get("_internal.list.width"),i=t-n.get("_internal.scrollBarHeight"),s=n.get("_internal.dimensions.height")-n.get("config.headerHeight");n.update("_internal.chart.dimensions",{width:t,innerWidth:i,height:s});let r=e.mergeDeep({},n.get("config.chart.time"));const a=(r=e.time.recalculateFromTo(r)).period,l=.01*r.zoom;let c=n.get("config.scroll.left");if(r.timePerPixel=l+Math.pow(2,r.zoom),r.totalViewDurationMs=e.time.date(r.to).diff(r.from,"milliseconds"),r.totalViewDurationPx=r.totalViewDurationMs/r.timePerPixel,c>r.totalViewDurationPx&&(c=r.totalViewDurationPx-t),r.leftGlobal=c*r.timePerPixel+r.from,r.rightGlobal=r.leftGlobal+t*r.timePerPixel,r.leftInner=r.leftGlobal-r.from,r.rightInner=r.rightGlobal-r.from,r.leftPx=r.leftInner/r.timePerPixel,r.rightPx=r.rightInner/r.timePerPixel,Math.round(r.rightGlobal/r.timePerPixel)>Math.round(r.to/r.timePerPixel)){const t=(r.rightGlobal-r.to)/(r.rightGlobal-r.from);r.timePerPixel=r.timePerPixel-r.timePerPixel*t,r.leftGlobal=c*r.timePerPixel+r.from,r.rightGlobal=r.to,r.rightInner=r.rightGlobal-r.from,r.totalViewDurationMs=r.to-r.from,r.totalViewDurationPx=r.totalViewDurationMs/r.timePerPixel,r.rightInner=r.rightGlobal-r.from,r.rightPx=r.rightInner/r.timePerPixel,r.leftPx=r.leftInner/r.timePerPixel}!function(t,n,i){const s=[];let o=n.leftGlobal;const r=n.rightGlobal,a=n.timePerPixel;let l=o-e.time.date(o).startOf(t),c=l/a,d=0,h=0,u=0;for(;o<r;){const n={id:u++,sub:l,subPx:c,leftGlobal:o,rightGlobal:e.time.date(o).endOf(t).valueOf(),width:0,leftPx:0,rightPx:0};n.width=(n.rightGlobal-n.leftGlobal+l)/a,n.width>i&&(n.width=i),h=n.width>h?n.width:h,n.leftPx=d,d+=n.width,n.rightPx=d,s.push(n),o=n.rightGlobal+1,l=0,c=0}n.maxWidth[t]=h,n.dates[t]=s}(a,r,t),n.update("_internal.chart.time",r),o()}))),n.update("_internal.scrollBarHeight",e.getScrollBarHeight());const x={handleEvent(t){t.stopPropagation(),t.preventDefault(),n.update("config.scroll",e=>{e.top=t.target.scrollTop;const i=n.get("_internal.elements.verticalScrollInner");if(i){const t=i.clientHeight;e.percent.top=e.top/t}return e},{only:["top","percent.top"]})},passive:!1},M={width:0,height:0};let C;function T(t){w=t,n.update("_internal.elements.verticalScroll",t)}function P(t){n.update("_internal.elements.verticalScrollInner",t)}return f.push(t=>{(C=new Nt((e,i)=>{const s=t.clientWidth,o=t.clientHeight;M.width===s&&M.height===o||(M.width=s,M.height=o,n.update("_internal.dimensions",M))})).observe(t),n.update("_internal.elements.main",t)}),i(()=>{C.disconnect()}),e=>p(a`
        <div class=${m} style=${v} @scroll=${x} data-actions=${s(f)}>
          ${h.html()}${u.html()}
          <div
            class=${g}
            style=${b}
            @scroll=${x}
            data-action=${s([T])}
          >
            <div style=${y} data-actions=${s([P])} />
          </div>
        </div>
      `,{props:{},vido:t,templateProps:e})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Dt(t){const{api:e,state:n,onDestroy:i,actions:s,update:o,createComponent:r,html:a,repeat:l}=t,c=e.getActions("list");let d,h,u,p,f;i(n.subscribe("config.wrappers.List",t=>d=t)),i(n.subscribe("config.components.ListColumn",t=>h=t)),i(n.subscribe("config.list",()=>{p=n.get("config.list"),f=p.columns.percent,o()})),i(n.subscribe("config.classNames",()=>{u=e.getClass("list",{list:p}),o()}));let m,g,v,b=[];function y(t){if(t.stopPropagation(),t.preventDefault(),"scroll"===t.type)n.update("config.scroll.top",t.target.scrollTop);else{const i=e.normalizeMouseWheelEvent(t);n.update("config.scroll.top",t=>e.limitScroll("top",t+=i.y*n.get("config.scroll.yMultiplier")))}}function w(t){v||(v=t.clientWidth,0===f&&(v=0),n.update("_internal.list.width",v),n.update("_internal.elements.list",t))}return i(n.subscribe("config.list.columns.data;",t=>{b.forEach(t=>t.component.destroy()),m=Object.keys(t),b=m.map(t=>{return{id:t,component:r(h,{columnId:t})}}),o()})),i(()=>{b.forEach(t=>t.component.destroy())}),i(n.subscribe("config.height",t=>{g=`height: ${t}px`,o()})),c.push(t=>(n.update("_internal.elements.list",t),w(t),{update:w})),e=>d(p.columns.percent>0?a`
            <div
              class=${u}
              data-actions=${s(c)}
              style=${g}
              @scroll=${y}
              @wheel=${y}
            >
              ${b.map(t=>t.component.html())}
            </div>
          `:null,{vido:t,props:{},templateProps:e})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Lt({columnId:t},e){const{api:n,state:i,onDestroy:s,actions:o,update:r,createComponent:a,html:l,repeat:c}=e;let d,h,u;s(i.subscribe("config.wrappers.ListColumn",t=>d=t)),s(i.subscribe("config.components.ListColumnRow",t=>h=t)),s(i.subscribe("config.components.ListColumnHeader",t=>u=t));let p,f=`config.list.columns.data.${t}`;s(i.subscribe(f,t=>{p=t,r()}));const m=n.getActions("list-column"),g=n.getActions("list-column-rows");let v,b,y,w,_;s(i.subscribe("config.classNames",t=>{v=n.getClass("list-column",{column:p}),b=n.getClass("list-column-rows",{column:p}),r()}));let $=[];s(i.subscribe("_internal.list.visibleRows;",e=>{$.forEach(t=>t.component.destroy()),$=e.map(e=>({id:e.id,component:a(h,{columnId:t,rowId:e.id})})),r()})),s(()=>{$.forEach(t=>t.component.destroy())}),s(i.subscribeAll(["config.list.columns.percent","config.list.columns.resizer.width",`config.list.columns.data.${p.id}.width`,"config.height","config.headerHeight"],t=>{const e=i.get("config.list");y=e.columns.data[p.id].width*e.columns.percent*.01,w=`width: ${y+e.columns.resizer.width}px`,_=`height: ${i.get("config.height")}px`},{bulk:!0}));const x=a(u,{columnId:t});return s(x.destroy),s=>d(l`
        <div
          class=${v}
          data-actions=${o(m,{column:p,state:i,api:n})}
          style=${w}
        >
          ${x.html()}
          <div class=${b} style=${_} data-actions=${o(g,{api:n,state:i})}>
            ${$.map(t=>t.component.html())}
          </div>
        </div>
      `,{vido:e,props:{columnId:t},templateProps:s})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Et({columnId:t},e){const{api:n,state:i,onDestroy:s,actions:o,update:r,createComponent:a,html:l}=e;let c;s(i.subscribe("config.wrappers.ListColumnHeader",t=>c=t));const d=n.getActions("list-column-header");let h;s(i.subscribe("config.components.ListColumnHeaderResizer",t=>h=t));const u=a(h,{columnId:t});let p;s(u.destroy),s(i.subscribe("config.components.ListExpander",t=>p=t));const f=a(p,{});let m,g,v,b;return s(f.destroy),s(i.subscribe(`config.list.columns.data.${t}`,t=>{m=t,r()})),s(i.subscribeAll(["config.classNames","config.headerHeight"],()=>{const t=i.get("config");g=n.getClass("list-column-header",{column:m}),v=n.getClass("list-column-header-content",{column:m}),b=`--height: ${t.headerHeight}px;`,r()})),s=>c(l`
        <div class=${g} style=${b} data-actions=${o(d,{column:m,api:n,state:i})}>
          ${"boolean"==typeof m.expander&&m.expander?l`
      <div class=${v}>
        ${f.html()}${u.html(m)}
      </div>
    `:l`
      <div class=${v}>
        ${u.html(m)}
      </div>
    `}
        </div>
      `,{vido:e,props:{columnId:t},templateProps:s})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function St({columnId:t},e){const{api:n,state:i,onDestroy:s,update:o,html:r,actions:a}=e,l="list-column-header-resizer",c=n.getActions(l);let d,h,u,p,f,m,g,v,b;s(i.subscribe("config.wrappers.ListColumnHeaderResizer",t=>d=t)),s(i.subscribe(`config.list.columns.data.${t}`,t=>{h=t,o()}));let y=!1;s(i.subscribe("config.classNames",t=>{u=n.getClass(l,{column:h}),p=n.getClass(l+"-container",{column:h}),f=n.getClass(l+"-dots",{column:h}),m=n.getClass(l+"-dots-dot",{column:h}),g=n.getClass(l+"-line",{column:h}),o()})),s(i.subscribeAll([`config.list.columns.data.${h.id}.width`,"config.list.columns.percent","config.list.columns.resizer.width","config.list.columns.resizer.inRealTime"],(t,e)=>{const n=i.get("config.list");v=h.width*n.columns.percent*.01,b=`width: ${n.columns.resizer.width}px`,y=n.columns.resizer.inRealTime,o()}));let w=[1,2,3,4,5,6,7,8];s(i.subscribe("config.list.columns.resizer.dots",t=>{w=[];for(let e=0;e<t;e++)w.push(e);o()}));let _=!1,$=v;const x=`config.list.columns.data.${h.id}.width`;function M(t){_=!0,i.update("_internal.list.columns.resizer.active",!0)}function C(t){_&&(($+=t.movementX)<0&&($=0),y&&i.update(x,$))}function T(t){_&&(i.update("_internal.list.columns.resizer.active",!1),i.update(x,$),_=!1)}return document.body.addEventListener("mousemove",C),s(()=>document.body.removeEventListener("mousemove",C)),document.body.addEventListener("mouseup",T),s(()=>document.body.removeEventListener("mouseup",T)),s=>d(r`
        <div class=${u} data-actions=${a(c,{column:h,api:n,state:i})}>
          <div class=${p}>
            ${h.header.html?r`
                  ${h.header.html}
                `:h.header.content}
          </div>
          <div class=${f} style=${"--"+b} @mousedown=${M}>
            ${w.map(t=>r`
                  <div class=${m} />
                `)}
          </div>
        </div>
      `,{vido:e,props:{columnId:t},temlateProps:s})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function kt({rowId:t,columnId:e},n){const{api:i,state:s,onDestroy:o,actions:r,update:a,html:l,createComponent:c}=n;let d,h;o(s.subscribe("config.wrappers.ListColumnRow",t=>d=t)),o(s.subscribe("config.components.ListExpander",t=>h=t));let u,p,f=`_internal.flatTreeMapById.${t}`;o(s.subscribe(f,t=>{p=`--height: ${(u=t).height}px;`;for(let t of u._internal.parents){const e=s.get(`_internal.flatTreeMapById.${t}`);"object"==typeof e.style&&"Object"===e.style.constructor.name&&"string"==typeof e.style.children&&(p+=e.style.children)}"object"==typeof u.style&&"Object"===u.style.constructor.name&&"string"==typeof u.style.current&&(p+=u.style.current),a()}));const m=c(h,{row:u});o(m.destroy);let g,v=`config.list.columns.data.${e}`;o(s.subscribe(v,t=>{g=t,a()}));const b=i.getActions("list-column-row");let y;return o(s.subscribe("config.classNames",t=>{y=i.getClass("list-column-row",{row:u,column:g}),a()})),o=>d(l`
        <div
          class=${y}
          style=${p}
          data-actions=${r(b,{column:g,row:u,api:i,state:s})}
        >
          ${"boolean"==typeof g.expander&&g.expander?m.html():""}
          ${"string"==typeof g.html?"function"==typeof g.data?l`
        ${g.data(u)}
      `:l`
      ${u[g.data]}
    `:"function"==typeof g.data?g.data(u):u[g.data]}
        </div>
      `,{vido:n,props:{rowId:t,columnId:e},templateProps:o})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Rt(t,e){const{api:n,state:i,onDestroy:s,actions:o,update:r,html:a,createComponent:l}=e,c=n.getActions("list-expander");let d,h,u,p,f,m=[];s(i.subscribe("config.components.ListToggle",t=>f=t));const g=l(f,t.row?{row:t.row}:{});let v;return s(g.destroy),s(i.subscribe("config.wrappers.ListExpander",t=>v=t)),s(i.subscribe("config.classNames",e=>{t.row?(d=n.getClass("list-expander",{row:t.row}),p=n.getClass("list-expander-padding",{row:t.row})):(d=n.getClass("list-expander"),p=n.getClass("list-expander-padding")),r()})),s(i.subscribeAll(["config.list.expander.padding"],t=>{h=t,r()})),t.row?s(i.subscribe(`_internal.list.rows.${t.row.id}.parentId`,e=>{u="width:"+t.row._internal.parents.length*h+"px",m=t.row._internal.children,r()})):(u="width:0px",m=[]),s=>v(a`
        <div class=${d} data-action=${o(c,{row:t.row,api:n,state:i})}>
          <div class=${p} style=${u}></div>
          ${m.length||!t.row?g.html():""}
        </div>
      `,{vido:e,props:t,templateProps:s})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Vt(t,e){const{api:n,state:i,onDestroy:s,actions:o,update:r,html:a,unsafeHTML:l}=e,c="list-expander-toggle";let d;s(i.subscribe("config.wrappers.ListToggle",t=>d=t));const h=n.getActions(c);let u,p,f,m,g,v,b=!1;function y(){b=!b,t.row?i.update(`config.list.rows.${t.row.id}.expanded`,b):i.update("config.list.rows",t=>{for(const e in t)t[e].expanded=b;return t},{only:["*.expanded"]})}return s(i.subscribe("config.classNames",e=>{t.row?(u=n.getClass(c,{row:t.row}),f=n.getClass(c+"-open",{row:t.row}),m=n.getClass(c+"-closed",{row:t.row})):(u=n.getClass(c),f=n.getClass(c+"-open"),m=n.getClass(c+"-closed")),r()})),s(i.subscribeAll(["config.list.expander.size","config.list.expander.icons"],()=>{const t=i.get("config.list.expander");p=`--size: ${t.size}px`,g=t.icons.open,v=t.icons.closed,r()})),t.row?s(i.subscribe(`config.list.rows.${t.row.id}.expanded`,t=>{b=t,r()})):s(i.subscribe("config.list.rows.*.expanded",t=>{for(const e of t)if(e.value){b=!0;break}r()},{bulk:!0})),s=>d(a`
        <div
          class=${u}
          data-actions=${o(h,{row:t.row,api:n,state:i})}
          style=${p}
          @click=${y}
        >
          ${b?a`
                <div class=${f}>
                  ${l(g)}
                </div>
              `:a`
                <div class=${m}>
                  ${l(v)}
                </div>
              `}
        </div>
      `,{vido:e,props:t,templateProps:s})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Ht(t){const{api:e,state:n,onDestroy:i,actions:s,update:o,html:r,createComponent:a}=t,l=n.get("config.components.ChartCalendar"),c=n.get("config.components.ChartTimeline"),d=a(l);i(d.destroy);const h=a(c);i(h.destroy);let u,p,f,m,g="",v="",b=e.getActions("chart");i(n.subscribe("config.classNames",t=>{u=e.getClass("chart"),p=e.getClass("horizontal-scroll"),f=e.getClass("horizontal-scroll-inner"),o()})),i(n.subscribe("config.scroll.left",t=>{m&&m.scrollLeft!==t&&(m.scrollLeft=t),o()})),i(n.subscribeAll(["_internal.chart.dimensions.width","_internal.chart.time.totalViewDurationPx"],(function(t,e){g=`width: ${n.get("_internal.chart.dimensions.width")}px`,v=`width: ${n.get("_internal.chart.time.totalViewDurationPx")}px; height:1px`,o()})));const y={handleEvent(t){let i,s;if(t.stopPropagation(),t.preventDefault(),"scroll"===t.type)n.update("config.scroll.left",t.target.scrollLeft),i=t.target.scrollLeft;else{const o=e.normalizeMouseWheelEvent(t),r=n.get("config.scroll.xMultiplier"),a=n.get("config.scroll.yMultiplier");t.shiftKey&&o.y?n.update("config.scroll.left",t=>i=e.limitScroll("left",t+=o.y*r)):o.x?n.update("config.scroll.left",t=>i=e.limitScroll("left",t+=o.x*r)):n.update("config.scroll.top",t=>s=e.limitScroll("top",t+=o.y*a))}const o=n.get("_internal.elements.chart"),r=n.get("_internal.elements.horizontalScrollInner");if(o){const t=n.get("config.scroll.left");let e=0;t&&(e=Math.round(t/(r.clientWidth-o.clientWidth)*100))>100&&(e=100),n.update("config.scroll.percent.left",e)}},passive:!1};function w(t){m=t,n.update("_internal.elements.horizontalScroll",t)}function _(t){n.update("_internal.elements.horizontalScrollInner",t)}return b.push(t=>{n.update("_internal.elements.chart",t)}),t=>r`
    <div class=${u} data-actions=${s(b,{api:e,state:n})} @wheel=${y}>
      ${d.html()}${h.html()}
      <div class=${p} style=${g} data-actions=${s([w])} @scroll=${y}>
        <div class=${f} style=${v} data-actions=${s([_])} />
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
 */function jt(t){const{api:e,state:n,onDestroy:i,actions:s,update:o,createComponent:r,html:a,repeat:l}=t,c=e.getActions("chart-calendar"),d=n.get("config.components.ChartCalendarDate");let h,u;i(n.subscribe("config.wrappers.ChartCalendar",t=>h=t)),i(n.subscribe("config.classNames",t=>{u=e.getClass("chart-calendar"),o()}));let p,f,m="";i(n.subscribe("config.headerHeight",t=>{m=`height: ${p=t}px;`,o()})),i(n.subscribe("config.chart.time.period",t=>f=t));let g,v=[];return i(n.subscribe(`_internal.chart.time.dates.${f}`,t=>{if(t){g=t,v.forEach(t=>t.component.destroy()),v=[];for(const t of g)v.push({id:t.id,component:r(d,{date:t})});o()}})),i(()=>{v.forEach(t=>t.component.destroy())}),c.push(t=>{n.update("_internal.elements.calendar",t)}),e=>h(a`
        <div class=${u} data-actions=${s(c)} style=${m}>
          ${l(v,t=>t.id,t=>t.component.html())}
        </div>
      `,{props:{},vido:t,templateProps:e})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Yt({date:t},e){const{api:n,state:i,onDestroy:s,actions:o,update:r,html:a}=e,l="chart-calendar-date",c=n.getActions(l);let d,h,u,p,f,m,g,v,b,y,w,_,$,x,M,C;return s(i.subscribe("config.wrappers.ChartCalendarDate",t=>d=t)),s(i.subscribe("config.classNames",()=>{h=n.getClass(l,{date:t}),n.time.date(t.leftGlobal).format("YYYY-MM-DD")===n.time.date().format("YYYY-MM-DD")&&(h+=" current"),n.time.date(t.leftGlobal).subtract(1,"day").format("YYYY-MM-DD")===n.time.date().format("YYYY-MM-DD")&&(h+=" next"),n.time.date(t.leftGlobal).add(1,"day").format("YYYY-MM-DD")===n.time.date().format("YYYY-MM-DD")&&(h+=" previous"),u=n.getClass(`${l}-formatted`,{date:t}),p=n.getClass(`${l}-formatted-year`,{date:t}),f=n.getClass(`${l}-formatted-month`,{date:t}),m=n.getClass(`${l}-formatted-day`,{date:t}),g=n.getClass(`${l}-formatted-day-word`,{date:t}),r()})),s(i.subscribeAll(["_internal.chart.time","config.chart.calendar.vertical.smallFormat"],(function(){v=i.get("_internal.chart.time"),C=v.zoom<=22?18:13;const e=n.time.date(t.leftGlobal),s=v.maxWidth[v.period];b=s<=40;const o=i.get("config.chart.calendar.vertical.smallFormat");y=e.format(o),w=e.format("YYYY"),_=e.format("MMMM"),$=e.format("DD"),x=e.format("dddd"),s<=70?(w=e.format("YY"),_=e.format("MMM"),$=e.format("DD"),x=e.format("ddd")):s<=150&&(x=e.format("ddd")),M=`width: ${t.width}px; margin-left:-${t.subPx}px; --day-size: ${C}px`,r()}),{bulk:!0})),s=>d(a`
        <div class=${h} style=${M} data-actions=${o(c,{date:t,api:n,state:i})}>
          ${b?a`
                <div class=${u} style="transform: rotate(90deg);">${y}</div>
              `:a`
                <div class=${u}>
                  <div class=${p}>${w}</div>
                  <div class=${f}>${_}</div>
                  <div class=${m}>${$}</div>
                  <div class=${g}>${x}</div>
                </div>
              `}
        </div>
      `,{props:{},vido:e,templateProps:s})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Wt(t){const{api:e,state:n,onDestroy:i,actions:s,update:o,html:r,createComponent:a}=t,l=e.getActions("chart-timeline");let c;i(n.subscribe("config.wrappers.ChartTimeline",t=>c=t));const d=n.get("config.components.ChartTimelineGrid"),h=n.get("config.components.ChartTimelineItems"),u=a(d);i(u.destroy);const p=a(h);let f,m;i(p.destroy),i(n.subscribe("config.classNames",t=>{f=e.getClass("chart-timeline"),m=e.getClass("chart-timeline-inner"),o()}));let g="",v="";return i(n.subscribeAll(["_internal.height","_internal.list.rowsHeight"],()=>{g=`height: ${n.get("_internal.height")}px`,v=`height: ${n.get("_internal.list.rowsHeight")}px;`,o()})),l.push(t=>{n.update("_internal.elements.gantt",t)}),n=>c(r`
        <div class=${f} style=${g} data-actions=${s(l)} @wheel=${e.onScroll}>
          <div class=${m} style=${v}>
            ${u.html()}${p.html()}
          </div>
        </div>
      `,{props:{},vido:t,templateProps:n})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function zt(t){const{api:e,state:n,onDestroy:i,actions:s,update:o,html:r,createComponent:a,repeat:l}=t,c=e.getActions("chart-timeline-grid");let d;i(n.subscribe("config.wrappers.ChartTimelineGrid",t=>d=t));const h=n.get("config.components.ChartTimelineGridRow");let u,p,f,m;i(n.subscribe("config.classNames",()=>{u=e.getClass("chart-timeline-grid"),o()})),i(n.subscribe("_internal.height",t=>{f=`height: ${p=t}px`,o()})),i(n.subscribe("config.chart.time.period",t=>m=t));let g,v=[];return i(n.subscribeAll([`_internal.chart.time.dates.${m}`,"_internal.list.visibleRows","config.chart.grid.block"],(function(){const t=n.get("_internal.list.visibleRows"),e=n.get(`_internal.chart.time.dates.${m}`);if(!e)return;v.forEach(t=>t.component.destroy()),v=[];let i=0;g=[];for(const n in t){const s=t[n],r=[];let l=0;for(const t of e)r.push({id:l++,date:t,row:s,top:i});const c={id:s.id,blocks:r,rowData:s,top:i};g.push(c),v.push({id:s.id,component:a(h,{row:c})}),i+=s.height,o()}}),{bulk:!0})),c.push(t=>{n.update("_internal.elements.grid")}),i(()=>{v.forEach(t=>t.component.destroy())}),i=>d(r`
        <div class=${u} data-actions=${s(c,{api:e,state:n})} style=${f}>
          ${v.map(t=>t.component.html())}
        </div>
      `,{props:{},vido:t,templateProps:i})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Gt({row:t,time:e,top:n},i){const{api:s,state:o,onDestroy:r,actions:a,update:l,html:c}=i,d=s.getActions("chart-timeline-grid-block",{row:t,time:e,top:n});let h;r(o.subscribe("config.wrappers.ChartTimelineGridBlock",t=>h=t));let u=s.getClass("chart-timeline-grid-block",{row:t});r(o.subscribe("config.classNames",()=>{u=s.getClass("chart-timeline-grid-block"),e.leftGlobal===s.time.date().startOf("day").valueOf()&&(u+=" current"),l()}));let p=`width: ${e.width}px;height: 100%;margin-left:-${e.subPx}px;`;for(const e of t.rowData._internal.parents){const t=o.get("config.list.rows."+e);"object"==typeof t.style&&"Object"===t.style.constructor.name&&"object"==typeof t.style.gridBlock&&"Object"===t.style.gridBlock.constructor.name&&"string"==typeof t.style.gridBlock.children&&(p+=t.style.gridBlock.children)}return"object"==typeof t.rowData.style&&"Object"===t.rowData.style.constructor.name&&"object"==typeof t.rowData.style.gridBlock&&"Object"===t.rowData.style.gridBlock.constructor.name&&"string"==typeof t.rowData.style.gridBlock.current&&(p+=t.rowData.style.gridBlock.current),r=>h(c`
        <div
          class=${u}
          data-actions=${a(d,{row:t,time:e,top:n,api:s,state:o})}
          style=${p}
        />
      `,{props:{row:t,time:e,top:n},vido:i,templateProps:r})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Bt({row:t},e){const{api:n,state:i,onDestroy:s,actions:o,update:r,html:a,createComponent:l,repeat:c}=e;let d;s(i.subscribe("config.wrappers.ChartTimelineGridRow",t=>d=t));const h=i.get("config.components.ChartTimelineGridBlock"),u=n.getActions("chart-timeline-grid-row");let p;s(i.subscribe("config.classNames",e=>{p=n.getClass("chart-timeline-grid-row",{row:t}),r()}));let f=[];for(const e of t.blocks)f.push({id:e.id,component:l(h,{row:t,time:e.date,top:e.top})});s(()=>{f.forEach(t=>t.component.destroy())});let m=`height: ${t.rowData.height}px;`;return s=>d(a`
        <div class=${p} data-actions=${o(u,{row:t,api:n,state:i})} style=${m}>
          ${f.map(t=>t.component.html())}
        </div>
      `,{vido:e,props:{row:t},templateProps:s})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Ft(t){const{api:e,state:n,onDestroy:i,actions:s,update:o,html:r,createComponent:a,repeat:l}=t,c=e.getActions("chart-timeline-items");let d;i(n.subscribe("config.wrappers.ChartTimelineItems",t=>d=t));const h=n.get("config.components.ChartTimelineItemsRow");let u;i(n.subscribe("config.classNames",()=>{u=e.getClass("chart-timeline-items"),o()}));let p=[],f=[];return i(n.subscribe("_internal.list.visibleRows;",t=>{p=t,f.forEach(t=>t.component.destroy()),f=[];for(const t of p)f.push({id:t.id,component:a(h,{rowId:t.id})});o()})),i(()=>{f.forEach(t=>t.component.destroy())}),t=>r`
    <div class=${u} data-actions=${s(c,{api:e,state:n})}>
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
 */function Ut({rowId:t},e){const{api:n,state:i,onDestroy:s,actions:o,update:r,html:a,createComponent:l,repeat:c}=e;let d;s(i.subscribe("config.wrappers.ChartTimelineItemsRow",t=>d=t));const h=i.get("config.components.ChartTimelineItemsRowItem");let u,p,f,m=`_internal.flatTreeMapById.${t}`;s(i.subscribeAll([m,"_internal.chart"],t=>{u=i.get(m);const e=i.get("_internal.chart");p=`width:${e.dimensions.width}px;height:${u.height}px;--row-height:${u.height}px;`,f=`width: ${e.time.totalViewDurationPx}px;height: 100%;`,r()}));let g,v=[];s(i.subscribe(`_internal.flatTreeMapById.${t}._internal.items;`,e=>{g=e,v.forEach(t=>t.component.destroy()),v=[];for(const e of g)v.push({id:e.id,component:l(h,{rowId:t,itemId:e.id})});r()})),s(()=>{v.forEach(t=>t.component.destroy())});const b=n.getActions("chart-timeline-items-row");let y,w;return s(i.subscribe("config.classNames",()=>{y=n.getClass("chart-timeline-items-row",{row:u}),w=n.getClass("chart-timeline-items-row-inner",{row:u}),r()})),n=>d(a`
        <div class=${y} data-actions=${o(b)} style=${p}>
          <div class=${w} style=${f}>
            ${c(v,t=>t.id,t=>t.component.html())}
          </div>
        </div>
      `,{props:{rowId:t},vido:e,templateProps:n})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Jt({rowId:t,itemId:e},n){const{api:i,state:s,onDestroy:o,actions:r,update:a,html:l}=n;let c;o(s.subscribe("config.wrappers.ChartTimelineItemsRowItem",t=>c=t));let d,h=`config.list.rows.${t}`;o(s.subscribe(h,t=>{d=t,a()}));let u,p=`config.chart.items.${e}`;o(s.subscribe(p,t=>{u=t,a()}));const f="chart-timeline-items-row-item",m=i.getActions(f);let g,v,b;o(s.subscribe("config.classNames",()=>{g=i.getClass(f,{row:d,item:u}),v=i.getClass(f+"-content",{row:d,item:u}),b=i.getClass(f+"-content-label",{row:d,item:u}),a()}));let y,w="",_=0,$=0;return o(s.subscribeAll(["_internal.chart.time","config.scroll",p],t=>{u=s.get(p);let e=s.get("_internal.chart.time");_=(u.time.start-e.leftGlobal)/e.timePerPixel,$=(u.time.end-u.time.start)/e.timePerPixel,$-=s.get("config.chart.spacing");i.isItemInViewport(u,e.leftGlobal,e.rightGlobal);y=`left:${_}px;width:${$}px;`,"object"==typeof u.style&&"Object"===u.style.constructor.name&&"string"==typeof u.style.current&&(w+=u.style.current),a()},{bulk:!0})),o=>c(l`
    <div
      class=${g}
      data-actions=${r(m,{item:u,row:d,left:_,width:$,api:i,state:s})}
      style=${y}
    >
      <div class=${v} style=${w}>
        <div class=${b}">${u.label}</div>
      </div>
    </div>
  `,{vido:n,props:{rowId:t,itemId:e},templateProps:o})}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */const qt=["","list","list-column","list-column-header","list-expander","list-expander-toggle","list-column-header-resizer","list-column-row","chart","chart-calendar","chart-calendar-date","chart-timeline","chart-timeline-grid","chart-timeline-grid-row","chart-timeline-items","chart-timeline-items-row","chart-timeline-items-row-item","chart-timeline-grid-column","chart-timeline-grid-block"];var Zt={height:740,headerHeight:86,components:{Main:Ot,List:Dt,ListColumn:Lt,ListColumnHeader:Et,ListColumnHeaderResizer:St,ListColumnRow:kt,ListExpander:Rt,ListToggle:Vt,Chart:Ht,ChartCalendar:jt,ChartCalendarDate:Yt,ChartTimeline:Wt,ChartTimelineGrid:zt,ChartTimelineGridBlock:Gt,ChartTimelineGridRow:Bt,ChartTimelineItems:Ft,ChartTimelineItemsRow:Ut,ChartTimelineItemsRowItem:Jt},wrappers:{Main:t=>t,List:t=>t,ListColumn:t=>t,ListColumnHeader:t=>t,ListColumnHeaderResizer:t=>t,ListColumnRow:t=>t,ListExpander:t=>t,ListToggle:t=>t,Chart:t=>t,ChartCalendar:t=>t,ChartCalendarDate:t=>t,ChartTimeline:t=>t,ChartTimelineGrid:t=>t,ChartTimelineGridBlock:t=>t,ChartTimelineGridRow:t=>t,ChartTimelineItems:t=>t,ChartTimelineItemsRow:t=>t,ChartTimelineItemsRowItem:t=>t},list:{rows:{},rowHeight:40,columns:{percent:100,resizer:{width:10,inRealTime:!0,dots:6},data:{}},expander:{padding:20,size:20,icons:{open:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',closed:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'}}},scroll:{top:0,left:0,xMultiplier:1.5,yMultiplier:1,percent:{top:0,left:0}},chart:{time:{from:0,to:0,zoom:21,period:"day",dates:{},maxWidth:{}},calendar:{vertical:{smallFormat:"YYYY-MM-DD"}},grid:{},items:{}},classNames:{},actions:function(){const t={};return qt.forEach(e=>t[e]=[]),t}(),locale:{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekStart:1,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},ordinal:t=>{const e=["th","st","nd","rd"],n=t%100;return`[${t}${e[(n-20)%10]||e[n]||e[0]}]`}}};"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var Xt=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t,e){t.exports=function(){var t="millisecond",e="second",n="minute",i="hour",s="day",o="week",r="month",a="quarter",l="year",c=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,d=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,h=function(t,e,n){var i=String(t);return!i||i.length>=e?t:""+Array(e+1-i.length).join(n)+t},u={s:h,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),i=Math.floor(n/60),s=n%60;return(e<=0?"+":"-")+h(i,2,"0")+":"+h(s,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),i=t.clone().add(n,r),s=e-i<0,o=t.clone().add(n+(s?-1:1),r);return Number(-(n+(e-i)/(s?i-o:o-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(c){return{M:r,y:l,w:o,d:s,h:i,m:n,s:e,ms:t,Q:a}[c]||String(c||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},p={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},f="en",m={};m[f]=p;var g=function(t){return t instanceof w},v=function(t,e,n){var i;if(!t)return f;if("string"==typeof t)m[t]&&(i=t),e&&(m[t]=e,i=t);else{var s=t.name;m[s]=t,i=s}return n||(f=i),i},b=function(t,e,n){if(g(t))return t.clone();var i=e?"string"==typeof e?{format:e,pl:n}:e:{};return i.date=t,new w(i)},y=u;y.l=v,y.i=g,y.w=function(t,e){return b(t,{locale:e.$L,utc:e.$u})};var w=function(){function h(t){this.$L=this.$L||v(t.locale,null,!0),this.parse(t)}var u=h.prototype;return u.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(y.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var i=e.match(c);if(i)return n?new Date(Date.UTC(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)):new Date(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)}return new Date(e)}(t),this.init()},u.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},u.$utils=function(){return y},u.isValid=function(){return!("Invalid Date"===this.$d.toString())},u.isSame=function(t,e){var n=b(t);return this.startOf(e)<=n&&n<=this.endOf(e)},u.isAfter=function(t,e){return b(t)<this.startOf(e)},u.isBefore=function(t,e){return this.endOf(e)<b(t)},u.$g=function(t,e,n){return y.u(t)?this[e]:this.set(n,t)},u.year=function(t){return this.$g(t,"$y",l)},u.month=function(t){return this.$g(t,"$M",r)},u.day=function(t){return this.$g(t,"$W",s)},u.date=function(t){return this.$g(t,"$D","date")},u.hour=function(t){return this.$g(t,"$H",i)},u.minute=function(t){return this.$g(t,"$m",n)},u.second=function(t){return this.$g(t,"$s",e)},u.millisecond=function(e){return this.$g(e,"$ms",t)},u.unix=function(){return Math.floor(this.valueOf()/1e3)},u.valueOf=function(){return this.$d.getTime()},u.startOf=function(t,a){var c=this,d=!!y.u(a)||a,h=y.p(t),u=function(t,e){var n=y.w(c.$u?Date.UTC(c.$y,e,t):new Date(c.$y,e,t),c);return d?n:n.endOf(s)},p=function(t,e){return y.w(c.toDate()[t].apply(c.toDate(),(d?[0,0,0,0]:[23,59,59,999]).slice(e)),c)},f=this.$W,m=this.$M,g=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case l:return d?u(1,0):u(31,11);case r:return d?u(1,m):u(0,m+1);case o:var b=this.$locale().weekStart||0,w=(f<b?f+7:f)-b;return u(d?g-w:g+(6-w),m);case s:case"date":return p(v+"Hours",0);case i:return p(v+"Minutes",1);case n:return p(v+"Seconds",2);case e:return p(v+"Milliseconds",3);default:return this.clone()}},u.endOf=function(t){return this.startOf(t,!1)},u.$set=function(o,a){var c,d=y.p(o),h="set"+(this.$u?"UTC":""),u=(c={},c[s]=h+"Date",c.date=h+"Date",c[r]=h+"Month",c[l]=h+"FullYear",c[i]=h+"Hours",c[n]=h+"Minutes",c[e]=h+"Seconds",c[t]=h+"Milliseconds",c)[d],p=d===s?this.$D+(a-this.$W):a;if(d===r||d===l){var f=this.clone().set("date",1);f.$d[u](p),f.init(),this.$d=f.set("date",Math.min(this.$D,f.daysInMonth())).toDate()}else u&&this.$d[u](p);return this.init(),this},u.set=function(t,e){return this.clone().$set(t,e)},u.get=function(t){return this[y.p(t)]()},u.add=function(t,a){var c,d=this;t=Number(t);var h=y.p(a),u=function(e){var n=b(d);return y.w(n.date(n.date()+Math.round(e*t)),d)};if(h===r)return this.set(r,this.$M+t);if(h===l)return this.set(l,this.$y+t);if(h===s)return u(1);if(h===o)return u(7);var p=(c={},c[n]=6e4,c[i]=36e5,c[e]=1e3,c)[h]||1,f=this.valueOf()+t*p;return y.w(f,this)},u.subtract=function(t,e){return this.add(-1*t,e)},u.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",i=y.z(this),s=this.$locale(),o=this.$H,r=this.$m,a=this.$M,l=s.weekdays,c=s.months,h=function(t,i,s,o){return t&&(t[i]||t(e,n))||s[i].substr(0,o)},u=function(t){return y.s(o%12||12,t,"0")},p=s.meridiem||function(t,e,n){var i=t<12?"AM":"PM";return n?i.toLowerCase():i},f={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:y.s(a+1,2,"0"),MMM:h(s.monthsShort,a,c,3),MMMM:c[a]||c(this,n),D:this.$D,DD:y.s(this.$D,2,"0"),d:String(this.$W),dd:h(s.weekdaysMin,this.$W,l,2),ddd:h(s.weekdaysShort,this.$W,l,3),dddd:l[this.$W],H:String(o),HH:y.s(o,2,"0"),h:u(1),hh:u(2),a:p(o,r,!0),A:p(o,r,!1),m:String(r),mm:y.s(r,2,"0"),s:String(this.$s),ss:y.s(this.$s,2,"0"),SSS:y.s(this.$ms,3,"0"),Z:i};return n.replace(d,(function(t,e){return e||f[t]||i.replace(":","")}))},u.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},u.diff=function(t,c,d){var h,u=y.p(c),p=b(t),f=6e4*(p.utcOffset()-this.utcOffset()),m=this-p,g=y.m(this,p);return g=(h={},h[l]=g/12,h[r]=g,h[a]=g/3,h[o]=(m-f)/6048e5,h[s]=(m-f)/864e5,h[i]=m/36e5,h[n]=m/6e4,h[e]=m/1e3,h)[u]||m,d?g:y.a(g)},u.daysInMonth=function(){return this.endOf(r).$D},u.$locale=function(){return m[this.$L]},u.locale=function(t,e){if(!t)return this.$L;var n=this.clone();return n.$L=v(t,e,!0),n},u.clone=function(){return y.w(this.toDate(),this)},u.toDate=function(){return new Date(this.$d)},u.toJSON=function(){return this.isValid()?this.toISOString():null},u.toISOString=function(){return this.$d.toISOString()},u.toString=function(){return this.$d.toUTCString()},h}();return b.prototype=w.prototype,b.extend=function(t,e){return t(e,w,b),b},b.locale=v,b.isDayjs=g,b.unix=function(t){return b(1e3*t)},b.en=m[f],b.Ls=m,b}()}));
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function Kt(t,e){const n=t.get("config.locale");return Xt.locale(n,null,!0),{date:t=>t?Xt(t).locale(n.name):Xt().locale(n.name),recalculateFromTo(e){0!==(e={...e}).from&&(e.from=this.date(e.from).startOf("day").valueOf()),0!==e.to&&(e.to=this.date(e.to).endOf("day").valueOf());let n=Number.MAX_SAFE_INTEGER,i=0;const s=t.get("config.chart.items");if(0===Object.keys(s).length)return e;if(0===e.from||0===e.to){for(let t in s){const e=s[t];n>e.time.start&&(n=e.time.start),i<e.time.end&&(i=e.time.end)}0===e.from&&(e.from=this.date(n).startOf("day").valueOf()),0===e.to&&(e.to=this.date(i).endOf("day").valueOf())}return e}}}class Qt{constructor(t,e="*"){this.wchar=e,this.pattern=t,this.segments=[],this.starCount=0,this.minLength=0,this.maxLength=0,this.segStartIndex=0;for(let n=0,i=t.length;n<i;n+=1){const i=t[n];i===e&&(this.starCount+=1,n>this.segStartIndex&&this.segments.push(t.substring(this.segStartIndex,n)),this.segments.push(i),this.segStartIndex=n+1)}this.segStartIndex<t.length&&this.segments.push(t.substring(this.segStartIndex)),this.starCount?(this.minLength=t.length-this.starCount,this.maxLength=1/0):this.maxLength=this.minLength=t.length}match(t){if(this.pattern===this.wchar)return!0;if(0===this.segments.length)return this.pattern===t;const{length:e}=t;if(e<this.minLength||e>this.maxLength)return!1;let n=this.segments.length-1,i=t.length-1,s=!1;for(;;){const e=this.segments[n];if(n-=1,e===this.wchar)s=!0;else{const n=i+1-e.length,o=t.lastIndexOf(e,n);if(-1===o||o>n)return!1;if(s)i=o-1,s=!1;else{if(o!==n)return!1;i-=e.length}}if(0>n)break}return!0}}class te{constructor(t,e,n){this.obj=t,this.delimeter=e,this.wildcard=n}simpleMatch(t,e){if(t===e)return!0;if(t===this.wildcard)return!0;const n=t.indexOf(this.wildcard);if(n>-1){const i=t.substr(n+1);if(0===n||e.substring(0,n)===t.substring(0,n)){const t=i.length;return!(t>0)||e.substr(-t)===i}}return!1}match(t,e){return t===e||t===this.wildcard||e===this.wildcard||this.simpleMatch(t,e)||new Qt(t).match(e)}handleArray(t,e,n,i,s={}){let o=t.indexOf(this.delimeter,n),r=!1;-1===o&&(r=!0,o=t.length);const a=t.substring(n,o);let l=0;for(const n of e){const e=l.toString(),c=""===i?e:i+this.delimeter+l;(a===this.wildcard||a===e||this.simpleMatch(a,e))&&(r?s[c]=n:this.goFurther(t,n,o+1,c,s)),l++}return s}handleObject(t,e,n,i,s={}){let o=t.indexOf(this.delimeter,n),r=!1;-1===o&&(r=!0,o=t.length);const a=t.substring(n,o);for(let n in e){n=n.toString();const l=""===i?n:i+this.delimeter+n;(a===this.wildcard||a===n||this.simpleMatch(a,n))&&(r?s[l]=e[n]:this.goFurther(t,e[n],o+1,l,s))}return s}goFurther(t,e,n,i,s={}){return Array.isArray(e)?this.handleArray(t,e,n,i,s):this.handleObject(t,e,n,i,s)}get(t){return this.goFurther(t,this.obj,0,"")}}class ee{static get(t,e,n=null){if(null===n&&(n=t.slice()),0===n.length||void 0===e)return e;const i=n.shift();return e.hasOwnProperty(i)?0===n.length?e[i]:ee.get(t,e[i],n):void 0}static set(t,e,n,i=null){if(null===i&&(i=t.slice()),0===i.length){for(const t in n)delete n[t];for(const t in e)n[t]=e[t];return}const s=i.shift();0!==i.length?(n.hasOwnProperty(s)||(n[s]={}),ee.set(t,e,n[s],i)):n[s]=e}}const ne={delimeter:".",notRecursive:";",param:":",wildcard:"*",log:function(t,e){console.debug(t,e)}},ie={bulk:!1,debug:!1,source:"",data:void 0},se={only:[],source:"",debug:!1,data:void 0};class oe{constructor(t={},e=ne){this.listeners={},this.data=t,this.options=Object.assign(Object.assign({},ne),e),this.id=0,this.pathGet=ee.get,this.pathSet=ee.set,this.scan=new te(this.data,this.options.delimeter,this.options.wildcard)}getListeners(){return this.listeners}destroy(){this.data=void 0,this.listeners={}}match(t,e){return t===e||(t===this.options.wildcard||e===this.options.wildcard||this.scan.match(t,e))}cutPath(t,e){return this.split(this.cleanNotRecursivePath(t)).slice(0,this.split(this.cleanNotRecursivePath(e)).length).join(this.options.delimeter)}trimPath(t){return this.cleanNotRecursivePath(t).replace(new RegExp(`^\\${this.options.delimeter}{1}`),"")}split(t){return""===t?[]:t.split(this.options.delimeter)}isWildcard(t){return t.includes(this.options.wildcard)}isNotRecursive(t){return t.endsWith(this.options.notRecursive)}cleanNotRecursivePath(t){return this.isNotRecursive(t)?t.slice(0,-this.options.notRecursive.length):t}hasParams(t){return t.includes(this.options.param)}getParamsInfo(t){let e={replaced:"",original:t,params:{}},n=0,i=[];for(const s of this.split(t)){e.params[n]={original:s,replaced:"",name:""};const t=new RegExp(`\\${this.options.param}([^\\${this.options.delimeter}\\${this.options.param}]+)`,"g");let o=t.exec(s);o?(e.params[n].name=o[1],t.lastIndex=0,e.params[n].replaced=s.replace(t,this.options.wildcard),i.push(e.params[n].replaced),n++):(delete e.params[n],i.push(s),n++)}return e.replaced=i.join(this.options.delimeter),e}getParams(t,e){if(!t)return;const n=this.split(e),i={};for(const e in t.params){i[t.params[e].name]=n[e]}return i}subscribeAll(t,e,n=ie){let i=[];for(const s of t)i.push(this.subscribe(s,e,n));return()=>{for(const t of i)t();i=[]}}getCleanListenersCollection(t={}){return Object.assign({listeners:{},isRecursive:!1,isWildcard:!1,hasParams:!1,match:void 0,paramsInfo:void 0,path:void 0,count:0},t)}getCleanListener(t,e=ie){return{fn:t,options:Object.assign(Object.assign({},ie),e)}}getListenerCollectionMatch(t,e,n){return t=this.cleanNotRecursivePath(t),i=>(e&&(i=this.cutPath(i,t)),!(!n||!this.match(t,i))||t===i)}getListenersCollection(t,e){if(void 0!==this.listeners[t]){let n=this.listeners[t];return this.id++,n.listeners[this.id]=e,n}let n={isRecursive:!0,isWildcard:!1,hasParams:!1,paramsInfo:void 0,originalPath:t,path:t};this.hasParams(n.path)&&(n.paramsInfo=this.getParamsInfo(n.path),n.path=n.paramsInfo.replaced,n.hasParams=!0),n.isWildcard=this.isWildcard(n.path),this.isNotRecursive(n.path)&&(n.isRecursive=!1);let i=this.listeners[n.path]=this.getCleanListenersCollection(Object.assign(Object.assign({},n),{match:this.getListenerCollectionMatch(n.path,n.isRecursive,n.isWildcard)}));return this.id++,i.listeners[this.id]=e,i}subscribe(t,e,n=ie,i="subscribe"){let s=this.getCleanListener(e,n);const o=this.getListenersCollection(t,s);if(o.count++,t=o.path,o.isWildcard){const r=this.scan.get(this.cleanNotRecursivePath(t));if(n.bulk){const a=[];for(const t in r)a.push({path:t,params:this.getParams(o.paramsInfo,t),value:r[t]});e(a,{type:i,listener:s,listenersCollection:o,path:{listener:t,update:void 0,resolved:void 0},options:n,params:void 0})}else for(const a in r)e(r[a],{type:i,listener:s,listenersCollection:o,path:{listener:t,update:void 0,resolved:this.cleanNotRecursivePath(a)},params:this.getParams(o.paramsInfo,a),options:n})}else e(this.pathGet(this.split(this.cleanNotRecursivePath(t)),this.data),{type:i,listener:s,listenersCollection:o,path:{listener:t,update:void 0,resolved:this.cleanNotRecursivePath(t)},params:this.getParams(o.paramsInfo,t),options:n});return this.debugSubscribe(s,o,t),this.unsubscribe(t,this.id)}unsubscribe(t,e){const n=this.listeners,i=n[t];return function(){delete i.listeners[e],i.count--,0===i.count&&delete n[t]}}same(t,e){return(["number","string","undefined","boolean"].includes(typeof t)||null===t)&&e===t}notifyListeners(t,e=[],n=!0){const i=[];for(const s in t){let{single:o,bulk:r}=t[s];for(const t of o){if(e.includes(t))continue;const s=this.debugTime(t);t.listener.fn(t.value(),t.eventInfo),n&&i.push(t),this.debugListener(s,t)}for(const t of r){if(e.includes(t))continue;const s=this.debugTime(t),o=t.value.map(t=>Object.assign(Object.assign({},t),{value:t.value()}));t.listener.fn(o,t.eventInfo),n&&i.push(t),this.debugListener(s,t)}}return i}getSubscribedListeners(t,e,n,i="update",s=null){n=Object.assign(Object.assign({},se),n);const o={};for(let r in this.listeners){const a=this.listeners[r];if(o[r]={single:[],bulk:[],bulkData:[]},a.match(t)){const l=a.paramsInfo?this.getParams(a.paramsInfo,t):void 0,c=a.isRecursive||a.isWildcard?()=>this.get(this.cutPath(t,r)):()=>e,d=[{value:c,path:t,params:l}];for(const e in a.listeners){const h=a.listeners[e];h.options.bulk?o[r].bulk.push({listener:h,listenersCollection:a,eventInfo:{type:i,listener:h,path:{listener:r,update:s||t,resolved:void 0},params:l,options:n},value:d}):o[r].single.push({listener:h,listenersCollection:a,eventInfo:{type:i,listener:h,path:{listener:r,update:s||t,resolved:this.cleanNotRecursivePath(t)},params:l,options:n},value:c})}}}return o}notifySubscribedListeners(t,e,n,i="update",s=null){return this.notifyListeners(this.getSubscribedListeners(t,e,n,i,s))}getNestedListeners(t,e,n,i="update",s=null){const o={};for(let r in this.listeners){o[r]={single:[],bulk:[]};const a=this.listeners[r],l=this.cutPath(r,t);if(this.match(l,t)){const c=this.trimPath(r.substr(l.length)),d=new te(e,this.options.delimeter,this.options.wildcard).get(c),h=a.paramsInfo?this.getParams(a.paramsInfo,t):void 0,u=[],p={};for(const e in d){const l=()=>d[e],c=[t,e].join(this.options.delimeter);for(const e in a.listeners){const d=a.listeners[e],f={type:i,listener:d,listenersCollection:a,path:{listener:r,update:s||t,resolved:this.cleanNotRecursivePath(c)},params:h,options:n};d.options.bulk?(u.push({value:l,path:c,params:h}),p[e]=d):o[r].single.push({listener:d,listenersCollection:a,eventInfo:f,value:l})}}for(const e in p){const s=p[e],l={type:i,listener:s,listenersCollection:a,path:{listener:r,update:t,resolved:void 0},options:n,params:h};o[r].bulk.push({listener:s,listenersCollection:a,eventInfo:l,value:u})}}}return o}notifyNestedListeners(t,e,n,i="update",s,o=null){return this.notifyListeners(this.getNestedListeners(t,e,n,i,o),s,!1)}getNotifyOnlyListeners(t,e,n,i="update",s=null){const o={};if("object"!=typeof n.only||!Array.isArray(n.only)||void 0===n.only[0]||!this.canBeNested(e))return o;for(const r of n.only){const a=new te(e,this.options.delimeter,this.options.wildcard).get(r);o[r]={bulk:[],single:[]};for(const e in a){const l=t+this.options.delimeter+e;for(const c in this.listeners){const d=this.listeners[c],h=d.paramsInfo?this.getParams(d.paramsInfo,l):void 0;if(this.match(c,l)){const u=()=>a[e],p=[{value:u,path:l,params:h}];for(const e in d.listeners){const a=d.listeners[e],f={type:i,listener:a,listenersCollection:d,path:{listener:c,update:s||t,resolved:this.cleanNotRecursivePath(l)},params:h,options:n};a.options.bulk?o[r].bulk.some(t=>t.listener===a)||o[r].bulk.push({listener:a,listenersCollection:d,eventInfo:f,value:p}):o[r].single.push({listener:a,listenersCollection:d,eventInfo:f,value:u})}}}}}return o}notifyOnly(t,e,n,i="update",s=null){return void 0!==this.notifyListeners(this.getNotifyOnlyListeners(t,e,n,i,s))[0]}canBeNested(t){return"object"==typeof t&&null!==t}getUpdateValues(t,e,n){"object"==typeof t&&null!==t&&(t=Array.isArray(t)?t.slice():Object.assign({},t));let i=n;return"function"==typeof n&&(i=n(this.pathGet(e,this.data))),{newValue:i,oldValue:t}}wildcardUpdate(t,e,n=se){n=Object.assign(Object.assign({},se),n);const i=this.scan.get(t),s={};for(const t in i){const n=this.split(t),{oldValue:o,newValue:r}=this.getUpdateValues(i[t],n,e);this.same(r,o)||(s[t]=r)}const o=[];for(const e in s){const i=s[e];n.only.length?o.push(this.getNotifyOnlyListeners(e,i,n,"update",t)):(o.push(this.getSubscribedListeners(e,i,n,"update",t)),this.canBeNested(i)&&o.push(this.getNestedListeners(e,i,n,"update",t))),n.debug&&this.options.log("Wildcard update",{path:e,newValue:i}),this.pathSet(this.split(e),i,this.data)}let r=[];for(const t of o)r=[...r,...this.notifyListeners(t,r)]}update(t,e,n=se){if(this.isWildcard(t))return this.wildcardUpdate(t,e,n);const i=this.split(t),{oldValue:s,newValue:o}=this.getUpdateValues(this.pathGet(i,this.data),i,e);if(n.debug&&this.options.log(`Updating ${t} ${n.source?`from ${n.source}`:""}`,s,o),this.same(o,s))return o;if(this.pathSet(i,o,this.data),n=Object.assign(Object.assign({},se),n),this.notifyOnly(t,o,n))return o;const r=this.notifySubscribedListeners(t,o,n);return this.canBeNested(o)&&this.notifyNestedListeners(t,o,n,"update",r),o}get(t){return void 0===t||""===t?this.data:this.pathGet(this.split(t),this.data)}debugSubscribe(t,e,n){t.options.debug&&this.options.log("listener subscribed",n,t,e)}debugListener(t,e){(e.eventInfo.options.debug||e.listener.options.debug)&&this.options.log("Listener fired",{time:Date.now()-t,info:e})}debugTime(t){return t.listener.options.debug||t.eventInfo.options.debug?Date.now():0}}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */const re="gantt-schedule-timeline-calendar";function ae(t){return t&&"object"==typeof t&&!Array.isArray(t)}function le(t,...e){const n=e.shift();if(ae(t)&&ae(n))for(const e in n)if(ae(n[e]))void 0===t[e]&&(t[e]={}),t[e]=le(t[e],n[e]);else if(Array.isArray(n[e])){t[e]=[];for(let i of n[e])ae(i)?t[e].push(le({},i)):t[e].push(i)}else t[e]=n[e];return e.length?le(t,...e):t}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
const ce={components:{Main:Ot},scrollBarHeight:17,height:0,treeMap:{},flatTreeMap:[],flatTreeMapById:{},list:{expandedHeight:0,visibleRows:[],rows:{},width:0},dimensions:{width:0,height:0},chart:{dimensions:{width:0,innerWidth:0},visibleItems:[],time:{dates:{},timePerPixel:0,firstTaskTime:0,lastTaskTime:0,totalViewDurationMs:0,totalViewDurationPx:0,leftGlobal:0,rightGlobal:0,leftPx:0,rightPx:0,leftInner:0,rightInner:0,maxWidth:{}}},elements:{}},de=t=>{const e=t.state,n=function(t){let e=t.get(),n=[];const i={name:re,debug:!1,log(...t){this.debug&&console.log.call(console,...t)},mergeDeep:le,getComponentData(t,e){const n={};return n.componentName=t,n.className=this.getClass(t,e),n.action=this.getAction(t),n},getClass(n,i){let s=`${re}__${n}`;n===this.name&&(s=this.name);let o=`${s} `,r="-";if(void 0!==i)for(const t in i){if("Object"===i[t].constructor.name&&void 0!==i[t].id)return r+=`-${t}_${i[t].id}`,o+o.trim()+r;"string"!=typeof i[t]&&"number"!=typeof i[t]||(r+=`-${t}_${i[t]}`)}return"-"!=r&&(o+=s+r+" "),void 0!==e.config.classNames[n]&&t.get(`config.classNames.${n}`).forEach(t=>o+=t+" "),void 0!==e.config.classNames[n+r]&&t.get(`config.classNames.${n+r}`).forEach(t=>o+=t+" "),o.trim()},allActions:[],getActions(e){this.allActions.includes(e)||this.allActions.push(e);let n=t.get("config.actions."+e);return void 0===n&&(n=[]),n},isItemInViewport:(t,e,n)=>t.time.start>=e&&t.time.start<n||t.time.end>=e&&t.time.end<n,fillEmptyRowValues(t){let n=0;for(const i in t){const s=t[i];s._internal={parents:[],children:[],items:[]},"number"!=typeof s.height&&(s.height=e.config.list.rowHeight),"boolean"!=typeof s.expanded&&(s.expanded=!1),s.top=n,n+=s.height}return t},generateParents(t,e="parentId"){const n={};for(const i of t){const t=void 0!==i[e]?i[e]:"";void 0===n[t]&&(n[t]={}),n[t][i.id]=i}return n},fastTree(t,e,n=[]){const i=t[e.id];if(e._internal.parents=n,void 0===i)return e._internal.children=[],e;""!==e.id&&(n=[...n,e.id]),e._internal.children=Object.values(i);for(const e in i){const s=i[e];this.fastTree(t,s,n)}return e},makeTreeMap(t,e){const n=this.generateParents(e,"rowId");for(const e of t)e._internal.items=void 0!==n[e.id]?Object.values(n[e.id]):[];const i=this.generateParents(t);return this.fastTree(i,{id:"",_internal:{children:[],parents:[],items:[]}})},getFlatTreeMapById(t,e={}){for(const n of t._internal.children)e[n.id]=n,this.getFlatTreeMapById(n,e);return e},flattenTreeMap(t,e=[]){for(const n of t._internal.children)e.push(n.id),this.flattenTreeMap(n,e);return e},getRowsFromMap:(t,e)=>t.map(t=>e[t.id]),getRowsFromIds(t,e){const n=[];for(const i of t)n.push(e[i]);return n},getRowsWithParentsExpanded(t,e,n){const i=[];t:for(const s of t){for(const t of e[s]._internal.parents){if(!n[t].expanded)continue t}i.push(s)}return i},getRowsHeight(t){let e=0;for(let n of t)e+=n.height;return e},getVisibleRows(t){const n=[];let i=0,s=0;for(const o of t){if(i+o.height>e.config.scroll.top&&i<e.config.scroll.top+e._internal.height&&(o.top=s,s+=o.height,n.push(o)),i>e.config.scroll.top+e._internal.height)break;i+=o.height}return n},normalizeMouseWheelEvent(t){let e=t.deltaX||0,n=t.deltaY||0,i=t.deltaZ||0;const s=t.deltaMode,o=parseInt(getComputedStyle(t.target).getPropertyValue("line-height"));let r=1;switch(s){case 1:r=o;break;case 2:r=window.height}return{x:e*=r,y:n*=r,z:i*=r}},limitScroll(e,n){if("top"===e){const e=t.get("_internal.list.rowsHeight")-t.get("_internal.height");return n<0?n=0:n>e&&(n=e),n}{const e=t.get("_internal.chart.time.totalViewDurationPx")-t.get("_internal.chart.dimensions.width");return n<0?n=0:n>e&&(n=e),n}},time:Kt(t),getScrollBarHeight(){const t=document.createElement("div");t.style.visibility="hidden",t.style.height="100px",t.style.msOverflowStyle="scrollbar",document.body.appendChild(t);var e=t.offsetHeight;t.style.overflow="scroll";var n=document.createElement("div");n.style.height="100%",t.appendChild(n);var i=n.offsetHeight;return t.parentNode.removeChild(t),e-i+1},destroy(){e=void 0;for(const t of n)t();n=[],i.debug&&delete window.state}};return i.debug&&(window.state=t,window.api=i),i}(e);return window.state=e,e.update("",t=>({config:t.config,_internal:ce})),{state:e,app:rt(e,n).createApp(Ot,t.element)}};de.api={name:re,stateFromConfig:function(t){const e=function(t){const e=le({},Zt.actions),n=le({},t.actions),i=[Object.keys(e),Object.keys(n)].flatMap((t,e,n)=>1===e?t.filter(t=>!n[0].includes(t)):t),s={};for(const t of i)s[t]=[],void 0!==e[t]&&Array.isArray(e[t])&&(s[t]=[...e[t]]),void 0!==n[t]&&Array.isArray(n[t])&&(s[t]=[...s[t],...n[t]]);return delete t.actions,delete Zt.actions,s}(t),n={config:le({},Zt,t)};return n.config.actions=e,new oe(n,{delimeter:"."})},mergeDeep:le,date:t=>t?Xt(t):Xt(),dayjs:Xt};export default de;
//# sourceMappingURL=index.esm.js.map
