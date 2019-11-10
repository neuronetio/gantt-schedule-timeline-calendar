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
const t=new WeakMap,e=e=>(...n)=>{const s=e(...n);return t.set(s,!0),s},n=e=>"function"==typeof e&&t.has(e),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,i=(t,e,n=null,s=null)=>{for(;e!==n;){const n=e.nextSibling;t.insertBefore(e,s),e=n}},o=(t,e,n=null)=>{for(;e!==n;){const n=e.nextSibling;t.removeChild(e),e=n}},r={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,d=`\x3c!--${l}--\x3e`,u=new RegExp(`${l}|${d}`),h="$lit$";class Template{constructor(t,e){this.parts=[],this.element=e;const n=[],s=[],i=document.createTreeWalker(e.content,133,null,!1);let o=0,r=-1,a=0;const{strings:c,values:{length:d}}=t;for(;a<d;){const t=i.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:n}=e;let s=0;for(let t=0;t<n;t++)p(e[t].name,h)&&s++;for(;s-- >0;){const e=c[a],n=g.exec(e)[2],s=n.toLowerCase()+h,i=t.getAttribute(s);t.removeAttribute(s);const o=i.split(u);this.parts.push({type:"attribute",index:r,name:n,strings:o}),a+=o.length-1}}"TEMPLATE"===t.tagName&&(s.push(t),i.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(l)>=0){const s=t.parentNode,i=e.split(u),o=i.length-1;for(let e=0;e<o;e++){let n,o=i[e];if(""===o)n=f();else{const t=g.exec(o);null!==t&&p(t[2],h)&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-h.length)+t[3]),n=document.createTextNode(o)}s.insertBefore(n,t),this.parts.push({type:"node",index:++r})}""===i[o]?(s.insertBefore(f(),t),n.push(t)):t.data=i[o],a+=o}}else if(8===t.nodeType)if(t.data===l){const e=t.parentNode;null!==t.previousSibling&&r!==o||(r++,e.insertBefore(f(),t)),o=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(n.push(t),r--),a++}else{let e=-1;for(;-1!==(e=t.data.indexOf(l,e+1));)this.parts.push({type:"node",index:-1}),a++}}else i.currentNode=s.pop()}for(const t of n)t.parentNode.removeChild(t)}}const p=(t,e)=>{const n=t.length-e.length;return n>=0&&t.slice(n)===e},m=t=>-1!==t.index,f=()=>document.createComment(""),g=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
class TemplateInstance{constructor(t,e,n){this.__parts=[],this.template=t,this.processor=e,this.options=n}update(t){let e=0;for(const n of this.__parts)void 0!==n&&n.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],n=this.template.parts,i=document.createTreeWalker(t,133,null,!1);let o,r=0,a=0,l=i.nextNode();for(;r<n.length;)if(o=n[r],m(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),i.currentNode=l.content),null===(l=i.nextNode())&&(i.currentNode=e.pop(),l=i.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return s&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const v=` ${l} `;class TemplateResult{constructor(t,e,n,s){this.strings=t,this.values=e,this.type=n,this.processor=s}getHTML(){const t=this.strings.length-1;let e="",n=!1;for(let s=0;s<t;s++){const t=this.strings[s],i=t.lastIndexOf("\x3c!--");n=(i>-1||n)&&-1===t.indexOf("--\x3e",i+1);const o=g.exec(t);e+=null===o?t+(n?v:d):t.substr(0,o.index)+o[1]+o[2]+h+o[3]+l}return e+=this.strings[t]}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}class SVGTemplateResult extends TemplateResult{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),e=t.content,n=e.firstChild;return e.removeChild(n),i(e,n.firstChild),t}}
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
 */const b=t=>null===t||!("object"==typeof t||"function"==typeof t),y=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class AttributeCommitter{constructor(t,e,n){this.dirty=!0,this.element=t,this.name=e,this.strings=n,this.parts=[];for(let t=0;t<n.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new AttributePart(this)}_getValue(){const t=this.strings,e=t.length-1;let n="";for(let s=0;s<e;s++){n+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(b(t)||!y(t))n+="string"==typeof t?t:String(t);else for(const e of t)n+="string"==typeof e?e:String(e)}}return n+=t[e]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class AttributePart{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===r||b(t)&&t===this.value||(this.value=t,n(t)||(this.committer.dirty=!0))}commit(){for(;n(this.value);){const t=this.value;this.value=r,t(this)}this.value!==r&&this.committer.commit()}}class NodePart{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(f()),this.endNode=t.appendChild(f())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=f()),t.__insert(this.endNode=f())}insertAfterPart(t){t.__insert(this.startNode=f()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}const t=this.__pendingValue;t!==r&&(b(t)?t!==this.value&&this.__commitText(t):t instanceof TemplateResult?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):y(t)?this.__commitIterable(t):t===a?(this.value=a,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,n="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=n:this.__commitNode(document.createTextNode(n)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof TemplateInstance&&this.value.template===e)this.value.update(t.values);else{const n=new TemplateInstance(e,t.processor,this.options),s=n._clone();n.update(t.values),this.__commitNode(s),this.value=n}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let n,s=0;for(const i of t)void 0===(n=e[s])&&(n=new NodePart(this.options),e.push(n),0===s?n.appendIntoPart(this):n.insertAfterPart(e[s-1])),n.setValue(i),n.commit(),s++;s<e.length&&(e.length=s,this.clear(n&&n.endNode))}clear(t=this.startNode){o(this.startNode.parentNode,t.nextSibling,this.endNode)}}class BooleanAttributePart{constructor(t,e,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=n}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=r}}class PropertyCommitter extends AttributeCommitter{constructor(t,e,n){super(t,e,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new PropertyPart(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class PropertyPart extends AttributePart{}let w=!1;try{const t={get capture(){return w=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class EventPart{constructor(t,e,n){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=n,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;n(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=r,t(this)}if(this.__pendingValue===r)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=_(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=r}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const _=t=>t&&(w?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);
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
 */const $=new class DefaultTemplateProcessor{handleAttributeExpressions(t,e,n,s){const i=e[0];if("."===i){return new PropertyCommitter(t,e.slice(1),n).parts}return"@"===i?[new EventPart(t,e.slice(1),s.eventContext)]:"?"===i?[new BooleanAttributePart(t,e.slice(1),n)]:new AttributeCommitter(t,e,n).parts}handleTextExpression(t){return new NodePart(t)}};
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
 */function templateFactory(t){let e=x.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},x.set(t.type,e));let n=e.stringsArray.get(t.strings);if(void 0!==n)return n;const s=t.strings.join(l);return void 0===(n=e.keyString.get(s))&&(n=new Template(t,t.getTemplateElement()),e.keyString.set(s,n)),e.stringsArray.set(t.strings,n),n}const x=new Map,C=new WeakMap,M=(t,e,n)=>{let s=C.get(e);void 0===s&&(o(e,e.firstChild),C.set(e,s=new NodePart(Object.assign({templateFactory:templateFactory},n))),s.appendInto(e)),s.setValue(t),s.commit()};
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
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const P=(t,...e)=>new TemplateResult(t,e,"html",$),O=(t,...e)=>new SVGTemplateResult(t,e,"svg",$);
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
var T=function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,n=t[Symbol.asyncIterator];return n?n.call(t):(t="function"==typeof __values?__values(t):t[Symbol.iterator](),e={},verb("next"),verb("throw"),verb("return"),e[Symbol.asyncIterator]=function(){return this},e);function verb(n){e[n]=t[n]&&function(e){return new Promise((function(s,i){(function settle(t,e,n,s){Promise.resolve(s).then((function(e){t({value:e,done:n})}),e)})(s,i,(e=t[n](e)).done,e.value)}))}}};const A=e((t,e)=>async n=>{var s,i;if(!(n instanceof NodePart))throw new Error("asyncAppend can only be used in text bindings");if(t===n.value)return;let o;n.value=t;let r=0;try{for(var a,l=T(t);!(a=await l.next()).done;){let s=a.value;if(n.value!==t)break;0===r&&n.clear(),void 0!==e&&(s=e(s,r));let i=n.startNode;void 0!==o&&(i=f(),o.endNode=i,n.endNode.parentNode.insertBefore(i,n.endNode)),(o=new NodePart(n.options)).insertAfterNode(i),o.setValue(s),o.commit(),r++}}catch(t){s={error:t}}finally{try{a&&!a.done&&(i=l.return)&&await i.call(l)}finally{if(s)throw s.error}}});
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
 */var I=function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,n=t[Symbol.asyncIterator];return n?n.call(t):(t="function"==typeof __values?__values(t):t[Symbol.iterator](),e={},verb("next"),verb("throw"),verb("return"),e[Symbol.asyncIterator]=function(){return this},e);function verb(n){e[n]=t[n]&&function(e){return new Promise((function(s,i){(function settle(t,e,n,s){Promise.resolve(s).then((function(e){t({value:e,done:n})}),e)})(s,i,(e=t[n](e)).done,e.value)}))}}};const D=e((t,e)=>async n=>{var s,i;if(!(n instanceof NodePart))throw new Error("asyncReplace can only be used in text bindings");if(t===n.value)return;const o=new NodePart(n.options);n.value=t;let r=0;try{for(var a,l=I(t);!(a=await l.next()).done;){let s=a.value;if(n.value!==t)break;0===r&&(n.clear(),o.appendIntoPart(n)),void 0!==e&&(s=e(s,r)),o.setValue(s),o.commit(),r++}}catch(t){s={error:t}}finally{try{a&&!a.done&&(i=l.return)&&await i.call(l)}finally{if(s)throw s.error}}}),R=new WeakMap,E=e(t=>e=>{if(!(e instanceof NodePart))throw new Error("cache can only be used in text bindings");let n=R.get(e);void 0===n&&(n=new WeakMap,R.set(e,n));const s=e.value;if(s instanceof TemplateInstance){if(t instanceof TemplateResult&&s.template===e.options.templateFactory(t))return void e.setValue(t);{let t=n.get(s.template);void 0===t&&(t={instance:s,nodes:document.createDocumentFragment()},n.set(s.template,t)),i(t.nodes,e.startNode.nextSibling,e.endNode)}}if(t instanceof TemplateResult){const s=e.options.templateFactory(t),i=n.get(s);void 0!==i&&(e.setValue(i.nodes),e.commit(),e.value=i.instance)}e.setValue(t)}),S=new WeakMap,N=e(t=>e=>{if(!(e instanceof AttributePart)||e instanceof PropertyPart||"class"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const{committer:n}=e,{element:s}=n;S.has(e)||(s.className=n.strings.join(" "));const{classList:i}=s,o=S.get(e);for(const e in o)e in t||i.remove(e);for(const e in t){const n=t[e];if(!o||n!==o[e]){i[n?"add":"remove"](e)}}S.set(e,t)}),L=new WeakMap,k=e((t,e)=>n=>{const s=L.get(n);if(Array.isArray(t)){if(Array.isArray(s)&&s.length===t.length&&t.every((t,e)=>t===s[e]))return}else if(s===t&&(void 0!==t||L.has(n)))return;n.setValue(e()),L.set(n,Array.isArray(t)?Array.from(t):t)}),H=e(t=>e=>{if(void 0===t&&e instanceof AttributePart){if(t!==e.value){const t=e.committer.name;e.committer.element.removeAttribute(t)}}else e.setValue(t)}),j=(t,e)=>{const n=t.startNode.parentNode,s=void 0===e?t.endNode:e.startNode,i=n.insertBefore(f(),s);n.insertBefore(f(),s);const o=new NodePart(t.options);return o.insertAfterNode(i),o},V=(t,e)=>(t.setValue(e),t.commit(),t),z=(t,e,n)=>{const s=t.startNode.parentNode,o=n?n.startNode:t.endNode,r=e.endNode.nextSibling;r!==o&&i(s,e.startNode,r,o)},W=t=>{o(t.startNode.parentNode,t.startNode,t.endNode.nextSibling)},B=(t,e,n)=>{const s=new Map;for(let i=e;i<=n;i++)s.set(t[i],i);return s},Y=new WeakMap,G=new WeakMap,F=e((t,e,n)=>{let s;return void 0===n?n=e:void 0!==e&&(s=e),e=>{if(!(e instanceof NodePart))throw new Error("repeat can only be used in text bindings");const i=Y.get(e)||[],o=G.get(e)||[],r=[],a=[],l=[];let c,d,u=0;for(const e of t)l[u]=s?s(e,u):u,a[u]=n(e,u),u++;let h=0,p=i.length-1,m=0,f=a.length-1;for(;h<=p&&m<=f;)if(null===i[h])h++;else if(null===i[p])p--;else if(o[h]===l[m])r[m]=V(i[h],a[m]),h++,m++;else if(o[p]===l[f])r[f]=V(i[p],a[f]),p--,f--;else if(o[h]===l[f])r[f]=V(i[h],a[f]),z(e,i[h],r[f+1]),h++,f--;else if(o[p]===l[m])r[m]=V(i[p],a[m]),z(e,i[p],i[h]),p--,m++;else if(void 0===c&&(c=B(l,m,f),d=B(o,h,p)),c.has(o[h]))if(c.has(o[p])){const t=d.get(l[m]),n=void 0!==t?i[t]:null;if(null===n){const t=j(e,i[h]);V(t,a[m]),r[m]=t}else r[m]=V(n,a[m]),z(e,n,i[h]),i[t]=null;m++}else W(i[p]),p--;else W(i[h]),h++;for(;m<=f;){const t=j(e,r[f+1]);V(t,a[m]),r[m++]=t}for(;h<=p;){const t=i[h++];null!==t&&W(t)}Y.set(e,r),G.set(e,l)}}),U=new WeakMap,J=e(t=>e=>{if(!(e instanceof AttributePart)||e instanceof PropertyPart||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:n}=e,{style:s}=n.element;U.has(e)||(s.cssText=n.strings.join(" "));const i=U.get(e);for(const e in i)e in t||(-1===e.indexOf("-")?s[e]=null:s.removeProperty(e));for(const e in t)-1===e.indexOf("-")?s[e]=t[e]:s.setProperty(e,t[e]);U.set(e,t)}),q=new WeakMap,Z=e(t=>e=>{if(!(e instanceof NodePart))throw new Error("unsafeHTML can only be used in text bindings");const n=q.get(e);if(void 0!==n&&b(t)&&t===n.value&&e.value===n.fragment)return;const s=document.createElement("template");s.innerHTML=t;const i=document.importNode(s.content,!0);e.setValue(i),q.set(e,{value:t,fragment:i})}),X=new WeakMap,K=e((...t)=>e=>{let n=X.get(e);void 0===n&&(n={lastRenderedIndex:2147483647,values:[]},X.set(e,n));const s=n.values;let i=s.length;n.values=t;for(let o=0;o<t.length&&!(o>n.lastRenderedIndex);o++){const r=t[o];if(b(r)||"function"!=typeof r.then){e.setValue(r),n.lastRenderedIndex=o;break}o<i&&r===s[o]||(n.lastRenderedIndex=2147483647,i=0,Promise.resolve(r).then(t=>{const s=n.values.indexOf(r);s>-1&&s<n.lastRenderedIndex&&(n.lastRenderedIndex=s,e.setValue(t),e.commit())}))}});
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
 */function schedule(t){let e=0;return function wrapperFn(n){e||(e=requestAnimationFrame((function executeFrame(){e=0,t.apply(void 0,[n])})))}}function isObject(t){return t&&"object"==typeof t&&!Array.isArray(t)}function clone(t){if(void 0!==t.actions){const e=t.actions.map(t=>{const e=Object.assign({},t),n=Object.assign({},e.props);return delete n.state,delete n.api,delete e.element,e.props=n,e});t.actions=e}return function mergeDeep(t,...e){const n=e.shift();if(isObject(t)&&isObject(n))for(const e in n)if(isObject(n[e]))void 0===t[e]&&(t[e]={}),t[e]=mergeDeep(t[e],n[e]);else if(Array.isArray(n[e])){t[e]=[];for(let s of n[e])isObject(s)?t[e].push(mergeDeep({},s)):t[e].push(s)}else t[e]=n[e];return e.length?mergeDeep(t,...e):t}({},t)}function Vido(t,n){let s=0;const i=new Map;let o,r,a=new Map,l=0;const c=Promise.resolve();function getActions(t){return e((function actionsByInstanceDirective(e,n={}){return function partial(s){const i=s.committer.element;for(const s of e)if("function"==typeof s){let e;if(a.has(t))for(const n of a.get(t))if(n.componentAction.create===s&&n.element===i){e=n;break}if(e)e.props=n;else{void 0!==i.vido&&delete i.vido;const e={instance:t,componentAction:{create:s,update(){},destroy(){}},element:i,props:n};let o=[];a.has(t)&&(o=a.get(t)),o.push(e),a.set(t,o)}}}}))}const d={debug:!1,state:t,api:n,html:P,svg:O,directive:e,asyncAppend:A,asyncReplace:D,cache:E,classMap:N,guard:k,ifDefined:H,repeat:F,styleMap:J,unsafeHTML:Z,until:K,schedule:schedule,lastProps:{},actionsByInstance(t,e){},onDestroy(){},onChange(t){},reuseComponents(t,e,n,s){const i=[];if(t.length<e.length){let o=e.length-t.length;for(;o;){const r=e[e.length-o],a=d.createComponent(s,n(r));t.push(a),i.push(a.instance),o--}}else if(t.length>e.length){let n=t.length-e.length;for(;n;){const e=t.length-n;i.push(t[e].instance),t[e].destroy(),n--}t.length=e.length}let o=0;for(const s of t){const t=e[o];i.includes(s.instance)||s.change(n(t)),o++}return t},createComponent(t,e={}){const n=t.name+":"+s++;let o;let r=[];let l=[];o=Object.assign(Object.assign({},d),{update:function update(){d.updateTemplate(o)},onDestroy:function onDestroy(t){r.push(t)},onChange:function onChange(t){l.push(t)},instance:n,actions:getActions(n),lastProps:e});const c=function getComponentInstanceMethods(t,e,n={}){return{instance:t,vidoInstance:e,props:n,destroy:()=>(e.debug&&(console.groupCollapsed(`destroying component ${t}`),console.log(clone({components:i.keys(),actionsByInstance:a})),console.trace(),console.groupEnd()),d.destroyComponent(t,e)),update:()=>(e.debug&&(console.groupCollapsed(`updating component ${t}`),console.log(clone({components:i.keys(),actionsByInstance:a})),console.trace(),console.groupEnd()),d.updateTemplate(e)),change(s){e.debug&&(console.groupCollapsed(`changing component ${t}`),console.log(clone({props:n,newProps:s,components:i.keys(),actionsByInstance:a})),console.trace(),console.groupEnd()),i.get(t).change(s,e)},html:(n={})=>i.get(t).update(n,e)}}(n,o,e),u=t(o,e),h={instance:n,vidoInstance:o,lastProps:e,destroy(){o.debug&&(console.groupCollapsed(`component destroy method fired ${n}`),console.log(clone({props:e,components:i.keys(),destroyable:r,actionsByInstance:a})),console.trace(),console.groupEnd());for(const t of r)t();l=[],r=[]},update:(t={})=>(o.debug&&(console.groupCollapsed(`component update method fired ${n}`),console.log(clone({components:i.keys(),actionsByInstance:a})),console.trace(),console.groupEnd()),u(t)),change(t={}){e=t,o.debug&&(console.groupCollapsed(`component change method fired ${n}`),console.log(clone({props:e,components:i.keys(),onChangeFunctions:l,changedProps:t,actionsByInstance:a})),console.trace(),console.groupEnd());for(const e of l)e(t)}};return i.set(n,h),i.get(n).change(e),o.debug&&(console.groupCollapsed(`component created ${n}`),console.log(clone({props:e,components:i.keys(),actionsByInstance:a})),console.trace(),console.groupEnd()),c},destroyComponent(t,e){if(e.debug&&(console.groupCollapsed(`destroying component ${t}...`),console.log(clone({components:i.keys(),actionsByInstance:a})),console.trace(),console.groupEnd()),a.has(t))for(const e of a.get(t))"function"==typeof e.componentAction.destroy&&e.componentAction.destroy(e.element,e.props);a.delete(t),i.get(t).destroy(),i.delete(t),e.debug&&(console.groupCollapsed(`component destroyed ${t}`),console.log(clone({components:i.keys(),actionsByInstance:a})),console.trace(),console.groupEnd())},updateTemplate(t){const e=++l,n=this;c.then((function flush(){e===l&&(n.render(),l=0,t.debug&&(console.groupCollapsed("templates updated"),console.trace(),console.groupEnd()))}))},createApp(t){r=t.element;const e=this.createComponent(t.component,t.props);return o=e.instance,this.render(),e},executeActions(){for(const t of a.values()){for(const e of t)if(void 0===e.element.vido){if("function"==typeof e.componentAction.create){const t=e.componentAction.create(e.element,e.props);d.debug&&(console.groupCollapsed(`create action executed ${e.instance}`),console.log(clone({components:i.keys(),action:e,actionsByInstance:a})),console.trace(),console.groupEnd()),void 0!==t&&("function"==typeof t.update&&(e.componentAction.update=t.update),"function"==typeof t.destroy&&(e.componentAction.destroy=t.destroy))}}else e.element.vido=e.props,"function"==typeof e.componentAction.update&&(e.componentAction.update(e.element,e.props),d.debug&&(console.groupCollapsed(`update action executed ${e.instance}`),console.log(clone({components:i.keys(),action:e,actionsByInstance:a})),console.trace(),console.groupEnd()));for(const e of t)e.element.vido=e.props}},render(){M(i.get(o).update(),r),d.executeActions()}};return d}var Q=function(){if("undefined"!=typeof Map)return Map;function getIndex(t,e){var n=-1;return t.some((function(t,s){return t[0]===e&&(n=s,!0)})),n}return(function(){function class_1(){this.__entries__=[]}return Object.defineProperty(class_1.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),class_1.prototype.get=function(t){var e=getIndex(this.__entries__,t),n=this.__entries__[e];return n&&n[1]},class_1.prototype.set=function(t,e){var n=getIndex(this.__entries__,t);~n?this.__entries__[n][1]=e:this.__entries__.push([t,e])},class_1.prototype.delete=function(t){var e=this.__entries__,n=getIndex(e,t);~n&&e.splice(n,1)},class_1.prototype.has=function(t){return!!~getIndex(this.__entries__,t)},class_1.prototype.clear=function(){this.__entries__.splice(0)},class_1.prototype.forEach=function(t,e){void 0===e&&(e=null);for(var n=0,s=this.__entries__;n<s.length;n++){var i=s[n];t.call(e,i[1],i[0])}},class_1}())}(),tt="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,et="undefined"!=typeof global&&global.Math===Math?global:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),nt="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(et):function(t){return setTimeout((function(){return t(Date.now())}),1e3/60)},st=2;var it=20,ot=["top","right","bottom","left","width","height","size","weight"],rt="undefined"!=typeof MutationObserver,at=function(){function ResizeObserverController(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=function throttle(t,e){var n=!1,s=!1,i=0;function resolvePending(){n&&(n=!1,t()),s&&proxy()}function timeoutCallback(){nt(resolvePending)}function proxy(){var t=Date.now();if(n){if(t-i<st)return;s=!0}else n=!0,s=!1,setTimeout(timeoutCallback,e);i=t}return proxy}(this.refresh.bind(this),it)}return ResizeObserverController.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},ResizeObserverController.prototype.removeObserver=function(t){var e=this.observers_,n=e.indexOf(t);~n&&e.splice(n,1),!e.length&&this.connected_&&this.disconnect_()},ResizeObserverController.prototype.refresh=function(){this.updateObservers_()&&this.refresh()},ResizeObserverController.prototype.updateObservers_=function(){var t=this.observers_.filter((function(t){return t.gatherActive(),t.hasActive()}));return t.forEach((function(t){return t.broadcastActive()})),t.length>0},ResizeObserverController.prototype.connect_=function(){tt&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),rt?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},ResizeObserverController.prototype.disconnect_=function(){tt&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},ResizeObserverController.prototype.onTransitionEnd_=function(t){var e=t.propertyName,n=void 0===e?"":e;ot.some((function(t){return!!~n.indexOf(t)}))&&this.refresh()},ResizeObserverController.getInstance=function(){return this.instance_||(this.instance_=new ResizeObserverController),this.instance_},ResizeObserverController.instance_=null,ResizeObserverController}(),lt=function(t,e){for(var n=0,s=Object.keys(e);n<s.length;n++){var i=s[n];Object.defineProperty(t,i,{value:e[i],enumerable:!1,writable:!1,configurable:!0})}return t},ct=function(t){return t&&t.ownerDocument&&t.ownerDocument.defaultView||et},dt=createRectInit(0,0,0,0);function toFloat(t){return parseFloat(t)||0}function getBordersSize(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return e.reduce((function(e,n){return e+toFloat(t["border-"+n+"-width"])}),0)}function getHTMLElementContentRect(t){var e=t.clientWidth,n=t.clientHeight;if(!e&&!n)return dt;var s=ct(t).getComputedStyle(t),i=function getPaddings(t){for(var e={},n=0,s=["top","right","bottom","left"];n<s.length;n++){var i=s[n],o=t["padding-"+i];e[i]=toFloat(o)}return e}(s),o=i.left+i.right,r=i.top+i.bottom,a=toFloat(s.width),l=toFloat(s.height);if("border-box"===s.boxSizing&&(Math.round(a+o)!==e&&(a-=getBordersSize(s,"left","right")+o),Math.round(l+r)!==n&&(l-=getBordersSize(s,"top","bottom")+r)),!function isDocumentElement(t){return t===ct(t).document.documentElement}(t)){var c=Math.round(a+o)-e,d=Math.round(l+r)-n;1!==Math.abs(c)&&(a-=c),1!==Math.abs(d)&&(l-=d)}return createRectInit(i.left,i.top,a,l)}var ut="undefined"!=typeof SVGGraphicsElement?function(t){return t instanceof ct(t).SVGGraphicsElement}:function(t){return t instanceof ct(t).SVGElement&&"function"==typeof t.getBBox};function getContentRect(t){return tt?ut(t)?function getSVGContentRect(t){var e=t.getBBox();return createRectInit(0,0,e.width,e.height)}(t):getHTMLElementContentRect(t):dt}function createRectInit(t,e,n,s){return{x:t,y:e,width:n,height:s}}var ht=function(){function ResizeObservation(t){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=createRectInit(0,0,0,0),this.target=t}return ResizeObservation.prototype.isActive=function(){var t=getContentRect(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},ResizeObservation.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t},ResizeObservation}(),pt=function pt(t,e){var n=function createReadOnlyRect(t){var e=t.x,n=t.y,s=t.width,i=t.height,o="undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object,r=Object.create(o.prototype);return lt(r,{x:e,y:n,width:s,height:i,top:n,right:e+s,bottom:i+n,left:e}),r}(e);lt(this,{target:t,contentRect:n})},mt=function(){function ResizeObserverSPI(t,e,n){if(this.activeObservations_=[],this.observations_=new Q,"function"!=typeof t)throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=t,this.controller_=e,this.callbackCtx_=n}return ResizeObserverSPI.prototype.observe=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof ct(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)||(e.set(t,new ht(t)),this.controller_.addObserver(this),this.controller_.refresh())}},ResizeObserverSPI.prototype.unobserve=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof ct(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)&&(e.delete(t),e.size||this.controller_.removeObserver(this))}},ResizeObserverSPI.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},ResizeObserverSPI.prototype.gatherActive=function(){var t=this;this.clearActive(),this.observations_.forEach((function(e){e.isActive()&&t.activeObservations_.push(e)}))},ResizeObserverSPI.prototype.broadcastActive=function(){if(this.hasActive()){var t=this.callbackCtx_,e=this.activeObservations_.map((function(t){return new pt(t.target,t.broadcastRect())}));this.callback_.call(t,e,t),this.clearActive()}},ResizeObserverSPI.prototype.clearActive=function(){this.activeObservations_.splice(0)},ResizeObserverSPI.prototype.hasActive=function(){return this.activeObservations_.length>0},ResizeObserverSPI}(),ft="undefined"!=typeof WeakMap?new WeakMap:new Q,gt=function ResizeObserver(t){if(!(this instanceof ResizeObserver))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var e=at.getInstance(),n=new mt(t,e,this);ft.set(this,n)};["observe","unobserve","disconnect"].forEach((function(t){gt.prototype[t]=function(){var e;return(e=ft.get(this))[t].apply(e,arguments)}}));var vt=void 0!==et.ResizeObserver?et.ResizeObserver:gt;
/**
 * Main component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function Main(t,e={}){const{api:n,state:s,onDestroy:i,actions:o,update:r,schedule:a,createComponent:l,html:c}=t,d=n.name;let u,h;i(s.subscribe("config.components.List",t=>u=t)),i(s.subscribe("config.components.Chart",t=>h=t));const p=l(u);i(p.destroy);const m=l(h);let f;i(m.destroy),i(s.subscribe("config.plugins",e=>{if(void 0!==e&&Array.isArray(e))for(const n of e){const e=n(t);"function"==typeof e&&i(e)}})),i(s.subscribe("config.wrappers.Main",t=>f=t));const g=n.getActions("");let v,b,y,w,_,$,x=0,C=!1;i(s.subscribe("config.classNames",(function updateClassNames(t){const e=s.get("config");v=n.getClass(d,{config:e}),C&&(v+=` ${d}__list-column-header-resizer--active`),b=n.getClass("vertical-scroll",{config:e}),r()}))),i(s.subscribeAll(["config.height","config.headerHeight","_internal.scrollBarHeight"],(function heightChange(){const t=s.get("config"),e=s.get("_internal.scrollBarHeight"),n=t.height-t.headerHeight-e;s.update("_internal.height",n),y=`--height: ${t.height}px`,w=`height: ${n}px; width: ${e}px; margin-top: ${t.headerHeight}px;`,r()}))),i(s.subscribe("_internal.list.columns.resizer.active",(function resizerActiveChange(t){C=t,v=n.getClass(n.name),C&&(v+=` ${n.name}__list-column-header-resizer--active`),r()}))),i(s.subscribeAll(["config.list.rows;","config.chart.items;","config.list.rows.*.parentId","config.chart.items.*.rowId"],(function generateTree(t,e){if(s.get("_internal.flatTreeMap").length&&"subscribe"===e.type)return;const i=s.get("config.list.rows"),o=[];for(const t in i)o.push(i[t]);n.fillEmptyRowValues(o);const a=s.get("config.chart.items"),l=[];for(const t in a)l.push(a[t]);const c=n.makeTreeMap(o,l);s.update("_internal.treeMap",c),s.update("_internal.flatTreeMapById",n.getFlatTreeMapById(c)),s.update("_internal.flatTreeMap",n.flattenTreeMap(c)),r()}),{bulk:!0})),i(s.subscribeAll(["config.list.rows.*.expanded","_internal.treeMap;"],(function prepareExpanded(){const t=s.get("config.list.rows"),e=n.getRowsFromIds(n.getRowsWithParentsExpanded(s.get("_internal.flatTreeMap"),s.get("_internal.flatTreeMapById"),t),t);x=n.getRowsHeight(e),s.update("_internal.list.rowsHeight",x),s.update("_internal.list.rowsWithParentsExpanded",e),r()}),{bulk:!0})),i(s.subscribeAll(["_internal.list.rowsWithParentsExpanded","config.scroll.top"],(function generateVisibleRows(){const{visibleRows:t,compensation:e}=n.getVisibleRowsAndCompensation(s.get("_internal.list.rowsWithParentsExpanded")),i=s.get("_internal.list.visibleRows");let o=!0;if(s.update("config.scroll.compensation",-e),t.length&&(o=t.some((t,e)=>void 0===i[e]||t.id!==i[e].id)),o){s.update("_internal.list.visibleRows",t);const e=[];for(const n of t)for(const t of n._internal.items)e.push(t);s.update("_internal.chart.visibleItems",e)}r()})));let M=0;function generateAndAddPeriodDates(t,e){const s=[];let i=e.leftGlobal;const o=e.rightGlobal,r=e.timePerPixel;let a=i-n.time.date(i).startOf(t),l=a/r,c=0,d=0;for(;i<o;){const e={sub:a,subPx:l,leftGlobal:i,rightGlobal:n.time.date(i).endOf(t).valueOf(),width:0,leftPx:0,rightPx:0};e.width=(e.rightGlobal-e.leftGlobal+a)/r,d=e.width>d?e.width:d,e.leftPx=c,c+=e.width,e.rightPx=c,s.push(e),i=e.rightGlobal+1,a=0,l=0}e.maxWidth[t]=d,e.dates[t]=s}i(s.subscribe("_internal.list.visibleRows;",(function onVisibleRowsChange(){const t=s.get("config.scroll.top");_=`height: ${x}px; width: 1px`,M!==t&&$&&(M=t,$.scrollTop=t),r()}))),i(s.subscribeAll(["config.chart.time","_internal.dimensions.width","config.scroll.left","_internal.scrollBarHeight","_internal.list.width","_internal.chart.dimensions"],(function recalculateTimes(){const t=s.get("_internal.chart.dimensions.width");let e=n.mergeDeep({},s.get("config.chart.time"));const i=.01*(e=n.time.recalculateFromTo(e)).zoom;let o=s.get("config.scroll.left");if(e.timePerPixel=i+Math.pow(2,e.zoom),e.totalViewDurationMs=n.time.date(e.to).diff(e.from,"milliseconds"),e.totalViewDurationPx=e.totalViewDurationMs/e.timePerPixel,o>e.totalViewDurationPx&&(o=e.totalViewDurationPx-t),e.leftGlobal=o*e.timePerPixel+e.from,e.rightGlobal=e.leftGlobal+t*e.timePerPixel,e.leftInner=e.leftGlobal-e.from,e.rightInner=e.rightGlobal-e.from,e.leftPx=e.leftInner/e.timePerPixel,e.rightPx=e.rightInner/e.timePerPixel,Math.round(e.rightGlobal/e.timePerPixel)>Math.round(e.to/e.timePerPixel)){const t=(e.rightGlobal-e.to)/(e.rightGlobal-e.from);e.timePerPixel=e.timePerPixel-e.timePerPixel*t,e.leftGlobal=o*e.timePerPixel+e.from,e.rightGlobal=e.to,e.rightInner=e.rightGlobal-e.from,e.totalViewDurationMs=e.to-e.from,e.totalViewDurationPx=e.totalViewDurationMs/e.timePerPixel,e.rightInner=e.rightGlobal-e.from,e.rightPx=e.rightInner/e.timePerPixel,e.leftPx=e.leftInner/e.timePerPixel}generateAndAddPeriodDates("day",e),generateAndAddPeriodDates("month",e),s.update("_internal.chart.time",e),r()}),{bulk:!0})),s.update("_internal.scrollBarHeight",n.getScrollBarHeight());let P=0;const O={handleEvent:a((function handleEvent(t){const e=t.target.scrollTop;P!==e&&s.update("config.scroll",(function handleOnScroll(t){t.top=e,P=t.top;const n=s.get("_internal.elements.vertical-scroll-inner");if(n){const e=n.clientHeight;t.percent.top=t.top/e}return t}),{only:["top","percent.top"]})})),passive:!0,capture:!1};function onScrollStop(t){t.stopPropagation(),t.preventDefault()}const T={width:0,height:0};let A;function resizeAction(t){A||((A=new vt((e,n)=>{const i=t.clientWidth,o=t.clientHeight;T.width===i&&T.height===o||(T.width=i,T.height=o,s.update("_internal.dimensions",T))})).observe(t),s.update("_internal.elements.main",t))}function bindScrollElement(t){$||($=t,s.update("_internal.elements.vertical-scroll",t))}function bindScrollInnerElement(t){s.update("_internal.elements.vertical-scroll-inner",t)}return g.includes(resizeAction)||g.push(resizeAction),i(()=>{A.disconnect()}),function updateTemplate(i){return f(c`
        <div
          class=${v}
          style=${y}
          @scroll=${onScrollStop}
          @wheel=${onScrollStop}
          data-actions=${o(g,Object.assign(Object.assign({},e),{api:n,state:s}))}
        >
          ${p.html()}${m.html()}
          <div
            class=${b}
            style=${w}
            @scroll=${O}
            data-action=${o([bindScrollElement])}
          >
            <div style=${_} data-actions=${o([bindScrollInnerElement])} />
          </div>
        </div>
      `,{props:e,vido:t,templateProps:i})}}
/**
 * List component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function List(t,e={}){const{api:n,state:s,onDestroy:i,actions:o,update:r,reuseComponents:a,html:l,schedule:c}=t,d=n.getActions("list");let u,h,p,m,f;i(s.subscribe("config.wrappers.List",t=>u=t)),i(s.subscribe("config.components.ListColumn",t=>h=t)),i(s.subscribe("config.list",(function onListChange(){m=s.get("config.list"),f=m.columns.percent,r()}))),i(s.subscribe("config.classNames",()=>{p=n.getClass("list",{list:m}),r()}));let g=[];i(s.subscribe("config.list.columns.data;",(function onListColumnsDataChange(t){a(g,Object.values(t),t=>({columnId:t.id}),h),r()}))),i(()=>{g.forEach(t=>t.destroy())});let v="";i(s.subscribe("config.height",t=>{v=`height: ${t}px`,r()}));const b={handleEvent:c((function onScrollHandler(t){if(t.stopPropagation(),t.preventDefault(),"scroll"===t.type)s.update("config.scroll.top",t.target.scrollTop);else{const e=n.normalizeMouseWheelEvent(t);s.update("config.scroll.top",t=>n.limitScroll("top",t+=e.y*s.get("config.scroll.yMultiplier")))}})),passive:!1};let y;function getWidth(t){y||(y=t.clientWidth,0===f&&(y=0),s.update("_internal.list.width",y),s.update("_internal.elements.list",t))}return d.push(t=>(s.update("_internal.elements.list",t),getWidth(t),{update:getWidth})),i=>u(m.columns.percent>0?l`
            <div
              class=${p}
              data-actions=${o(d,Object.assign(Object.assign({},e),{api:n,state:s}))}
              style=${v}
              @scroll=${b}
              @wheel=${b}
            >
              ${g.map(t=>t.html())}
            </div>
          `:null,{vido:t,props:{},templateProps:i})}
/**
 * ListColumn component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ListColumn(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,createComponent:a,reuseComponents:l,html:c}=t;let d,u,h;i(s.subscribe("config.wrappers.ListColumn",t=>d=t)),i(s.subscribe("config.components.ListColumnRow",t=>u=t)),i(s.subscribe("config.components.ListColumnHeader",t=>h=t));let p,m=`config.list.columns.data.${e.columnId}`;i(s.subscribe(m,(function columnChanged(t){p=t,r()})));const f=n.getActions("list-column"),g=n.getActions("list-column-rows");let v,b,y,w,_,$,x;i(s.subscribe("config.classNames",t=>{v=n.getClass("list-column",{column:p}),b=n.getClass("list-column-rows",{column:p}),r()})),i(s.subscribeAll(["config.list.columns.percent","config.list.columns.resizer.width",`config.list.columns.data.${p.id}.width`,"_internal.chart.dimensions.width","_internal.height","config.scroll.compensation"],(function calculateStyle(){const t=s.get("config.list"),e=s.get("config.scroll.compensation");y=t.columns.data[p.id].width*t.columns.percent*.01,x=y+t.columns.resizer.width,_=`${w=`width: ${x}px;`} height: ${s.get("_internal.height")}px;`,$=`${_} transform: translate(0px, ${e}px);`}),{bulk:!0}));let C=[];i(s.subscribe("_internal.list.visibleRows;",(function visibleRowsChange(t){l(C,t,t=>({columnId:e.columnId,rowId:t.id,width:x}),u),r()}))),i((function rowsDestroy(){C.forEach(t=>t.destroy())}));const M=a(h,{columnId:e.columnId});function getRowHtml(t){return t.html()}return i(M.destroy),function updateTemplate(i){return d(c`
        <div
          class=${v}
          data-actions=${o(f,{column:p,state:s,api:n})}
          style=${w}
        >
          ${M.html()}
          <div class=${b} style=${_} data-actions=${o(g,{api:n,state:s})}>
            <div class=${b+"--scroll-compensation"} style=${$}>
              ${C.map(getRowHtml)}
            </div>
          </div>
        </div>
      `,{vido:t,props:e,templateProps:i})}}
/**
 * ListColumnHeader component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ListColumnHeader(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,createComponent:a,html:l}=t;let c;i(s.subscribe("config.wrappers.ListColumnHeader",t=>c=t));const d=n.getActions("list-column-header");let u;i(s.subscribe("config.components.ListColumnHeaderResizer",t=>u=t));const h=a(u,{columnId:e.columnId});let p;i(h.destroy),i(s.subscribe("config.components.ListExpander",t=>p=t));const m=a(p,{});let f,g,v,b;return i(m.destroy),i(s.subscribe(`config.list.columns.data.${e.columnId}`,t=>{f=t,r()})),i(s.subscribeAll(["config.classNames","config.headerHeight"],()=>{const t=s.get("config");g=n.getClass("list-column-header",{column:f}),v=n.getClass("list-column-header-content",{column:f}),b=`--height: ${t.headerHeight}px;height:${t.headerHeight}px;`,r()})),i=>c(l`
        <div class=${g} style=${b} data-actions=${o(d,{column:f,api:n,state:s})}>
          ${"boolean"==typeof f.expander&&f.expander?function withExpander(){return l`
      <div class=${v}>
        ${m.html()}${h.html(f)}
      </div>
    `}():function withoutExpander(){return l`
      <div class=${v}>
        ${h.html(f)}
      </div>
    `}()}
        </div>
      `,{vido:t,props:e,templateProps:i})}
/**
 * ListColumnHeaderResizer component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ListColumnHeaderResizer(t,e){const{api:n,state:s,onDestroy:i,update:o,html:r,actions:a}=t,l="list-column-header-resizer",c=n.getActions(l);let d,u,h,p,m,f,g,v,b;i(s.subscribe("config.wrappers.ListColumnHeaderResizer",t=>d=t)),i(s.subscribe(`config.list.columns.data.${e.columnId}`,t=>{u=t,o()}));let y=!1;i(s.subscribe("config.classNames",t=>{h=n.getClass(l,{column:u}),p=n.getClass(l+"-container",{column:u}),m=n.getClass(l+"-dots",{column:u}),f=n.getClass(l+"-dots-dot",{column:u}),g=n.getClass(l+"-line",{column:u}),o()})),i(s.subscribeAll([`config.list.columns.data.${u.id}.width`,"config.list.columns.percent","config.list.columns.resizer.width","config.list.columns.resizer.inRealTime"],(t,e)=>{const n=s.get("config.list");v=u.width*n.columns.percent*.01,b=`width: ${n.columns.resizer.width}px`,y=n.columns.resizer.inRealTime,o()}));let w=[1,2,3,4,5,6,7,8];i(s.subscribe("config.list.columns.resizer.dots",t=>{w=[];for(let e=0;e<t;e++)w.push(e);o()}));let _=!1,$=v;const x=`config.list.columns.data.${u.id}.width`;function onMouseDown(t){_=!0,s.update("_internal.list.columns.resizer.active",!0)}function onMouseMove(t){if(_){let e=s.get("config.list.columns.minWidth");"number"==typeof u.minWidth&&(e=u.minWidth),($+=t.movementX)<e&&($=e),y&&s.update(x,$)}}function onMouseUp(t){_&&(s.update("_internal.list.columns.resizer.active",!1),s.update(x,$),_=!1)}return document.body.addEventListener("mousemove",onMouseMove),i(()=>document.body.removeEventListener("mousemove",onMouseMove)),document.body.addEventListener("mouseup",onMouseUp),i(()=>document.body.removeEventListener("mouseup",onMouseUp)),i=>d(r`
        <div class=${h} data-actions=${a(c,{column:u,api:n,state:s})}>
          <div class=${p}>
            ${u.header.html?r`
                  ${u.header.html}
                `:u.header.content}
          </div>
          <div class=${m} style=${"--"+b} @mousedown=${onMouseDown}>
            ${w.map(t=>r`
                  <div class=${f} />
                `)}
          </div>
        </div>
      `,{vido:t,props:e,templateProps:i})}
/**
 * ListColumnRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ListColumnRow(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,createComponent:l,onChange:c}=t;let d,u;i(s.subscribe("config.wrappers.ListColumnRow",t=>d=t)),i(s.subscribe("config.components.ListExpander",t=>u=t));let h,p,m,f,g=`_internal.flatTreeMapById.${e.rowId}`,v=s.get(g),b=`config.list.columns.data.${e.columnId}`,y=s.get(b);c((function onPropsChange({rowId:t,columnId:n}){p&&p(),m&&m(),g=`_internal.flatTreeMapById.${t}`,b=`config.list.columns.data.${n}`,p=s.subscribe(g,t=>{h=`--height: ${(v=t).height}px; width: ${e.width}px; height:${v.height}px;`;for(let t of v._internal.parents){const e=s.get(`_internal.flatTreeMapById.${t}`);"object"==typeof e.style&&"Object"===e.style.constructor.name&&"string"==typeof e.style.children&&(h+=e.style.children)}"object"==typeof v.style&&"Object"===v.style.constructor.name&&"string"==typeof v.style.current&&(h+=v.style.current),r()}),f&&f.destroy(),f=l(u,{row:v}),m=s.subscribe(b,t=>{y=t,r()})})),i(()=>{f&&f.destroy(),m(),p()});const w=n.getActions("list-column-row");let _;return i(s.subscribe("config.classNames",t=>{_=n.getClass("list-column-row"),r()})),function updateTemplate(i){return d(a`
        <div class=${_} style=${h} data-actions=${o(w,{column:y,row:v,api:n,state:s})}>
          ${"boolean"==typeof y.expander&&y.expander?f.html():""}
          ${"string"==typeof y.html?function getHtml(){return"function"==typeof y.data?a`
        ${y.data(v)}
      `:a`
      ${v[y.data]}
    `}():function getText(){return"function"==typeof y.data?y.data(v):v[y.data]}()}
        </div>
      `,{vido:t,props:e,templateProps:i})}}
/**
 * ListExpander component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ListExpander(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,createComponent:l}=t,c=n.getActions("list-expander");let d,u,h,p,m,f=[];i(s.subscribe("config.components.ListToggle",t=>m=t));const g=l(m,e.row?{row:e.row}:{});let v;return i(g.destroy),i(s.subscribe("config.wrappers.ListExpander",t=>v=t)),i(s.subscribe("config.classNames",t=>{e.row?(d=n.getClass("list-expander",{row:e.row}),p=n.getClass("list-expander-padding",{row:e.row})):(d=n.getClass("list-expander"),p=n.getClass("list-expander-padding")),r()})),i(s.subscribeAll(["config.list.expander.padding"],t=>{u=t,r()})),e.row?i(s.subscribe(`_internal.list.rows.${e.row.id}.parentId`,t=>{h="width:"+e.row._internal.parents.length*u+"px",f=e.row._internal.children,r()})):(h="width:0px",f=[]),i=>v(a`
        <div class=${d} data-action=${o(c,{row:e.row,api:n,state:s})}>
          <div class=${p} style=${h}></div>
          ${f.length||!e.row?g.html():""}
        </div>
      `,{vido:t,props:e,templateProps:i})}
/**
 * ListToggle component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ListToggle(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,unsafeHTML:l}=t,c="list-expander-toggle";let d;i(s.subscribe("config.wrappers.ListToggle",t=>d=t));const u=n.getActions(c);let h,p,m,f,g,v,b=!1;if(i(s.subscribe("config.classNames",t=>{e.row?(h=n.getClass(c,{row:e.row}),m=n.getClass(c+"-open",{row:e.row}),f=n.getClass(c+"-closed",{row:e.row})):(h=n.getClass(c),m=n.getClass(c+"-open"),f=n.getClass(c+"-closed")),r()})),i(s.subscribeAll(["config.list.expander.size","config.list.expander.icons"],()=>{const t=s.get("config.list.expander");p=`--size: ${t.size}px`,g=t.icons.open,v=t.icons.closed,r()})),e.row){function expandedChange(t){b=t,r()}i(s.subscribe(`config.list.rows.${e.row.id}.expanded`,expandedChange))}else{function expandedChange(t){for(const e of t)if(e.value){b=!0;break}r()}i(s.subscribe("config.list.rows.*.expanded",expandedChange,{bulk:!0}))}function toggle(){b=!b,e.row?s.update(`config.list.rows.${e.row.id}.expanded`,b):s.update("config.list.rows",t=>{for(const e in t)t[e].expanded=b;return t},{only:["*.expanded"]})}return function updateTemplate(i){return d(a`
        <div
          class=${h}
          data-actions=${o(u,{row:e.row,api:n,state:s})}
          style=${p}
          @click=${toggle}
        >
          ${b?a`
                <div class=${m}>
                  ${l(g)}
                </div>
              `:a`
                <div class=${f}>
                  ${l(v)}
                </div>
              `}
        </div>
      `,{vido:t,props:e,templateProps:i})}}
/**
 * Chart component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function Chart(t,e={}){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,schedule:l,createComponent:c}=t,d=s.get("config.components.ChartCalendar"),u=s.get("config.components.ChartTimeline");let h;i(s.subscribe("config.wrappers.Chart",t=>h=t));const p=c(d);i(p.destroy);const m=c(u);i(m.destroy);let f,g,v,b,y="",w="",_=n.getActions("chart");function handleEvent(t){let e,i;if("scroll"===t.type)s.update("config.scroll.left",t.target.scrollLeft),e=t.target.scrollLeft;else{const o=n.normalizeMouseWheelEvent(t),r=s.get("config.scroll.xMultiplier"),a=s.get("config.scroll.yMultiplier");t.shiftKey&&o.y?s.update("config.scroll.left",t=>e=n.limitScroll("left",t+=o.y*r)):o.x?s.update("config.scroll.left",t=>e=n.limitScroll("left",t+=o.x*r)):s.update("config.scroll.top",t=>i=n.limitScroll("top",t+=o.y*a))}const o=s.get("_internal.elements.chart"),r=s.get("_internal.elements.horizontal-scroll-inner");if(o){const t=s.get("config.scroll.left");let e=0;t&&(e=Math.round(t/(r.clientWidth-o.clientWidth)*100))>100&&(e=100),s.update("config.scroll.percent.left",e)}}i(s.subscribe("config.classNames",t=>{f=n.getClass("chart"),g=n.getClass("horizontal-scroll"),v=n.getClass("horizontal-scroll-inner"),r()})),i(s.subscribe("config.scroll.left",t=>{b&&b.scrollLeft!==t&&(b.scrollLeft=t),r()})),i(s.subscribeAll(["_internal.chart.dimensions.width","_internal.chart.time.totalViewDurationPx"],(function horizontalScroll(t,e){y=`width: ${s.get("_internal.chart.dimensions.width")}px`,w=`width: ${s.get("_internal.chart.time.totalViewDurationPx")}px; height:1px`,r()})));const $={handleEvent:l(handleEvent),passive:!0,capture:!1},x={handleEvent:handleEvent,passive:!0,capture:!1};function bindElement(t){b||(b=t,s.update("_internal.elements.horizontal-scroll",t))}function bindInnerScroll(t){s.update("_internal.elements.horizontal-scroll-inner",t)}let C,M=0;return _.push(t=>{C||((C=new vt((e,n)=>{const i=t.clientWidth,o=t.clientHeight,r=i-s.get("_internal.scrollBarHeight");M!==i&&(M=i,s.update("_internal.chart.dimensions",{width:i,innerWidth:r,height:o}))})).observe(t),s.update("_internal.elements.chart",t))}),i(()=>{C.disconnect()}),function updateTemplate(e){return h(a`
        <div class=${f} data-actions=${o(_,{api:n,state:s})} @wheel=${x}>
          ${p.html()}${m.html()}
          <div class=${g} style=${y} data-actions=${o([bindElement])} @scroll=${$}>
            <div class=${v} style=${w} data-actions=${o([bindInnerScroll])} />
          </div>
        </div>
      `,{vido:t,props:{},templateProps:e})}}
/**
 * ChartCalendar component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ChartCalendar(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,reuseComponents:a,html:l,repeat:c}=t,d=n.getActions("chart-calendar"),u=s.get("config.components.ChartCalendarDate");let h,p;i(s.subscribe("config.wrappers.ChartCalendar",t=>h=t)),i(s.subscribe("config.classNames",t=>{p=n.getClass("chart-calendar"),r()}));let m,f,g="";i(s.subscribe("config.headerHeight",t=>{g=`height: ${m=t}px;--calendar-height: ${m}px`,r()})),i(s.subscribe("config.chart.time.period",t=>f=t));let v=[],b=[];return i(s.subscribe("_internal.chart.time.dates",t=>{const e=n.time.date().format("YYYY-MM-DD");"object"==typeof t.day&&Array.isArray(t.day)&&t.day.length&&a(v,t.day,t=>({period:"day",date:t,currentDate:e}),u),"object"==typeof t.month&&Array.isArray(t.month)&&t.month.length&&a(b,t.month,t=>({period:"month",date:t,currentDate:e}),u),r()})),i(()=>{v.forEach(t=>t.destroy())}),d.push(t=>{s.update("_internal.elements.calendar",t)}),i=>h(l`
        <div class=${p} data-actions=${o(d,Object.assign(Object.assign({},e),{api:n,state:s}))} style=${g}>
          <div class=${p+"-dates "+p+"-dates--months"}>${b.map(t=>t.html())}</div>
          <div class=${p+"-dates "+p+"-dates--days"}>${v.map(t=>t.html())}</div>
          </div>
        </div>
      `,{props:e,vido:t,templateProps:i})}
/**
 * ChartCalendarDate component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ChartCalendarDate(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,onChange:a,html:l}=t,c=n.getActions("chart-calendar-date");let d;i(s.subscribe("config.wrappers.ChartCalendarDate",t=>d=t));let u,h,p,m,f=n.getClass("chart-calendar-date",e),g="";function updateDate(){u=s.get("_internal.chart.time"),p=`width: ${e.date.width}px; margin-left:-${e.date.subPx}px;`;const t=n.time.date(e.date.leftGlobal);g=t.format("YYYY-MM-DD")===e.currentDate?" current":t.subtract(1,"days").format("YYYY-MM-DD")===e.currentDate?" next":t.add(1,"days").format("YYYY-MM-DD")===e.currentDate?" previous":"";const i=u.maxWidth[e.period];switch(e.period){case"month":h=l`
          <div
            class=${f+"-content "+f+"-content--month"+g}
            style="margin-left:${e.date.subPx+8}px;"
          >
            ${t.format("MMMM YYYY")}
          </div>
        `,i<=100&&(h=l`
            <div class=${f+"-content "+f+"-content--month"+g}>
              ${t.format("MMM'YY")}
            </div>
          `);break;case"day":if(h=l`
          <div class=${f+"-content "+f+"-content--day _0"+g}>
            <div class=${f+"-content "+f+"-content--day-small"+g}>
              ${t.format("DD")} ${t.format("ddd")}
            </div>
          </div>
        `,i>=40&&i<50&&(h=l`
            <div class=${f+"-content "+f+"-content--day _40"+g}>
              ${t.format("DD")}
            </div>
            <div class=${f+"-content "+f+"-content--day-word"+g}>
              ${t.format("dd")}
            </div>
          `),i>=50&&i<90&&(h=l`
            <div class=${f+"-content "+f+"-content--day _50"+g}>
              ${t.format("DD")}
            </div>
            <div class=${f+"-content "+f+"-content--day-word"+g}>
              ${t.format("ddd")}
            </div>
          `),i>=90&&i<180&&(h=l`
            <div class=${f+"-content "+f+"-content--day _90"+g}>
              ${t.format("DD")}
            </div>
            <div class=${f+"-content "+f+"-content--day-word"+g}>
              ${t.format("dddd")}
            </div>
          `),i>=180&&i<400){const e=[],n=t.startOf("day");for(let t=0;t<12;t++){const s=n.add(2*t,"hours"),i=(n.add(2*t+1,"hours").endOf("hour").valueOf()-s.valueOf())/u.timePerPixel;e.push({width:i,formatted:s.format("HH")})}h=l`
            <div class=${f+"-content "+f+"-content--day _180"+g}>
              ${t.format("DD dddd")}
            </div>
            <div class=${f+"-content "+f+"-content--hours"+g}>
              ${e.map(t=>l`
                    <div
                      class="${f+"-content "+f+"-content--hours-hour"+g}"
                      style="width: ${t.width}px"
                    >
                      ${t.formatted}
                    </div>
                  `)}
            </div>
          `}if(i>=400&&i<1e3){const e=[],n=t.startOf("day");for(let t=0;t<24;t++){const s=n.add(t,"hours"),i=(n.add(t,"hours").endOf("hour").valueOf()-s.valueOf())/u.timePerPixel;e.push({width:i,formatted:s.format("HH")})}h=l`
            <div class=${f+"-content "+f+"-content--day _400"+g}>
              ${t.format("DD dddd")}
            </div>
            <div class=${f+"-content "+f+"-content--hours"+g}>
              ${e.map(t=>l`
                    <div
                      class=${f+"-content "+f+"-content--hours-hour"+g}
                      style="width: ${t.width}px"
                    >
                      ${t.formatted}
                    </div>
                  `)}
            </div>
          `}const n=`overflow:hidden; text-align:left; margin-left: ${e.date.subPx+8}px;`;if(i>=1e3&&i<2e3){const e=[],s=t.startOf("day");for(let t=0;t<24;t++){const n=s.add(t,"hours"),i=(s.add(t,"hours").endOf("hour").valueOf()-n.valueOf())/u.timePerPixel;e.push({width:i,formatted:n.format("HH:mm")})}h=l`
            <div class=${f+"-content "+f+"-content--day _1000"+g} style=${n}>
              ${t.format("DD dddd")}
            </div>
            <div class=${f+"-content "+f+"-content--hours"+g}>
              ${e.map(t=>l`
                    <div
                      class=${f+"-content "+f+"-content--hours-hour"+g}
                      style="width: ${t.width}px"
                    >
                      ${t.formatted}
                    </div>
                  `)}
            </div>
          `}if(i>=2e3&&i<5e3){const e=[],s=t.startOf("day");for(let t=0;t<48;t++){const n=s.add(30*t,"minutes"),i=(s.add(30*(t+1),"minutes").valueOf()-n.valueOf())/u.timePerPixel;e.push({width:i,formatted:n.format("HH:mm")})}h=l`
            <div class=${f+"-content "+f+"-content--day _2000"+g} style=${n}>
              ${t.format("DD dddd")}
            </div>
            <div class=${f+"-content "+f+"-content--hours"+g}>
              ${e.map(t=>l`
                    <div
                      class=${f+"-content "+f+"-content--hours-hour"+g}
                      style="width: ${t.width}px"
                    >
                      ${t.formatted}
                    </div>
                  `)}
            </div>
          `}if(i>=5e3&&i<2e4){const e=[],s=t.startOf("day");for(let t=0;t<96;t++){const n=s.add(15*t,"minutes"),i=(s.add(15*(t+1),"minutes").valueOf()-n.valueOf())/u.timePerPixel;e.push({width:i,formatted:n.format("HH:mm")})}h=l`
            <div class=${f+"-content "+f+"-content--day _5000"+g} style=${n}>
              ${t.format("DD dddd")}
            </div>
            <div class=${f+"-content "+f+"-content--hours"+g}>
              ${e.map(t=>l`
                    <div
                      class=${f+"-content "+f+"-content--hours-hour"+g}
                      style="width: ${t.width}px"
                    >
                      ${t.formatted}
                    </div>
                  `)}
            </div>
          `}if(i>=2e4){const e=[],s=t.startOf("day");for(let t=0;t<288;t++){const n=s.add(5*t,"minutes"),i=(s.add(5*(t+1),"minutes").valueOf()-n.valueOf())/u.timePerPixel;e.push({width:i,formatted:n.format("HH:mm")})}h=l`
            <div class=${f+"-content "+f+"-content--day _20000"+g} style=${n}>
              ${t.format("DD dddd")}
            </div>
            <div class=${f+"-content "+f+"-content--hours"+g}>
              ${e.map(t=>l`
                    <div
                      class=${f+"-content "+f+"-content--hours-hour"+g}
                      style="width: ${t.width}px"
                    >
                      ${t.formatted}
                    </div>
                  `)}
            </div>
          `}}r()}return g=n.time.date(e.date.leftGlobal).format("YYYY-MM-DD")===e.currentDate?" current":"",a(t=>{e=t,m&&m(),m=s.subscribeAll(["_internal.chart.time","config.chart.calendar.vertical.smallFormat"],updateDate,{bulk:!0})}),i(()=>{m()}),i=>d(l`
        <div
          class=${f+" "+f+"--"+e.period+g}
          style=${p}
          data-actions=${o(c,{date:e.date,period:e.period,api:n,state:s})}
        >
          ${h}
        </div>
      `,{props:e,vido:t,templateProps:i})}
/**
 * ChartTimeline component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ChartTimeline(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,createComponent:l}=t,c=n.getActions("chart-timeline");let d;i(s.subscribe("config.wrappers.ChartTimeline",t=>d=t));const u=s.get("config.components.ChartTimelineGrid"),h=s.get("config.components.ChartTimelineItems"),p=l(u);i(p.destroy);const m=l(h);let f,g;i(m.destroy),i(s.subscribe("config.classNames",()=>{f=n.getClass("chart-timeline"),g=n.getClass("chart-timeline-inner"),r()}));let v="",b="";return i(s.subscribeAll(["_internal.height","_internal.chart.dimensions.width","_internal.list.rowsHeight","config.scroll.compensation"],(function calculateStyle(){const t=s.get("config.scroll.compensation"),e=s.get("_internal.chart.dimensions.width"),n=s.get("_internal.list.rowsHeight"),i=e?`width: ${e}px;`:"";v=`height: ${s.get("_internal.height")}px; ${i}`,b=`height: ${n}px; ${i} transform: translate(0px, ${t}px);`,r()}))),c.push(t=>{s.update("_internal.elements.chart-timeline",t)}),i=>d(a`
        <div
          class=${f}
          style=${v}
          data-actions=${o(c,Object.assign(Object.assign({},e),{api:n,state:s}))}
          @wheel=${n.onScroll}
        >
          <div class=${g} style=${b}>
            ${p.html()}${m.html()}
          </div>
        </div>
      `,{props:e,vido:t,templateProps:i})}
/**
 * ChartTimelineGrid component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ChartTimelineGrid(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,reuseComponents:l}=t,c=n.getActions("chart-timeline-grid");let d;i(s.subscribe("config.wrappers.ChartTimelineGrid",t=>d=t));const u=s.get("config.components.ChartTimelineGridRow");let h,p,m,f,g;i(s.subscribe("config.classNames",()=>{h=n.getClass("chart-timeline-grid"),r()})),i(s.subscribeAll(["_internal.height","_internal.chart.dimensions.width"],(function widthHeightChange(){m=s.get("_internal.chart.dimensions.width");const t=s.get("_internal.height");p=`height: ${t}px; width: ${m}px;`,r()}))),i(s.subscribe("config.chart.time.period",t=>f=t)),i(s.subscribe("config.chart.grid.block.onCreate",t=>g=t));let v=[];const b=[];return i(s.subscribeAll(["_internal.list.visibleRows;",`_internal.chart.time.dates.${f};`],(function generateBlocks(){const t=s.get("_internal.list.visibleRows"),e=s.get(`_internal.chart.time.dates.${f}`);if(!e||0===e.length)return;let i=0;b.length=0;for(const s of t){const t=[];for(const o of e){let e={id:s.id+":"+n.time.date(o.leftGlobal).format("YYYY-MM-DD"),time:o,row:s,top:i};for(const t of g)e=t(e);t.push(e)}b.push({row:s,blocks:t,top:i,width:m}),i+=s.height}s.update("_internal.chart.grid.rowsWithBlocks",b)}),{bulk:!0})),i(s.subscribe("_internal.chart.grid.rowsWithBlocks",(function generateRowsComponents(t){t&&(l(v,t,t=>t,u),r())}))),c.includes((function bindElement(t){s.update("_internal.elements.chart-timeline-grid",t)}))||c.push(),i(()=>{v.forEach(t=>t.destroy())}),function updateTemplate(i){return d(a`
        <div class=${h} data-actions=${o(c,{api:n,state:s})} style=${p}>
          ${v.map(t=>t.html())}
        </div>
      `,{props:e,vido:t,templateProps:i})}}
/**
 * ChartTimelineGridRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function bindElementAction(t,e){return e.state.update("_internal.elements.chart-timeline-grid-rows",(function updateGridRows(e){return void 0===e&&(e=[]),e.push(t),e}),{only:null}),{update(){},destroy(t){e.state.update("_internal.elements.chart-timeline-grid-rows",e=>e.filter(e=>e!==t))}}}function ChartTimelineGridRow(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,reuseComponents:l,onChange:c}=t;let d;i(s.subscribe("config.wrappers.ChartTimelineGridRow",t=>{d=t,r()}));const u=s.get("config.components.ChartTimelineGridRowBlock"),h=n.getActions("chart-timeline-grid-row");let p,m=n.getClass("chart-timeline-grid-row"),f=[];return c((function onPropsChange(t){l(f,(e=t).blocks,t=>t,u),p=`height: ${e.row.height}px; width: ${e.width}px;`,r()})),i((function rowDestroy(){f.forEach(t=>t.destroy())})),-1===h.indexOf(bindElementAction)&&h.push(bindElementAction),function updateTemplate(i){return d(a`
        <div
          class=${m}
          data-actions=${o(h,{row:e.row,blocks:e.blocks,top:e.top,api:n,state:s})}
          style=${p}
        >
          ${f.map(t=>t.html())}
        </div>
      `,{vido:t,props:e,templateProps:i})}}
/**
 * ChartTimelineGridRowBlock component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function bindElementAction$1(t,e){return e.state.update("_internal.elements.chart-timeline-grid-row-blocks",e=>(void 0===e&&(e=[]),e.push(t),e),{only:null}),{update(){},destroy(t){e.state.update("_internal.elements.chart-timeline-grid-row-blocks",e=>e.filter(e=>e!==t))}}}function ChartTimelineGridRowBlock(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,onChange:l}=t,c="chart-timeline-grid-row-block",d=n.getActions(c);let u;i(s.subscribe("config.wrappers.ChartTimelineGridRowBlock",t=>{u=t,r()}));const h=n.time.date().startOf("day").valueOf();let p,m;function updateClassName(t){p=n.getClass(c),m=p+"-content",t.leftGlobal===h&&(p+=" current")}updateClassName(e.time);let f=`width: ${e.time.width}px;height: ${e.row.height}px;`;return l((function onPropsChange(t){updateClassName((e=t).time),f=`width: ${e.time.width}px; height: ${e.row.height}px;`;const n=s.get("config.list.rows");for(const t of e.row._internal.parents){const e=n[t];"object"==typeof e.style&&"object"==typeof e.style.gridBlock&&"string"==typeof e.style.gridBlock.children&&(f+=e.style.gridBlock.children)}"object"==typeof e.row.style&&"object"==typeof e.row.style.gridBlock&&"string"==typeof e.row.style.gridBlock.current&&(f+=e.row.style.gridBlock.current),r()})),-1===d.indexOf(bindElementAction$1)&&d.push(bindElementAction$1),()=>u(a`
        <div class=${p} data-actions=${o(d,Object.assign(Object.assign({},e),{api:n,state:s}))} style=${f}>
          <div class=${m} />
        </div>
      `,{props:e,vido:t,templateProps:e})}
/**
 * ChartTimelineItems component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function ChartTimelineItems(t,e={}){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,reuseComponents:l}=t,c=n.getActions("chart-timeline-items");let d;i(s.subscribe("config.wrappers.ChartTimelineItems",t=>d=t));const u=s.get("config.components.ChartTimelineItemsRow");let h,p;i(s.subscribe("config.classNames",()=>{h=n.getClass("chart-timeline-items"),r()})),i(s.subscribeAll(["_internal.height","_internal.chart.dimensions.width"],(function calculateStyle(){const t=s.get("_internal.chart.dimensions.width"),e=s.get("_internal.height");p=`width: ${t}px; height: ${e}px;`})));let m=[];return i(s.subscribeAll(["_internal.list.visibleRows","config.chart.items","config.list.rows"],(function createRowComponents(){const t=s.get("_internal.list.visibleRows");m=l(m,t,t=>({row:t}),u),r()}),{bulk:!0})),i((function destroyRows(){m.forEach(t=>t.destroy())})),i=>d(a`
        <div class=${h} style=${p} data-actions=${o(c,{api:n,state:s})}>
          ${m.map(t=>t.html())}
        </div>
      `,{props:e,vido:t,templateProps:i})}
/**
 * ChartTimelineItemsRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function bindElementAction$2(t,e){return e.state.update("_internal.elements.chart-timeline-items-rows",e=>(void 0===e&&(e=[]),e.push(t),e),{only:null}),{update(){},destroy(t){e.state.update("_internal.elements.chart-timeline-items-rows",e=>e.filter(e=>e!==t))}}}function ChartTimelineItemsRow(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,onChange:l,reuseComponents:c}=t;let d;i(s.subscribe("config.wrappers.ChartTimelineItemsRow",t=>d=t));const u=s.get("config.components.ChartTimelineItemsRowItem");let h,p,m,f,g=`_internal.flatTreeMapById.${e.row.id}._internal.items`,v=[];function updateDom(){const t=s.get("_internal.chart");m=`width:${t.dimensions.width}px; height:${e.row.height}px; --row-height:${e.row.height}px;`,f=`width: ${t.time.totalViewDurationPx}px; height: ${e.row.height}px;`}l((function onPropsChange(t){(function updateRow(t){g=`_internal.flatTreeMapById.${t.id}._internal.items`,"function"==typeof h&&h(),"function"==typeof p&&p(),h=s.subscribe("_internal.chart",(t,e)=>{updateDom(),r()}),p=s.subscribe(g,e=>{v=c(v,e,e=>({row:t,item:e}),u),updateDom(),r()})})((e=t).row)})),i(()=>{p(),h(),v.forEach(t=>t.destroy())});const b=n.getActions("chart-timeline-items-row");let y,w;return i(s.subscribe("config.classNames",()=>{y=n.getClass("chart-timeline-items-row",e),w=n.getClass("chart-timeline-items-row-inner",e),r()})),-1===b.indexOf(bindElementAction$2)&&b.push(bindElementAction$2),function updateTemplate(i){return d(a`
        <div class=${y} data-actions=${o(b,Object.assign(Object.assign({},e),{api:n,state:s}))} style=${m}>
          <div class=${w} style=${f}>
            ${v.map(t=>t.html())}
          </div>
        </div>
      `,{props:e,vido:t,templateProps:i})}}
/**
 * ChartTimelineItemsRowItem component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */function bindElementAction$3(t,e){return e.state.update("_internal.elements.chart-timeline-items-row-items",(function updateRowItems(e){return void 0===e&&(e=[]),e.push(t),e}),{only:null}),{update(){},destroy(t){e.state.update("_internal.elements.chart-timeline-items-row-items",e=>e.filter(e=>e!==t))}}}function ChartTimelineItemsRowItem(t,e){const{api:n,state:s,onDestroy:i,actions:o,update:r,html:a,onChange:l}=t;let c;i(s.subscribe("config.wrappers.ChartTimelineItemsRowItem",t=>c=t));let d,u,h=0,p=0;function updateItem(){u="";let t=s.get("_internal.chart.time");h=(e.item.time.start-t.leftGlobal)/t.timePerPixel,p=(e.item.time.end-e.item.time.start)/t.timePerPixel,p-=s.get("config.chart.spacing")||0,d=`transform: translate(${h}px, 0px); width:${p}px; `,"object"==typeof e.item.style&&"Object"===e.item.style.constructor.name&&"string"==typeof e.item.style.current&&(u+=e.item.style.current),r()}l(t=>{e=t,updateItem()});const m="chart-timeline-items-row-item",f=n.getActions(m);let g,v,b;return i(s.subscribe("config.classNames",()=>{g=n.getClass(m,e),v=n.getClass(m+"-content",e),b=n.getClass(m+"-content-label",e),r()})),i(s.subscribe("_internal.chart.time",t=>{updateItem()})),-1===f.indexOf(bindElementAction$3)&&f.push(bindElementAction$3),function updateTemplate(i){return c(a`
        <div
          class=${g}
          data-actions=${o(f,{item:e.item,row:e.row,left:h,width:p,api:n,state:s})}
          style=${d}
        >
          <div class=${v} style=${u}>
            <div class=${b}>${e.item.label}</div>
          </div>
        </div>
      `,{vido:t,props:e,templateProps:i})}}
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */const bt=["","list","list-column","list-column-header","list-expander","list-expander-toggle","list-column-header-resizer","list-column-row","chart","chart-calendar","chart-calendar-date","chart-timeline","chart-timeline-grid","chart-timeline-grid-row","chart-timeline-grid-row-block","chart-timeline-items","chart-timeline-items-row","chart-timeline-items-row-item"];function defaultConfig(){return{plugins:[],plugin:{},height:740,headerHeight:86,components:{Main:Main,List:List,ListColumn:ListColumn,ListColumnHeader:ListColumnHeader,ListColumnHeaderResizer:ListColumnHeaderResizer,ListColumnRow:ListColumnRow,ListExpander:ListExpander,ListToggle:ListToggle,Chart:Chart,ChartCalendar:ChartCalendar,ChartCalendarDate:ChartCalendarDate,ChartTimeline:ChartTimeline,ChartTimelineGrid:ChartTimelineGrid,ChartTimelineGridRow:ChartTimelineGridRow,ChartTimelineGridRowBlock:ChartTimelineGridRowBlock,ChartTimelineItems:ChartTimelineItems,ChartTimelineItemsRow:ChartTimelineItemsRow,ChartTimelineItemsRowItem:ChartTimelineItemsRowItem},wrappers:{Main:t=>t,List:t=>t,ListColumn:t=>t,ListColumnHeader:t=>t,ListColumnHeaderResizer:t=>t,ListColumnRow:t=>t,ListExpander:t=>t,ListToggle:t=>t,Chart:t=>t,ChartCalendar:t=>t,ChartCalendarDate:t=>t,ChartTimeline:t=>t,ChartTimelineGrid:t=>t,ChartTimelineGridRow:t=>t,ChartTimelineGridRowBlock:t=>t,ChartTimelineItems:t=>t,ChartTimelineItemsRow:t=>t,ChartTimelineItemsRowItem:t=>t},list:{rows:{},rowHeight:40,columns:{percent:100,resizer:{width:10,inRealTime:!0,dots:6},minWidth:50,data:{}},expander:{padding:20,size:20,icons:{open:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',closed:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'}}},scroll:{top:0,left:0,xMultiplier:1.5,yMultiplier:1,percent:{top:0,left:0}},chart:{time:{from:0,to:0,zoom:21,period:"day",dates:{},maxWidth:{}},calendar:{vertical:{smallFormat:"YYYY-MM-DD"}},grid:{block:{onCreate:[]}},items:{},spacing:1},classNames:{},actions:function generateEmptyActions(){const t={};return bt.forEach(e=>t[e]=[]),t}(),locale:{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekStart:1,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},ordinal:t=>{const e=["th","st","nd","rd"],n=t%100;return`[${t}${e[(n-20)%10]||e[n]||e[0]}]`}}}}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var yt=function createCommonjsModule(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t,e){t.exports=function(){var t="millisecond",e="second",n="minute",s="hour",i="day",o="week",r="month",a="quarter",l="year",d=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,u=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,h=function(t,e,n){var s=String(t);return!s||s.length>=e?t:""+Array(e+1-s.length).join(n)+t},p={s:h,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),s=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+h(s,2,"0")+":"+h(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),s=t.clone().add(n,r),i=e-s<0,o=t.clone().add(n+(i?-1:1),r);return Number(-(n+(e-s)/(i?s-o:o-s))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(c){return{M:r,y:l,w:o,d:i,h:s,m:n,s:e,ms:t,Q:a}[c]||String(c||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},m={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},f="en",g={};g[f]=m;var v=function(t){return t instanceof _},b=function(t,e,n){var s;if(!t)return f;if("string"==typeof t)g[t]&&(s=t),e&&(g[t]=e,s=t);else{var i=t.name;g[i]=t,s=i}return n||(f=s),s},y=function(t,e,n){if(v(t))return t.clone();var s=e?"string"==typeof e?{format:e,pl:n}:e:{};return s.date=t,new _(s)},w=p;w.l=b,w.i=v,w.w=function(t,e){return y(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var _=function(){function c(t){this.$L=this.$L||b(t.locale,null,!0),this.parse(t)}var h=c.prototype;return h.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(w.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var s=e.match(d);if(s)return n?new Date(Date.UTC(s[1],s[2]-1,s[3]||1,s[4]||0,s[5]||0,s[6]||0,s[7]||0)):new Date(s[1],s[2]-1,s[3]||1,s[4]||0,s[5]||0,s[6]||0,s[7]||0)}return new Date(e)}(t),this.init()},h.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},h.$utils=function(){return w},h.isValid=function(){return!("Invalid Date"===this.$d.toString())},h.isSame=function(t,e){var n=y(t);return this.startOf(e)<=n&&n<=this.endOf(e)},h.isAfter=function(t,e){return y(t)<this.startOf(e)},h.isBefore=function(t,e){return this.endOf(e)<y(t)},h.$g=function(t,e,n){return w.u(t)?this[e]:this.set(n,t)},h.year=function(t){return this.$g(t,"$y",l)},h.month=function(t){return this.$g(t,"$M",r)},h.day=function(t){return this.$g(t,"$W",i)},h.date=function(t){return this.$g(t,"$D","date")},h.hour=function(t){return this.$g(t,"$H",s)},h.minute=function(t){return this.$g(t,"$m",n)},h.second=function(t){return this.$g(t,"$s",e)},h.millisecond=function(e){return this.$g(e,"$ms",t)},h.unix=function(){return Math.floor(this.valueOf()/1e3)},h.valueOf=function(){return this.$d.getTime()},h.startOf=function(t,a){var c=this,d=!!w.u(a)||a,u=w.p(t),h=function(t,e){var n=w.w(c.$u?Date.UTC(c.$y,e,t):new Date(c.$y,e,t),c);return d?n:n.endOf(i)},p=function(t,e){return w.w(c.toDate()[t].apply(c.toDate(),(d?[0,0,0,0]:[23,59,59,999]).slice(e)),c)},m=this.$W,f=this.$M,g=this.$D,v="set"+(this.$u?"UTC":"");switch(u){case l:return d?h(1,0):h(31,11);case r:return d?h(1,f):h(0,f+1);case o:var b=this.$locale().weekStart||0,y=(m<b?m+7:m)-b;return h(d?g-y:g+(6-y),f);case i:case"date":return p(v+"Hours",0);case s:return p(v+"Minutes",1);case n:return p(v+"Seconds",2);case e:return p(v+"Milliseconds",3);default:return this.clone()}},h.endOf=function(t){return this.startOf(t,!1)},h.$set=function(o,a){var c,d=w.p(o),u="set"+(this.$u?"UTC":""),h=(c={},c[i]=u+"Date",c.date=u+"Date",c[r]=u+"Month",c[l]=u+"FullYear",c[s]=u+"Hours",c[n]=u+"Minutes",c[e]=u+"Seconds",c[t]=u+"Milliseconds",c)[d],p=d===i?this.$D+(a-this.$W):a;if(d===r||d===l){var m=this.clone().set("date",1);m.$d[h](p),m.init(),this.$d=m.set("date",Math.min(this.$D,m.daysInMonth())).toDate()}else h&&this.$d[h](p);return this.init(),this},h.set=function(t,e){return this.clone().$set(t,e)},h.get=function(t){return this[w.p(t)]()},h.add=function(t,a){var c,d=this;t=Number(t);var u=w.p(a),h=function(e){var n=y(d);return w.w(n.date(n.date()+Math.round(e*t)),d)};if(u===r)return this.set(r,this.$M+t);if(u===l)return this.set(l,this.$y+t);if(u===i)return h(1);if(u===o)return h(7);var p=(c={},c[n]=6e4,c[s]=36e5,c[e]=1e3,c)[u]||1,m=this.$d.getTime()+t*p;return w.w(m,this)},h.subtract=function(t,e){return this.add(-1*t,e)},h.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",s=w.z(this),i=this.$locale(),o=this.$H,r=this.$m,a=this.$M,l=i.weekdays,c=i.months,d=function(t,s,i,o){return t&&(t[s]||t(e,n))||i[s].substr(0,o)},h=function(t){return w.s(o%12||12,t,"0")},p=i.meridiem||function(t,e,n){var s=t<12?"AM":"PM";return n?s.toLowerCase():s},m={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:w.s(a+1,2,"0"),MMM:d(i.monthsShort,a,c,3),MMMM:c[a]||c(this,n),D:this.$D,DD:w.s(this.$D,2,"0"),d:String(this.$W),dd:d(i.weekdaysMin,this.$W,l,2),ddd:d(i.weekdaysShort,this.$W,l,3),dddd:l[this.$W],H:String(o),HH:w.s(o,2,"0"),h:h(1),hh:h(2),a:p(o,r,!0),A:p(o,r,!1),m:String(r),mm:w.s(r,2,"0"),s:String(this.$s),ss:w.s(this.$s,2,"0"),SSS:w.s(this.$ms,3,"0"),Z:s};return n.replace(u,(function(t,e){return e||m[t]||s.replace(":","")}))},h.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},h.diff=function(t,c,d){var u,h=w.p(c),p=y(t),m=6e4*(p.utcOffset()-this.utcOffset()),f=this-p,g=w.m(this,p);return g=(u={},u[l]=g/12,u[r]=g,u[a]=g/3,u[o]=(f-m)/6048e5,u[i]=(f-m)/864e5,u[s]=f/36e5,u[n]=f/6e4,u[e]=f/1e3,u)[h]||f,d?g:w.a(g)},h.daysInMonth=function(){return this.endOf(r).$D},h.$locale=function(){return g[this.$L]},h.locale=function(t,e){if(!t)return this.$L;var n=this.clone();return n.$L=b(t,e,!0),n},h.clone=function(){return w.w(this.$d,this)},h.toDate=function(){return new Date(this.valueOf())},h.toJSON=function(){return this.isValid()?this.toISOString():null},h.toISOString=function(){return this.$d.toISOString()},h.toString=function(){return this.$d.toUTCString()},c}();return y.prototype=_.prototype,y.extend=function(t,e){return t(e,_,y),y},y.locale=b,y.isDayjs=v,y.unix=function(t){return y(1e3*t)},y.en=g[f],y.Ls=g,y}()}));
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */function timeApi(t,e){const n=t.get("config.locale");return yt.locale(n,null,!0),{date:t=>t?yt(t).locale(n.name):yt().locale(n.name),recalculateFromTo(e){0!==(e={...e}).from&&(e.from=this.date(e.from).startOf("day").valueOf()),0!==e.to&&(e.to=this.date(e.to).endOf("day").valueOf());let n=Number.MAX_SAFE_INTEGER,s=0;const i=t.get("config.chart.items");if(0===Object.keys(i).length)return e;if(0===e.from||0===e.to){for(let t in i){const e=i[t];n>e.time.start&&(n=e.time.start),s<e.time.end&&(s=e.time.end)}0===e.from&&(e.from=this.date(n).startOf("day").valueOf()),0===e.to&&(e.to=this.date(s).endOf("day").valueOf())}return e}}}class Matcher{constructor(t,e="*"){this.wchar=e,this.pattern=t,this.segments=[],this.starCount=0,this.minLength=0,this.maxLength=0,this.segStartIndex=0;for(let n=0,s=t.length;n<s;n+=1){const s=t[n];s===e&&(this.starCount+=1,n>this.segStartIndex&&this.segments.push(t.substring(this.segStartIndex,n)),this.segments.push(s),this.segStartIndex=n+1)}this.segStartIndex<t.length&&this.segments.push(t.substring(this.segStartIndex)),this.starCount?(this.minLength=t.length-this.starCount,this.maxLength=1/0):this.maxLength=this.minLength=t.length}match(t){if(this.pattern===this.wchar)return!0;if(0===this.segments.length)return this.pattern===t;const{length:e}=t;if(e<this.minLength||e>this.maxLength)return!1;let n=this.segments.length-1,s=t.length-1,i=!1;for(;;){const e=this.segments[n];if(n-=1,e===this.wchar)i=!0;else{const n=s+1-e.length,o=t.lastIndexOf(e,n);if(-1===o||o>n)return!1;if(i)s=o-1,i=!1;else{if(o!==n)return!1;s-=e.length}}if(0>n)break}return!0}}class WildcardObject{constructor(t,e,n){this.obj=t,this.delimeter=e,this.wildcard=n}simpleMatch(t,e){if(t===e)return!0;if(t===this.wildcard)return!0;const n=t.indexOf(this.wildcard);if(n>-1){const s=t.substr(n+1);if(0===n||e.substring(0,n)===t.substring(0,n)){const t=s.length;return!(t>0)||e.substr(-t)===s}}return!1}match(t,e){return t===e||t===this.wildcard||e===this.wildcard||this.simpleMatch(t,e)||new Matcher(t).match(e)}handleArray(t,e,n,s,i={}){let o=t.indexOf(this.delimeter,n),r=!1;-1===o&&(r=!0,o=t.length);const a=t.substring(n,o);let l=0;for(const n of e){const e=l.toString(),c=""===s?e:s+this.delimeter+l;(a===this.wildcard||a===e||this.simpleMatch(a,e))&&(r?i[c]=n:this.goFurther(t,n,o+1,c,i)),l++}return i}handleObject(t,e,n,s,i={}){let o=t.indexOf(this.delimeter,n),r=!1;-1===o&&(r=!0,o=t.length);const a=t.substring(n,o);for(let n in e){n=n.toString();const l=""===s?n:s+this.delimeter+n;(a===this.wildcard||a===n||this.simpleMatch(a,n))&&(r?i[l]=e[n]:this.goFurther(t,e[n],o+1,l,i))}return i}goFurther(t,e,n,s,i={}){return Array.isArray(e)?this.handleArray(t,e,n,s,i):this.handleObject(t,e,n,s,i)}get(t){return this.goFurther(t,this.obj,0,"")}}class ObjectPath{static get(t,e,n=null){if(null===n&&(n=t.slice()),0===n.length||void 0===e)return e;const s=n.shift();return e.hasOwnProperty(s)?0===n.length?e[s]:ObjectPath.get(t,e[s],n):void 0}static set(t,e,n,s=null){if(null===s&&(s=t.slice()),0===s.length){for(const t in n)delete n[t];for(const t in e)n[t]=e[t];return}const i=s.shift();0!==s.length?(n.hasOwnProperty(i)||(n[i]={}),ObjectPath.set(t,e,n[i],s)):n[i]=e}}const wt={delimeter:".",notRecursive:";",param:":",wildcard:"*",log:function log(t,e){console.debug(t,e)}},_t={bulk:!1,debug:!1,source:"",data:void 0},$t={only:[],source:"",debug:!1,data:void 0};class DeepState{constructor(t={},e=wt){this.listeners=new Map,this.data=t,this.options=Object.assign(Object.assign({},wt),e),this.id=0,this.pathGet=ObjectPath.get,this.pathSet=ObjectPath.set,this.scan=new WildcardObject(this.data,this.options.delimeter,this.options.wildcard)}getListeners(){return this.listeners}destroy(){this.data=void 0,this.listeners=new Map}match(t,e){return t===e||(t===this.options.wildcard||e===this.options.wildcard||this.scan.match(t,e))}getIndicesOf(t,e){const n=t.length;if(0==n)return[];let s,i=0,o=[];for(;(s=e.indexOf(t,i))>-1;)o.push(s),i=s+n;return o}getIndicesCount(t,e){const n=t.length;if(0==n)return 0;let s,i=0,o=0;for(;(s=e.indexOf(t,i))>-1;)o++,i=s+n;return o}cutPath(t,e){t=this.cleanNotRecursivePath(t),e=this.cleanNotRecursivePath(e);const n=this.getIndicesCount(this.options.delimeter,e),s=this.getIndicesOf(this.options.delimeter,t);return t.substr(0,s[n])}trimPath(t){return(t=this.cleanNotRecursivePath(t)).charAt(0)===this.options.delimeter?t.substr(1):t}split(t){return""===t?[]:t.split(this.options.delimeter)}isWildcard(t){return t.includes(this.options.wildcard)}isNotRecursive(t){return t.endsWith(this.options.notRecursive)}cleanNotRecursivePath(t){return this.isNotRecursive(t)?t.substring(0,t.length-1):t}hasParams(t){return t.includes(this.options.param)}getParamsInfo(t){let e={replaced:"",original:t,params:{}},n=0,s=[];for(const i of this.split(t)){e.params[n]={original:i,replaced:"",name:""};const t=new RegExp(`\\${this.options.param}([^\\${this.options.delimeter}\\${this.options.param}]+)`,"g");let o=t.exec(i);o?(e.params[n].name=o[1],t.lastIndex=0,e.params[n].replaced=i.replace(t,this.options.wildcard),s.push(e.params[n].replaced),n++):(delete e.params[n],s.push(i),n++)}return e.replaced=s.join(this.options.delimeter),e}getParams(t,e){if(!t)return;const n=this.split(e),s={};for(const e in t.params){s[t.params[e].name]=n[e]}return s}subscribeAll(t,e,n=_t){let s=[];for(const i of t)s.push(this.subscribe(i,e,n));return()=>{for(const t of s)t();s=[]}}getCleanListenersCollection(t={}){return Object.assign({listeners:{},isRecursive:!1,isWildcard:!1,hasParams:!1,match:void 0,paramsInfo:void 0,path:void 0,count:0},t)}getCleanListener(t,e=_t){return{fn:t,options:Object.assign(Object.assign({},_t),e)}}getListenerCollectionMatch(t,e,n){t=this.cleanNotRecursivePath(t);const s=this;return function listenerCollectionMatch(i){return e&&(i=s.cutPath(i,t)),!(!n||!s.match(t,i))||t===i}}getListenersCollection(t,e){if(this.listeners.has(t)){let n=this.listeners.get(t);return this.id++,n.listeners[this.id]=e,n}let n={isRecursive:!0,isWildcard:!1,hasParams:!1,paramsInfo:void 0,originalPath:t,path:t};this.hasParams(n.path)&&(n.paramsInfo=this.getParamsInfo(n.path),n.path=n.paramsInfo.replaced,n.hasParams=!0),n.isWildcard=this.isWildcard(n.path),this.isNotRecursive(n.path)&&(n.isRecursive=!1);let s=this.getCleanListenersCollection(Object.assign(Object.assign({},n),{match:this.getListenerCollectionMatch(n.path,n.isRecursive,n.isWildcard)}));return this.id++,s.listeners[this.id]=e,this.listeners.set(n.path,s),s}subscribe(t,e,n=_t,s="subscribe"){let i=this.getCleanListener(e,n);const o=this.getListenersCollection(t,i);if(o.count++,t=o.path,o.isWildcard){const r=this.scan.get(this.cleanNotRecursivePath(t));if(n.bulk){const a=[];for(const t in r)a.push({path:t,params:this.getParams(o.paramsInfo,t),value:r[t]});e(a,{type:s,listener:i,listenersCollection:o,path:{listener:t,update:void 0,resolved:void 0},options:n,params:void 0})}else for(const a in r)e(r[a],{type:s,listener:i,listenersCollection:o,path:{listener:t,update:void 0,resolved:this.cleanNotRecursivePath(a)},params:this.getParams(o.paramsInfo,a),options:n})}else e(this.pathGet(this.split(this.cleanNotRecursivePath(t)),this.data),{type:s,listener:i,listenersCollection:o,path:{listener:t,update:void 0,resolved:this.cleanNotRecursivePath(t)},params:this.getParams(o.paramsInfo,t),options:n});return this.debugSubscribe(i,o,t),this.unsubscribe(t,this.id)}unsubscribe(t,e){const n=this.listeners,s=n.get(t);return function unsub(){delete s.listeners[e],s.count--,0===s.count&&n.delete(t)}}same(t,e){return(["number","string","undefined","boolean"].includes(typeof t)||null===t)&&e===t}notifyListeners(t,e=[],n=!0){const s=[];for(const i in t){let{single:o,bulk:r}=t[i];for(const t of o){if(e.includes(t))continue;const i=this.debugTime(t);t.listener.fn(t.value(),t.eventInfo),n&&s.push(t),this.debugListener(i,t)}for(const t of r){if(e.includes(t))continue;const i=this.debugTime(t),o=t.value.map(t=>Object.assign(Object.assign({},t),{value:t.value()}));t.listener.fn(o,t.eventInfo),n&&s.push(t),this.debugListener(i,t)}}return s}getSubscribedListeners(t,e,n,s="update",i=null){n=Object.assign(Object.assign({},$t),n);const o={};for(let[r,a]of this.listeners)if(o[r]={single:[],bulk:[],bulkData:[]},a.match(t)){const l=a.paramsInfo?this.getParams(a.paramsInfo,t):void 0,c=a.isRecursive||a.isWildcard?()=>this.get(this.cutPath(t,r)):()=>e,d=[{value:c,path:t,params:l}];for(const e in a.listeners){const u=a.listeners[e];u.options.bulk?o[r].bulk.push({listener:u,listenersCollection:a,eventInfo:{type:s,listener:u,path:{listener:r,update:i||t,resolved:void 0},params:l,options:n},value:d}):o[r].single.push({listener:u,listenersCollection:a,eventInfo:{type:s,listener:u,path:{listener:r,update:i||t,resolved:this.cleanNotRecursivePath(t)},params:l,options:n},value:c})}}return o}notifySubscribedListeners(t,e,n,s="update",i=null){return this.notifyListeners(this.getSubscribedListeners(t,e,n,s,i))}getNestedListeners(t,e,n,s="update",i=null){const o={};for(let[r,a]of this.listeners){o[r]={single:[],bulk:[]};const l=this.cutPath(r,t);if(this.match(l,t)){const c=this.trimPath(r.substr(l.length)),d=new WildcardObject(e,this.options.delimeter,this.options.wildcard).get(c),u=a.paramsInfo?this.getParams(a.paramsInfo,t):void 0,h=[],p={};for(const e in d){const l=()=>d[e],c=[t,e].join(this.options.delimeter);for(const e in a.listeners){const d=a.listeners[e],m={type:s,listener:d,listenersCollection:a,path:{listener:r,update:i||t,resolved:this.cleanNotRecursivePath(c)},params:u,options:n};d.options.bulk?(h.push({value:l,path:c,params:u}),p[e]=d):o[r].single.push({listener:d,listenersCollection:a,eventInfo:m,value:l})}}for(const e in p){const i=p[e],l={type:s,listener:i,listenersCollection:a,path:{listener:r,update:t,resolved:void 0},options:n,params:u};o[r].bulk.push({listener:i,listenersCollection:a,eventInfo:l,value:h})}}}return o}notifyNestedListeners(t,e,n,s="update",i,o=null){return this.notifyListeners(this.getNestedListeners(t,e,n,s,o),i,!1)}getNotifyOnlyListeners(t,e,n,s="update",i=null){const o={};if("object"!=typeof n.only||!Array.isArray(n.only)||void 0===n.only[0]||!this.canBeNested(e))return o;for(const r of n.only){const a=new WildcardObject(e,this.options.delimeter,this.options.wildcard).get(r);o[r]={bulk:[],single:[]};for(const e in a){const l=t+this.options.delimeter+e;for(const[c,d]of this.listeners){const u=d.paramsInfo?this.getParams(d.paramsInfo,l):void 0;if(this.match(c,l)){const h=()=>a[e],p=[{value:h,path:l,params:u}];for(const e in d.listeners){const a=d.listeners[e],m={type:s,listener:a,listenersCollection:d,path:{listener:c,update:i||t,resolved:this.cleanNotRecursivePath(l)},params:u,options:n};a.options.bulk?o[r].bulk.some(t=>t.listener===a)||o[r].bulk.push({listener:a,listenersCollection:d,eventInfo:m,value:p}):o[r].single.push({listener:a,listenersCollection:d,eventInfo:m,value:h})}}}}}return o}notifyOnly(t,e,n,s="update",i=null){return void 0!==this.notifyListeners(this.getNotifyOnlyListeners(t,e,n,s,i))[0]}canBeNested(t){return"object"==typeof t&&null!==t}getUpdateValues(t,e,n){"object"==typeof t&&null!==t&&(t=Array.isArray(t)?t.slice():Object.assign({},t));let s=n;return"function"==typeof n&&(s=n(this.pathGet(e,this.data))),{newValue:s,oldValue:t}}wildcardUpdate(t,e,n=$t){n=Object.assign(Object.assign({},$t),n);const s=this.scan.get(t),i={};for(const t in s){const n=this.split(t),{oldValue:o,newValue:r}=this.getUpdateValues(s[t],n,e);this.same(r,o)||(i[t]=r)}const o=[];for(const e in i){const s=i[e];n.only.length?o.push(this.getNotifyOnlyListeners(e,s,n,"update",t)):(o.push(this.getSubscribedListeners(e,s,n,"update",t)),this.canBeNested(s)&&o.push(this.getNestedListeners(e,s,n,"update",t))),n.debug&&this.options.log("Wildcard update",{path:e,newValue:s}),this.pathSet(this.split(e),s,this.data)}let r=[];for(const t of o)r=[...r,...this.notifyListeners(t,r)]}update(t,e,n=$t){if(this.isWildcard(t))return this.wildcardUpdate(t,e,n);const s=this.split(t),{oldValue:i,newValue:o}=this.getUpdateValues(this.pathGet(s,this.data),s,e);if(n.debug&&this.options.log(`Updating ${t} ${n.source?`from ${n.source}`:""}`,i,o),this.same(o,i))return o;if(this.pathSet(s,o,this.data),null===(n=Object.assign(Object.assign({},$t),n)).only)return o;if(n.only.length)return this.notifyOnly(t,o,n),o;const r=this.notifySubscribedListeners(t,o,n);return this.canBeNested(o)&&this.notifyNestedListeners(t,o,n,"update",r),o}get(t){return void 0===t||""===t?this.data:this.pathGet(this.split(t),this.data)}debugSubscribe(t,e,n){t.options.debug&&this.options.log("listener subscribed",n,t,e)}debugListener(t,e){(e.eventInfo.options.debug||e.listener.options.debug)&&this.options.log("Listener fired",{time:Date.now()-t,info:e})}debugTime(t){return t.listener.options.debug||t.eventInfo.options.debug?Date.now():0}}
/**
 * Api functions
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */const xt="gantt-schedule-timeline-calendar";function isObject$1(t){return t&&"object"==typeof t&&!Array.isArray(t)}function mergeDeep$1(t,...e){const n=e.shift();if(isObject$1(t)&&isObject$1(n))for(const e in n)if(isObject$1(n[e]))void 0===t[e]&&(t[e]={}),t[e]=mergeDeep$1(t[e],n[e]);else if(Array.isArray(n[e])){t[e]=[];for(let s of n[e])isObject$1(s)?t[e].push(mergeDeep$1({},s)):t[e].push(s)}else t[e]=n[e];return e.length?mergeDeep$1(t,...e):t}const Ct={name:xt,stateFromConfig:function stateFromConfig(t){const e=defaultConfig(),n=function mergeActions(t,e){const n=mergeDeep$1({},e.actions),s=mergeDeep$1({},t.actions);let i=[...Object.keys(n),...Object.keys(s)];i=i.filter(t=>i.includes(t));const o={};for(const t of i)o[t]=[],void 0!==n[t]&&Array.isArray(n[t])&&(o[t]=[...n[t]]),void 0!==s[t]&&Array.isArray(s[t])&&(o[t]=[...o[t],...s[t]]);return delete t.actions,delete e.actions,o}(t,e),s={config:mergeDeep$1({},e,t)};return s.config.actions=n,new DeepState(s,{delimeter:"."})},mergeDeep:mergeDeep$1,date:t=>t?yt(t):yt(),dayjs:yt};
/**
 * Gantt-Schedule-Timeline-Calendar
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0
 */
function GSTC(t){const e=t.state,n=function getInternalApi(t){let e=t.get(),n=[];const s={name:xt,debug:!1,log(...t){this.debug&&console.log.call(console,...t)},mergeDeep:mergeDeep$1,getClass(t){let e=`${xt}__${t}`;return t===this.name&&(e=this.name),e},allActions:[],getActions(e){this.allActions.includes(e)||this.allActions.push(e);let n=t.get("config.actions."+e);return void 0===n&&(n=[]),n},isItemInViewport:(t,e,n)=>t.time.start>=e&&t.time.start<n||t.time.end>=e&&t.time.end<n,fillEmptyRowValues(t){let n=0;for(const s in t){const i=t[s];i._internal={parents:[],children:[],items:[]},"number"!=typeof i.height&&(i.height=e.config.list.rowHeight),"boolean"!=typeof i.expanded&&(i.expanded=!1),i.top=n,n+=i.height}return t},generateParents(t,e="parentId"){const n={};for(const s of t){const t=void 0!==s[e]?s[e]:"";void 0===n[t]&&(n[t]={}),n[t][s.id]=s}return n},fastTree(t,e,n=[]){const s=t[e.id];if(e._internal.parents=n,void 0===s)return e._internal.children=[],e;""!==e.id&&(n=[...n,e.id]),e._internal.children=Object.values(s);for(const e in s){const i=s[e];this.fastTree(t,i,n)}return e},makeTreeMap(t,e){const n=this.generateParents(e,"rowId");for(const e of t)e._internal.items=void 0!==n[e.id]?Object.values(n[e.id]):[];const s=this.generateParents(t);return this.fastTree(s,{id:"",_internal:{children:[],parents:[],items:[]}})},getFlatTreeMapById(t,e={}){for(const n of t._internal.children)e[n.id]=n,this.getFlatTreeMapById(n,e);return e},flattenTreeMap(t,e=[]){for(const n of t._internal.children)e.push(n.id),this.flattenTreeMap(n,e);return e},getRowsFromMap:(t,e)=>t.map(t=>e[t.id]),getRowsFromIds(t,e){const n=[];for(const s of t)n.push(e[s]);return n},getRowsWithParentsExpanded(t,e,n){const s=[];t:for(const i of t){for(const t of e[i]._internal.parents){if(!n[t].expanded)continue t}s.push(i)}return s},getRowsHeight(t){let e=0;for(let n of t)e+=n.height;return e},getVisibleRowsAndCompensation(e){const n=[];let s=0,i=0;const o=t.get("config.scroll.top"),r=t.get("_internal.height");let a=0,l=0;for(const t of e)if(a=o+r,s+t.height>o&&s<a&&(t.top=i,l=t.top+o-s,i+=t.height,n.push(t)),(s+=t.height)>=a)break;return{visibleRows:n,compensation:l}},normalizeMouseWheelEvent(t){let e=t.deltaX||0,n=t.deltaY||0,s=t.deltaZ||0;const i=t.deltaMode,o=parseInt(getComputedStyle(t.target).getPropertyValue("line-height"));let r=1;switch(i){case 1:r=o;break;case 2:r=window.height}return{x:e*=r,y:n*=r,z:s*=r,event:t}},limitScroll(e,n){if("top"===e){const e=t.get("_internal.list.rowsHeight")-t.get("_internal.height");return n<0?n=0:n>e&&(n=e),n}{const e=t.get("_internal.chart.time.totalViewDurationPx")-t.get("_internal.chart.dimensions.width");return n<0?n=0:n>e&&(n=e),n}},time:timeApi(t),getScrollBarHeight(){const t=document.createElement("div");t.style.visibility="hidden",t.style.height="100px",t.style.msOverflowStyle="scrollbar",document.body.appendChild(t);var e=t.offsetHeight;t.style.overflow="scroll";var n=document.createElement("div");n.style.height="100%",t.appendChild(n);var s=n.offsetHeight;return t.parentNode.removeChild(t),e-s+1},getGridBlocksUnderRect(e,n,s,i){if(!t.get("_internal.elements.main"))return[]},destroy(){e=void 0;for(const t of n)t();n=[],s.debug&&delete window.state}};return s.debug&&(window.state=t,window.api=s),s}(e),s={components:{Main:Main},scrollBarHeight:17,height:0,treeMap:{},flatTreeMap:[],flatTreeMapById:{},list:{expandedHeight:0,visibleRows:[],rows:{},width:0},dimensions:{width:0,height:0},chart:{dimensions:{width:0,innerWidth:0},visibleItems:[],time:{dates:{},timePerPixel:0,firstTaskTime:0,lastTaskTime:0,totalViewDurationMs:0,totalViewDurationPx:0,leftGlobal:0,rightGlobal:0,leftPx:0,rightPx:0,leftInner:0,rightInner:0,maxWidth:{}}},elements:{}};"boolean"==typeof t.debug&&t.debug&&(window.state=e),e.update("",t=>({config:t.config,_internal:s}));const i=Vido(e,n);return{state:e,app:i.createApp({component:Main,props:i,element:t.element})}}GSTC.api=Ct;export default GSTC;
//# sourceMappingURL=index.esm.js.map
