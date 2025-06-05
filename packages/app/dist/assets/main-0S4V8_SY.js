(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();var F,Et;class le extends Error{}le.prototype.name="InvalidTokenError";function Br(i){return decodeURIComponent(atob(i).replace(/(.)/g,(e,t)=>{let s=t.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function qr(i){let e=i.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Br(e)}catch{return atob(e)}}function Xt(i,e){if(typeof i!="string")throw new le("Invalid token specified: must be a string");e||(e={});const t=e.header===!0?0:1,s=i.split(".")[t];if(typeof s!="string")throw new le(`Invalid token specified: missing part #${t+1}`);let r;try{r=qr(s)}catch(n){throw new le(`Invalid token specified: invalid base64 for part #${t+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new le(`Invalid token specified: invalid json for part #${t+1} (${n.message})`)}}const Vr="mu:context",Qe=`${Vr}:change`;class Jr{constructor(e,t){this._proxy=Wr(e,t)}get value(){return this._proxy}set value(e){Object.assign(this._proxy,e)}apply(e){this.value=e(this.value)}}class rt extends HTMLElement{constructor(e){super(),console.log("Constructing context provider",this),this.context=new Jr(e,this),this.style.display="contents"}attach(e){return this.addEventListener(Qe,e),e}detach(e){this.removeEventListener(Qe,e)}}function Wr(i,e){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let u=new CustomEvent(Qe,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:l,value:n}),e.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Yr(i,e){const t=er(e,i);return new Promise((s,r)=>{if(t){const n=t.localName;customElements.whenDefined(n).then(()=>s(t))}else r({context:e,reason:`No provider for this context "${e}:`})})}function er(i,e){const t=`[provides="${i}"]`;if(!e||e===document.getRootNode())return;const s=e.closest(t);if(s)return s;const r=e.getRootNode();if(r instanceof ShadowRoot)return er(i,r.host)}class Kr extends CustomEvent{constructor(e,t="mu:message"){super(t,{bubbles:!0,composed:!0,detail:e})}}function tr(i="mu:message"){return(e,...t)=>e.dispatchEvent(new Kr(t,i))}class st{constructor(e,t,s="service:message",r=!0){this._pending=[],this._context=t,this._update=e,this._eventType=s,this._running=r}attach(e){e.addEventListener(this._eventType,t=>{t.stopPropagation();const s=t.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(e=>this.process(e)))}apply(e){this._context.apply(e)}consume(e){this._running?this.process(e):(console.log(`Queueing ${this._eventType} message`,e),this._pending.push(e))}process(e){console.log(`Processing ${this._eventType} message`,e);const t=this._update(e,this.apply.bind(this));t&&t(this._context.value)}}function Qr(i){return e=>({...e,...i})}const Ze="mu:auth:jwt",rr=class sr extends st{constructor(e,t){super((s,r)=>this.update(s,r),e,sr.EVENT_TYPE),this._redirectForLogin=t}update(e,t){switch(e[0]){case"auth/signin":const{token:s,redirect:r}=e[1];return t(Gr(s)),qe(r);case"auth/signout":return t(Xr()),qe(this._redirectForLogin);case"auth/redirect":return qe(this._redirectForLogin,{next:window.location.href});default:const n=e[0];throw new Error(`Unhandled Auth message "${n}"`)}}};rr.EVENT_TYPE="auth:message";let ir=rr;const nr=tr(ir.EVENT_TYPE);function qe(i,e={}){if(!i)return;const t=window.location.href,s=new URL(i,t);return Object.entries(e).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class Zr extends rt{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const e=Y.authenticateFromLocalStorage();super({user:e,token:e.authenticated?e.token:void 0})}connectedCallback(){new ir(this.context,this.redirect).attach(this)}}class W{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(e){return e.authenticated=!1,e.username="anonymous",localStorage.removeItem(Ze),e}}class Y extends W{constructor(e){super();const t=Xt(e);console.log("Token payload",t),this.token=e,this.authenticated=!0,this.username=t.username}static authenticate(e){const t=new Y(e);return localStorage.setItem(Ze,e),t}static authenticateFromLocalStorage(){const e=localStorage.getItem(Ze);return e?Y.authenticate(e):new W}}function Gr(i){return Qr({user:Y.authenticate(i),token:i})}function Xr(){return i=>{const e=i.user;return{user:e&&e.authenticated?W.deauthenticate(e):e,token:""}}}function es(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function ts(i){return i.authenticated?Xt(i.token||""):{}}const Ue=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Y,Provider:Zr,User:W,dispatch:nr,headers:es,payload:ts},Symbol.toStringTag,{value:"Module"}));function Pe(i,e,t){const s=i.target,r=new CustomEvent(e,{bubbles:!0,composed:!0,detail:t});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function Ge(i,e="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(e)})}const rs=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Ge,relay:Pe},Symbol.toStringTag,{value:"Module"}));function or(i,...e){const t=i.map((r,n)=>n?[e[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(t),s}const ss=new DOMParser;function M(i,...e){const t=e.map(l),s=i.map((a,u)=>{if(u===0)return[a];const f=t[u-1];return f instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[f,a]}).flat().join(""),r=ss.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),t.forEach((a,u)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${u}`);if(f){const d=f.parentNode;d==null||d.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),o;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return xt(a);case"bigint":case"boolean":case"number":case"symbol":return xt(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,d=a.map(l);return f.replaceChildren(...d),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function xt(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Me(i,e={mode:"open"}){const t=i.attachShadow(e),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&t.appendChild(a.content.cloneNode(!0)),s}function n(...o){t.adoptedStyleSheets=o}}F=class extends HTMLElement{constructor(){super(),this._state={},Me(this).template(F.template).styles(F.styles),this.addEventListener("change",i=>{const e=i.target;if(e){const t=e.name,s=e.value;t&&(this._state[t]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Pe(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},is(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},F.template=M`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,F.styles=or`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function is(i,e){const t=Object.entries(i);for(const[s,r]of t){const n=e.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const ar=class lr extends st{constructor(e){super((t,s)=>this.update(t,s),e,lr.EVENT_TYPE)}update(e,t){switch(e[0]){case"history/navigate":{const{href:s,state:r}=e[1];t(os(s,r));break}case"history/redirect":{const{href:s,state:r}=e[1];t(as(s,r));break}}}};ar.EVENT_TYPE="history:message";let it=ar;class St extends rt{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",e=>{const t=ns(e);if(t){const s=new URL(t.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",e),e.preventDefault(),nt(t,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",e=>{console.log("Popstate",e.state),this.context.value={location:document.location,state:e.state}})}connectedCallback(){new it(this.context).attach(this)}}function ns(i){const e=i.currentTarget,t=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(t);return r||void 0}else{for(let s=i.target;s;s===e?null:s.parentElement)if(t(s))return s;return}}function os(i,e={}){return history.pushState(e,"",i),()=>({location:document.location,state:history.state})}function as(i,e={}){return history.replaceState(e,"",i),()=>({location:document.location,state:history.state})}const nt=tr(it.EVENT_TYPE),ls=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:St,Provider:St,Service:it,dispatch:nt},Symbol.toStringTag,{value:"Module"}));class K{constructor(e,t){this._effects=[],this._target=e,this._contextLabel=t}observe(e=void 0){return new Promise((t,s)=>{if(this._provider){const r=new kt(this._provider,e);this._effects.push(r),t(r)}else Yr(this._target,this._contextLabel).then(r=>{const n=new kt(r,e);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),t(n)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(e){console.log("Received change event for observers",e,this._effects),e.stopPropagation(),this._effects.forEach(t=>t.runEffect())}}class kt{constructor(e,t){this._provider=e,t&&this.setEffect(t)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(e){this._effectFn=e,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const cr=class hr extends HTMLElement{constructor(){super(),this._state={},this._user=new W,this._authObserver=new K(this,"blazing:auth"),Me(this).template(hr.template),this.form&&this.form.addEventListener("submit",e=>{if(e.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const t=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;cs(r,this._state,t,this.authorization).then(n=>ie(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:t,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:t,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",e=>{const t=e.target;if(t){const s=t.name,r=t.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(e){this._state=e||{},ie(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}get authorization(){var e;return(e=this._user)!=null&&e.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:e})=>{e&&(this._user=e,this.src&&!this.isNew&&Pt(this.src,this.authorization).then(t=>{this._state=t,ie(t,this)}))})}attributeChangedCallback(e,t,s){switch(e){case"src":this.src&&s&&s!==t&&!this.isNew&&Pt(this.src,this.authorization).then(r=>{this._state=r,ie(r,this)});break;case"new":s&&(this._state={},ie({},this));break}}};cr.observedAttributes=["src","new","action"];cr.template=M`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Pt(i,e){return fetch(i,{headers:e}).then(t=>{if(t.status!==200)throw`Status: ${t.status}`;return t.json()}).catch(t=>console.log(`Failed to load form from ${i}:`,t))}function ie(i,e){const t=Object.entries(i);for(const[s,r]of t){const n=e.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function cs(i,e,t="PUT",s={}){return fetch(i,{method:t,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(e)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const dr=class ur extends st{constructor(e,t){super(t,e,ur.EVENT_TYPE,!1)}};dr.EVENT_TYPE="mu:message";let pr=dr;class hs extends rt{constructor(e,t,s){super(t),this._user=new W,this._updateFn=e,this._authObserver=new K(this,s)}connectedCallback(){const e=new pr(this.context,(t,s)=>this._updateFn(t,s,this._user));e.attach(this),this._authObserver.observe(({user:t})=>{console.log("Store got auth",t),t&&(this._user=t),e.start()})}}const ds=Object.freeze(Object.defineProperty({__proto__:null,Provider:hs,Service:pr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Se=globalThis,ot=Se.ShadowRoot&&(Se.ShadyCSS===void 0||Se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,at=Symbol(),Ct=new WeakMap;let fr=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==at)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ot&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Ct.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ct.set(t,e))}return e}toString(){return this.cssText}};const us=i=>new fr(typeof i=="string"?i:i+"",void 0,at),ps=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new fr(t,i,at)},fs=(i,e)=>{if(ot)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=Se.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},Ot=ot?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return us(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ms,defineProperty:gs,getOwnPropertyDescriptor:vs,getOwnPropertyNames:ys,getOwnPropertySymbols:bs,getPrototypeOf:_s}=Object,Q=globalThis,Tt=Q.trustedTypes,$s=Tt?Tt.emptyScript:"",Nt=Q.reactiveElementPolyfillSupport,ce=(i,e)=>i,Ce={toAttribute(i,e){switch(e){case Boolean:i=i?$s:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},lt=(i,e)=>!ms(i,e),Rt={attribute:!0,type:String,converter:Ce,reflect:!1,hasChanged:lt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Rt){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&gs(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:n}=vs(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Rt}static _$Ei(){if(this.hasOwnProperty(ce("elementProperties")))return;const e=_s(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ce("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ce("properties"))){const t=this.properties,s=[...ys(t),...bs(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(Ot(r))}else e!==void 0&&t.push(Ot(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fs(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EC(e,t){var s;const r=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ce).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(e,t){var s;const r=this.constructor,n=r._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ce;this._$Em=n,this[n]=l.fromAttribute(t,o.type),this._$Em=null}}requestUpdate(e,t,s){if(e!==void 0){if(s??(s=this.constructor.getPropertyOptions(e)),!(s.hasChanged??lt)(this[e],t))return;this.P(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,s){this._$AL.has(e)||this._$AL.set(e,t),s.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),(e=this._$EO)==null||e.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(s)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[ce("elementProperties")]=new Map,q[ce("finalized")]=new Map,Nt==null||Nt({ReactiveElement:q}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oe=globalThis,Te=Oe.trustedTypes,zt=Te?Te.createPolicy("lit-html",{createHTML:i=>i}):void 0,mr="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,gr="?"+k,ws=`<${gr}>`,I=document,pe=()=>I.createComment(""),fe=i=>i===null||typeof i!="object"&&typeof i!="function",ct=Array.isArray,As=i=>ct(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ve=`[ 	
\f\r]`,ne=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ut=/-->/g,Mt=/>/g,N=RegExp(`>|${Ve}(?:([^\\s"'>=/]+)(${Ve}*=${Ve}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Lt=/'/g,It=/"/g,vr=/^(?:script|style|textarea|title)$/i,Es=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),oe=Es(1),Z=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ht=new WeakMap,z=I.createTreeWalker(I,129);function yr(i,e){if(!ct(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return zt!==void 0?zt.createHTML(e):e}const xs=(i,e)=>{const t=i.length-1,s=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=ne;for(let l=0;l<t;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ne?f[1]==="!--"?o=Ut:f[1]!==void 0?o=Mt:f[2]!==void 0?(vr.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=r??ne,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?N:f[3]==='"'?It:Lt):o===It||o===Lt?o=N:o===Ut||o===Mt?o=ne:(o=N,r=void 0);const h=o===N&&i[l+1].startsWith("/>")?" ":"";n+=o===ne?a+ws:d>=0?(s.push(u),a.slice(0,d)+mr+a.slice(d)+k+h):a+k+(d===-2?l:h)}return[yr(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};let Xe=class br{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let n=0,o=0;const l=e.length-1,a=this.parts,[u,f]=xs(e,t);if(this.el=br.createElement(u,s),z.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=z.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(mr)){const c=f[o++],h=r.getAttribute(d).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?ks:p[1]==="?"?Ps:p[1]==="@"?Cs:Le}),r.removeAttribute(d)}else d.startsWith(k)&&(a.push({type:6,index:n}),r.removeAttribute(d));if(vr.test(r.tagName)){const d=r.textContent.split(k),c=d.length-1;if(c>0){r.textContent=Te?Te.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],pe()),z.nextNode(),a.push({type:2,index:++n});r.append(d[c],pe())}}}else if(r.nodeType===8)if(r.data===gr)a.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(k,d+1))!==-1;)a.push({type:7,index:n}),d+=k.length-1}n++}}static createElement(e,t){const s=I.createElement("template");return s.innerHTML=e,s}};function G(i,e,t=i,s){var r,n;if(e===Z)return e;let o=s!==void 0?(r=t.o)==null?void 0:r[s]:t.l;const l=fe(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,t,s)),s!==void 0?(t.o??(t.o=[]))[s]=o:t.l=o),o!==void 0&&(e=G(i,o._$AS(i,e.values),o,s)),e}class Ss{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??I).importNode(t,!0);z.currentNode=r;let n=z.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new be(n,n.nextSibling,this,e):a.type===1?u=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(u=new Os(n,this,e)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=z.nextNode(),o++)}return z.currentNode=I,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class be{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this.v}constructor(e,t,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),fe(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==Z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):As(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&fe(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){var t;const{values:s,_$litType$:r}=e,n=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=Xe.createElement(yr(r.h,r.h[0]),this.options)),r);if(((t=this._$AH)==null?void 0:t._$AD)===n)this._$AH.p(s);else{const o=new Ss(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(e){let t=Ht.get(e.strings);return t===void 0&&Ht.set(e.strings,t=new Xe(e)),t}k(e){ct(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const n of e)r===t.length?t.push(s=new be(this.O(pe()),this.O(pe()),this,this.options)):s=t[r],s._$AI(n),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this.v=e,(t=this._$AP)==null||t.call(this,e))}}class Le{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,r){const n=this.strings;let o=!1;if(n===void 0)e=G(this,e,t,0),o=!fe(e)||e!==this._$AH&&e!==Z,o&&(this._$AH=e);else{const l=e;let a,u;for(e=n[0],a=0;a<n.length-1;a++)u=G(this,l[s+a],t,a),u===Z&&(u=this._$AH[a]),o||(o=!fe(u)||u!==this._$AH[a]),u===_?e=_:e!==_&&(e+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!r&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ks extends Le{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}}class Ps extends Le{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}}class Cs extends Le{constructor(e,t,s,r,n){super(e,t,s,r,n),this.type=5}_$AI(e,t=this){if((e=G(this,e,t,0)??_)===Z)return;const s=this._$AH,r=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Os{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const jt=Oe.litHtmlPolyfillSupport;jt==null||jt(Xe,be),(Oe.litHtmlVersions??(Oe.litHtmlVersions=[])).push("3.2.0");const Ts=(i,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const n=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new be(e.insertBefore(pe(),n),n,void 0,t??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=Ts(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return Z}};J._$litElement$=!0,J.finalized=!0,(Et=globalThis.litElementHydrateSupport)==null||Et.call(globalThis,{LitElement:J});const Dt=globalThis.litElementPolyfillSupport;Dt==null||Dt({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ns={attribute:!0,type:String,converter:Ce,reflect:!1,hasChanged:lt},Rs=(i=Ns,e,t)=>{const{kind:s,metadata:r}=t;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(t.name,i),s==="accessor"){const{name:o}=t;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=t;return function(l){const a=this[o];e.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function _r(i){return(e,t)=>typeof t=="object"?Rs(i,e,t):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $r(i){return _r({...i,state:!0,attribute:!1})}function zs(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Us(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var wr={};(function(i){var e=function(){var t=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,v,He){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},t(l,[2,4]),t(l,[2,5]),t(l,[2,6]),t(l,[2,7]),t(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},t(l,[2,10]),t(l,[2,11]),t(l,[2,12]),{1:[2,1]},t(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},t(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],v=this.table,He="",A=0,$t=0,Hr=2,wt=1,jr=m.slice.call(arguments,1),b=Object.create(this.lexer),O={yy:{}};for(var je in this.yy)Object.prototype.hasOwnProperty.call(this.yy,je)&&(O.yy[je]=this.yy[je]);b.setInput(c,O.yy),O.yy.lexer=b,O.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var De=b.yylloc;m.push(De);var Dr=b.options&&b.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Fr=function(){var D;return D=b.lex()||wt,typeof D!="number"&&(D=h.symbols_[D]||D),D},w,T,E,Fe,j={},Ee,x,At,xe;;){if(T=p[p.length-1],this.defaultActions[T]?E=this.defaultActions[T]:((w===null||typeof w>"u")&&(w=Fr()),E=v[T]&&v[T][w]),typeof E>"u"||!E.length||!E[0]){var Be="";xe=[];for(Ee in v[T])this.terminals_[Ee]&&Ee>Hr&&xe.push("'"+this.terminals_[Ee]+"'");b.showPosition?Be="Parse error on line "+(A+1)+`:
`+b.showPosition()+`
Expecting `+xe.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Be="Parse error on line "+(A+1)+": Unexpected "+(w==wt?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Be,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:De,expected:xe})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(b.yytext),m.push(b.yylloc),p.push(E[1]),w=null,$t=b.yyleng,He=b.yytext,A=b.yylineno,De=b.yylloc;break;case 2:if(x=this.productions_[E[1]][1],j.$=g[g.length-x],j._$={first_line:m[m.length-(x||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(x||1)].first_column,last_column:m[m.length-1].last_column},Dr&&(j._$.range=[m[m.length-(x||1)].range[0],m[m.length-1].range[1]]),Fe=this.performAction.apply(j,[He,$t,A,O.yy,E[1],g,m].concat(jr)),typeof Fe<"u")return Fe;x&&(p=p.slice(0,-1*x*2),g=g.slice(0,-1*x),m=m.slice(0,-1*x)),p.push(this.productions_[E[1]][0]),g.push(j.$),m.push(j._$),At=v[p[p.length-2]][p[p.length-1]],p.push(At);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=v,this.options.backtrack_lexer){if(c=this.test_match(p,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Us<"u"&&(i.parser=e,i.Parser=e.Parser,i.parse=function(){return e.parse.apply(e,arguments)})})(wr);function B(i){return function(e,t){return{displayName:i,props:e,children:t||[]}}}var Ar={Root:B("Root"),Concat:B("Concat"),Literal:B("Literal"),Splat:B("Splat"),Param:B("Param"),Optional:B("Optional")},Er=wr.parser;Er.yy=Ar;var Ms=Er,Ls=Object.keys(Ar);function Is(i){return Ls.forEach(function(e){if(typeof i[e]>"u")throw new Error("No handler defined for "+e.displayName)}),{visit:function(e,t){return this.handlers[e.displayName].call(this,e,t)},handlers:i}}var xr=Is,Hs=xr,js=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Sr(i){this.captures=i.captures,this.re=i.re}Sr.prototype.match=function(i){var e=this.re.exec(i),t={};if(e)return this.captures.forEach(function(s,r){typeof e[r+1]>"u"?t[s]=void 0:t[s]=decodeURIComponent(e[r+1])}),t};var Ds=Hs({Concat:function(i){return i.children.reduce((function(e,t){var s=this.visit(t);return{re:e.re+s.re,captures:e.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(js,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var e=this.visit(i.children[0]);return{re:"(?:"+e.re+")?",captures:e.captures}},Root:function(i){var e=this.visit(i.children[0]);return new Sr({re:new RegExp("^"+e.re+"(?=\\?|$)"),captures:e.captures})}}),Fs=Ds,Bs=xr,qs=Bs({Concat:function(i,e){var t=i.children.map((function(s){return this.visit(s,e)}).bind(this));return t.some(function(s){return s===!1})?!1:t.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,e){return e[i.props.name]?e[i.props.name]:!1},Param:function(i,e){return e[i.props.name]?e[i.props.name]:!1},Optional:function(i,e){var t=this.visit(i.children[0],e);return t||""},Root:function(i,e){e=e||{};var t=this.visit(i.children[0],e);return t?encodeURI(t):!1}}),Vs=qs,Js=Ms,Ws=Fs,Ys=Vs;_e.prototype=Object.create(null);_e.prototype.match=function(i){var e=Ws.visit(this.ast),t=e.match(i);return t||!1};_e.prototype.reverse=function(i){return Ys.visit(this.ast,i)};function _e(i){var e;if(this?e=this:e=Object.create(_e.prototype),typeof i>"u")throw new Error("A route spec is required");return e.spec=i,e.ast=Js.parse(i),e}var Ks=_e,Qs=Ks,Zs=Qs;const Gs=zs(Zs);var Xs=Object.defineProperty,kr=(i,e,t,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&Xs(e,t,r),r};const Pr=class extends J{constructor(e,t,s=""){super(),this._cases=[],this._fallback=()=>oe` <h1>Not Found</h1> `,this._cases=e.map(r=>({...r,route:new Gs(r.path)})),this._historyObserver=new K(this,t),this._authObserver=new K(this,s)}connectedCallback(){this._historyObserver.observe(({location:e})=>{console.log("New location",e),e&&(this._match=this.matchRoute(e))}),this._authObserver.observe(({user:e})=>{this._user=e}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),oe` <main>${(()=>{const t=this._match;if(t){if("view"in t)return this._user?t.auth&&t.auth!=="public"&&this._user&&!this._user.authenticated?(nr(this,"auth/redirect"),oe` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",t.params,t.query),t.view(t.params||{},t.query)):oe` <h1>Authenticating</h1> `;if("redirect"in t){const s=t.redirect;if(typeof s=="string")return this.redirect(s),oe` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(e){e.has("_match")&&this.requestUpdate()}matchRoute(e){const{search:t,pathname:s}=e,r=new URLSearchParams(t),n=s+t;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(e){nt(this,"history/redirect",{href:e})}};Pr.styles=ps`
    :host,
    main {
      display: contents;
    }
  `;let Ne=Pr;kr([$r()],Ne.prototype,"_user");kr([$r()],Ne.prototype,"_match");const ei=Object.freeze(Object.defineProperty({__proto__:null,Element:Ne,Switch:Ne},Symbol.toStringTag,{value:"Module"})),ti=class Cr extends HTMLElement{constructor(){if(super(),Me(this).template(Cr.template),this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name='actuator']");e&&e.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ti.template=M`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Or=class et extends HTMLElement{constructor(){super(),this._array=[],Me(this).template(et.template).styles(et.styles),this.addEventListener("input-array:add",e=>{e.stopPropagation(),this.append(Tr("",this._array.length))}),this.addEventListener("input-array:remove",e=>{e.stopPropagation(),this.removeClosestItem(e.target)}),this.addEventListener("change",e=>{e.stopPropagation();const t=e.target;if(t&&t!==this){const s=new Event("change",{bubbles:!0}),r=t.value,n=t.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",e=>{Ge(e,"button.add")?Pe(e,"input-array:add"):Ge(e,"button.remove")&&Pe(e,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(e){this._array=Array.isArray(e)?e:[e],ri(this._array,this)}removeClosestItem(e){const t=e.closest("label");if(console.log("Removing closest item:",t,e),t){const s=Array.from(this.children).indexOf(t);this._array.splice(s,1),t.remove()}}};Or.template=M`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Or.styles=or`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function ri(i,e){e.replaceChildren(),i.forEach((t,s)=>e.append(Tr(t)))}function Tr(i,e){const t=i===void 0?M`<input />`:M`<input value="${i}" />`;return M`
    <label>
      ${t}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function si(i){return Object.entries(i).map(([e,t])=>{customElements.get(e)||customElements.define(e,t)}),customElements}var ii=Object.defineProperty,ni=Object.getOwnPropertyDescriptor,oi=(i,e,t,s)=>{for(var r=ni(e,t),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&ii(e,t,r),r};class $e extends J{constructor(e){super(),this._pending=[],this._observer=new K(this,e)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var e;super.connectedCallback(),(e=this._observer)==null||e.observe().then(t=>{console.log("View effect (initial)",this,t),this._context=t.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),t.setEffect(()=>{var s;if(console.log("View effect",this,t,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(e,t=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:e});this._context?(console.log("Dispatching message event",s),t.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([t,s]))}ref(e){return this.model?this.model[e]:void 0}}oi([_r()],$e.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ke=globalThis,ht=ke.ShadowRoot&&(ke.ShadyCSS===void 0||ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,dt=Symbol(),Ft=new WeakMap;let Nr=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==dt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ht&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Ft.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ft.set(t,e))}return e}toString(){return this.cssText}};const ai=i=>new Nr(typeof i=="string"?i:i+"",void 0,dt),we=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Nr(t,i,dt)},li=(i,e)=>{if(ht)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=ke.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},Bt=ht?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return ai(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ci,defineProperty:hi,getOwnPropertyDescriptor:di,getOwnPropertyNames:ui,getOwnPropertySymbols:pi,getPrototypeOf:fi}=Object,C=globalThis,qt=C.trustedTypes,mi=qt?qt.emptyScript:"",Je=C.reactiveElementPolyfillSupport,he=(i,e)=>i,Re={toAttribute(i,e){switch(e){case Boolean:i=i?mi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},ut=(i,e)=>!ci(i,e),Vt={attribute:!0,type:String,converter:Re,reflect:!1,useDefault:!1,hasChanged:ut};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let V=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Vt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&hi(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:n}=di(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Vt}static _$Ei(){if(this.hasOwnProperty(he("elementProperties")))return;const e=fi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(he("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(he("properties"))){const t=this.properties,s=[...ui(t),...pi(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(Bt(r))}else e!==void 0&&t.push(Bt(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return li(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var n;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Re).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){var n,o;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Re;this._$Em=r,this[r]=a.fromAttribute(t,l.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(e,t,s){var r;if(e!==void 0){const n=this.constructor,o=this[e];if(s??(s=n.getPropertyOptions(e)),!((s.hasChanged??ut)(o,t)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[he("elementProperties")]=new Map,V[he("finalized")]=new Map,Je==null||Je({ReactiveElement:V}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const de=globalThis,ze=de.trustedTypes,Jt=ze?ze.createPolicy("lit-html",{createHTML:i=>i}):void 0,Rr="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,zr="?"+P,gi=`<${zr}>`,H=document,me=()=>H.createComment(""),ge=i=>i===null||typeof i!="object"&&typeof i!="function",pt=Array.isArray,vi=i=>pt(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",We=`[ 	
\f\r]`,ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Wt=/-->/g,Yt=/>/g,R=RegExp(`>|${We}(?:([^\\s"'>=/]+)(${We}*=${We}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Kt=/'/g,Qt=/"/g,Ur=/^(?:script|style|textarea|title)$/i,yi=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),y=yi(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Zt=new WeakMap,U=H.createTreeWalker(H,129);function Mr(i,e){if(!pt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Jt!==void 0?Jt.createHTML(e):e}const bi=(i,e)=>{const t=i.length-1,s=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=ae;for(let l=0;l<t;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ae?f[1]==="!--"?o=Wt:f[1]!==void 0?o=Yt:f[2]!==void 0?(Ur.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=r??ae,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?R:f[3]==='"'?Qt:Kt):o===Qt||o===Kt?o=R:o===Wt||o===Yt?o=ae:(o=R,r=void 0);const h=o===R&&i[l+1].startsWith("/>")?" ":"";n+=o===ae?a+gi:d>=0?(s.push(u),a.slice(0,d)+Rr+a.slice(d)+P+h):a+P+(d===-2?l:h)}return[Mr(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class ve{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let n=0,o=0;const l=e.length-1,a=this.parts,[u,f]=bi(e,t);if(this.el=ve.createElement(u,s),U.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=U.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Rr)){const c=f[o++],h=r.getAttribute(d).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?$i:p[1]==="?"?wi:p[1]==="@"?Ai:Ie}),r.removeAttribute(d)}else d.startsWith(P)&&(a.push({type:6,index:n}),r.removeAttribute(d));if(Ur.test(r.tagName)){const d=r.textContent.split(P),c=d.length-1;if(c>0){r.textContent=ze?ze.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],me()),U.nextNode(),a.push({type:2,index:++n});r.append(d[c],me())}}}else if(r.nodeType===8)if(r.data===zr)a.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(P,d+1))!==-1;)a.push({type:7,index:n}),d+=P.length-1}n++}}static createElement(e,t){const s=H.createElement("template");return s.innerHTML=e,s}}function ee(i,e,t=i,s){var o,l;if(e===X)return e;let r=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const n=ge(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=r:t._$Cl=r),r!==void 0&&(e=ee(i,r._$AS(i,e.values),r,s)),e}class _i{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??H).importNode(t,!0);U.currentNode=r;let n=U.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new Ae(n,n.nextSibling,this,e):a.type===1?u=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(u=new Ei(n,this,e)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=U.nextNode(),o++)}return U.currentNode=H,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Ae{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ee(this,e,t),ge(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==X&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):vi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==$&&ge(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){var n;const{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=ve.createElement(Mr(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(t);else{const o=new _i(r,this),l=o.u(this.options);o.p(t),this.T(l),this._$AH=o}}_$AC(e){let t=Zt.get(e.strings);return t===void 0&&Zt.set(e.strings,t=new ve(e)),t}k(e){pt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const n of e)r===t.length?t.push(s=new Ae(this.O(me()),this.O(me()),this,this.options)):s=t[r],s._$AI(n),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class Ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(e,t=this,s,r){const n=this.strings;let o=!1;if(n===void 0)e=ee(this,e,t,0),o=!ge(e)||e!==this._$AH&&e!==X,o&&(this._$AH=e);else{const l=e;let a,u;for(e=n[0],a=0;a<n.length-1;a++)u=ee(this,l[s+a],t,a),u===X&&(u=this._$AH[a]),o||(o=!ge(u)||u!==this._$AH[a]),u===$?e=$:e!==$&&(e+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!r&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class $i extends Ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}}class wi extends Ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==$)}}class Ai extends Ie{constructor(e,t,s,r,n){super(e,t,s,r,n),this.type=5}_$AI(e,t=this){if((e=ee(this,e,t,0)??$)===X)return;const s=this._$AH,r=e===$&&s!==$||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ei{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){ee(this,e)}}const Ye=de.litHtmlPolyfillSupport;Ye==null||Ye(ve,Ae),(de.litHtmlVersions??(de.litHtmlVersions=[])).push("3.3.0");const xi=(i,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const n=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new Ae(e.insertBefore(me(),n),n,void 0,t??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=globalThis;class ue extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=xi(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return X}}var Gt;ue._$litElement$=!0,ue.finalized=!0,(Gt=L.litElementHydrateSupport)==null||Gt.call(L,{LitElement:ue});const Ke=L.litElementPolyfillSupport;Ke==null||Ke({LitElement:ue});(L.litElementVersions??(L.litElementVersions=[])).push("4.2.0");const Si={};function ki(i,e,t){switch(i[0]){case"player/select":Pi(i[1],t).then(r=>e(n=>({...n,player:r,loading:!1}))).catch(r=>{console.error("Failed to load player:",r),e(n=>({...n,loading:!1}))}),e(r=>({...r,loading:!0}));break;case"players/load-all":Ci(i[1],t).then(r=>e(n=>({...n,players:r,loading:!1}))).catch(r=>{console.error("Failed to load players:",r),e(n=>({...n,loading:!1}))}),e(r=>({...r,loading:!0}));break;case"profile/load":Oi(i[1]).then(r=>e(n=>({...n,profile:r,loading:!1}))).catch(r=>{console.error("Failed to load profile:",r),e(n=>({...n,loading:!1}))}),e(r=>({...r,loading:!0}));break;case"loading/set":e(r=>({...r,loading:i[1].loading}));break;case"player/save":Ti(i[1],t).then(r=>e(n=>({...n,player:r,loading:!1}))).catch(r=>{console.error("Failed to save player:",r),e(n=>({...n,loading:!1}))}),e(r=>({...r,loading:!0}));break;default:const s=i;throw new Error(`Unhandled message "${s}"`)}}function Pi(i,e){return fetch(`/api/players/${i.fullName}`,{headers:Ue.headers(e)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Player:",t),t})}function Ci(i,e){return fetch("/api/players",{headers:Ue.headers(e)}).then(t=>t.status===200?t.json():[]).then(t=>(console.log("All Players:",t),t||[]))}function Oi(i,e){return Promise.resolve({username:i.username})}function Ti(i,e){return fetch(`/api/players/${i.fullName}`,{method:"PUT",headers:{"Content-Type":"application/json",...Ue.headers(e)},body:JSON.stringify(i.player)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to save player: ${t.status}`)}).then(t=>(console.log("Saved Player:",t),t))}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ni=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ri={attribute:!0,type:String,converter:Re,reflect:!1,hasChanged:ut},zi=(i=Ri,e,t)=>{const{kind:s,metadata:r}=t;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(t.name,i),s==="accessor"){const{name:o}=t;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=t;return function(l){const a=this[o];e.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Lr(i){return(e,t)=>typeof t=="object"?zi(i,e,t):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function S(i){return Lr({...i,state:!0,attribute:!1})}var Ui=Object.defineProperty,Mi=Object.getOwnPropertyDescriptor,ft=(i,e,t,s)=>{for(var r=s>1?void 0:s?Mi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&Ui(e,t,r),r};let te=class extends ue{constructor(){super(...arguments),this.loggedIn=!1,this._authObserver=new K(this,"nfl-dynasty:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:i})=>{i&&i.authenticated?(this.loggedIn=!0,this.userid=i.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignInButton(){return y`
      <a href="/app/login" class="auth-link">Sign In</a>
    `}renderSignOutButton(){return y`
      <button @click=${this._handleSignOut} class="auth-button">Sign Out</button>
    `}_handleSignOut(i){rs.relay(i,"auth:message",["auth/signout"])}render(){return y`
      <div class="header-content">
        <a href="/app">
          <h1 class="title">NFL Dynasty Tracker</h1>
          <p class="subtitle">Explore the greatest dynasties in NFL history</p>
        </a>
      </div>
      <div class="auth-controls">
        ${this.loggedIn?y`
              <span class="user-greeting">Hello, ${this.userid}</span>
              <a href="/app/profile" class="auth-link">Profile</a>
              ${this.renderSignOutButton()}
            `:this.renderSignInButton()}
      </div>
    `}};te.styles=we`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--size-spacing-large, 1rem);
      background-color: var(--color-background-header, #333);
      color: var(--color-text-light, white);
    }
    .header-content {
      flex-grow: 1;
    }
    .header-content a {
      color: inherit;
      text-decoration: none;
    }
    .header-content a:hover {
      opacity: 0.8;
    }
    .title {
      margin: 0;
      font-size: 1.5em;
    }
    .subtitle {
      margin: 0;
      font-size: 0.9em;
      font-weight: normal;
    }
    .auth-controls {
      display: flex;
      align-items: center;
      gap: var(--size-spacing-medium, 0.5rem);
    }
    .auth-link, .auth-button {
      color: var(--color-link-inverted, yellow);
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-size: 1em;
      text-decoration: none;
      padding: var(--size-spacing-small) var(--size-spacing-medium);
    }
    .auth-button {
      border: 1px solid var(--color-link-inverted, yellow);
      border-radius: var(--border-radius, 0.25rem);
    }
    .auth-button:hover {
      background-color: rgba(255,255,255,0.1);
    }
    .user-greeting {
      margin-right: var(--size-spacing-medium, 0.5rem);
    }
  `;ft([S()],te.prototype,"userid",2);ft([S()],te.prototype,"loggedIn",2);te=ft([Ni("nfl-dynasty-header")],te);const vt=class vt extends $e{constructor(){super("nfl-dynasty:model")}render(){return y`
      <main>
        <section>
          <h2>NFL Franchises</h2>
          <p>Select a franchise to explore its dynasties:</p>
          
          <ul>
            <li><a href="/app/franchise/49ers">San Francisco 49ers</a></li>
            <li><a href="/app/franchise/cowboys">Dallas Cowboys</a></li>
            <li><a href="/app/franchise/steelers">Pittsburgh Steelers</a></li>
            <li><a href="/app/franchise/patriots">New England Patriots</a></li>
          </ul>
          
          <div class="test-links">
            <h3>Test SPA Features:</h3>
            <ul>
              <li><a href="/app/player/Joe-Montana">Joe Montana (Player View)</a></li>
              <li><a href="/app/player/Jerry-Rice">Jerry Rice (Player View)</a></li>
              <li><a href="/app/login">Login (Demo)</a></li>
              <li><a href="/app/profile">Profile (Protected)</a></li>
            </ul>
          </div>
        </section>
        
        <footer>
          <p>&copy; 2025 NFL Dynasty Tracker</p>
        </footer>
      </main>
    `}};vt.styles=we`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }
    
    section {
      max-width: 800px;
      margin: 0 auto;
    }
    
    h2 {
      color: var(--color-text-primary, #333);
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    p {
      color: var(--color-text-secondary, #555);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      line-height: 1.6;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    li {
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    a {
      display: inline-block;
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-background-secondary, #f8f9fa);
      color: var(--color-text-primary, #333);
      text-decoration: none;
      border-radius: var(--border-radius, 0.25rem);
      border-left: 4px solid var(--color-primary, #007bff);
      transition: background-color 0.2s ease;
    }
    
    a:hover {
      background-color: var(--color-background-hover, #e9ecef);
    }
    
    .test-links {
      margin-top: var(--size-spacing-xlarge, 3rem);
      padding-top: var(--size-spacing-large, 2rem);
      border-top: 1px solid var(--color-border, #dee2e6);
    }
    
    .test-links h3 {
      color: var(--color-text-secondary, #666);
      font-size: 1rem;
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    .test-links a {
      background-color: var(--color-background-accent, #fff3cd);
      border-left-color: var(--color-accent, #ffc107);
      font-size: 0.9rem;
    }
    
    footer {
      text-align: center;
      margin-top: var(--size-spacing-xlarge, 3rem);
      padding-top: var(--size-spacing-large, 2rem);
      border-top: 1px solid var(--color-border, #dee2e6);
      color: var(--color-text-secondary, #666);
      font-size: 0.9rem;
    }
  `;let tt=vt;var Li=Object.defineProperty,Ii=Object.getOwnPropertyDescriptor,Ir=(i,e,t,s)=>{for(var r=Ii(e,t),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&Li(e,t,r),r};const yt=class yt extends $e{get profile(){return this.model.profile}get loading(){return this.model.loading||!1}constructor(){super("nfl-dynasty:model")}connectedCallback(){super.connectedCallback(),this.profile||this.dispatchMessage(["profile/load",{username:"current-user"}])}render(){return this.loading?y`
        <div class="loading">
          <p>Loading user information...</p>
        </div>
      `:this.profile?y`
      <div class="profile-container">
        <section class="profile-info">
          <h2>Welcome, ${this.profile.username}!</h2>
          <p>This is your profile page. You're successfully logged into the NFL Dynasty Tracker.</p>
          <p>Here you can manage your preferences, view your favorite teams, and track your dynasty exploration progress.</p>
          
          <div class="profile-actions">
            <a href="/app" class="action-button">Explore Dynasties</a>
            <a href="/app/player/Joe-Montana" class="action-button secondary">View Sample Player</a>
          </div>
        </section>
        
        <div class="profile-stats">
          <div class="stat-card">
            <h3>Account Status</h3>
            <p>Active since today</p>
          </div>
          
          <div class="stat-card">
            <h3>Favorite Team</h3>
            <p>Not set yet</p>
          </div>
          
          <div class="stat-card">
            <h3>Players Viewed</h3>
            <p>Ready to explore!</p>
          </div>
        </div>
      </div>
    `:y`
        <div class="loading">
          <p>Redirecting to login...</p>
        </div>
      `}};yt.styles=we`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }
    
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .profile-info {
      background-color: var(--color-background-secondary, #f8f9fa);
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
      margin-bottom: var(--size-spacing-large, 2rem);
    }
    
    .profile-info h2 {
      margin-top: 0;
      color: var(--color-text-primary, #333);
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    .profile-info p {
      color: var(--color-text-secondary, #666);
      line-height: 1.6;
      margin-bottom: var(--size-spacing-medium, 1rem);
    }
    
    .loading {
      text-align: center;
      padding: var(--size-spacing-xlarge, 2rem);
      color: var(--color-text-secondary, #666);
    }
    
    .profile-actions {
      display: flex;
      gap: var(--size-spacing-medium, 1rem);
      flex-wrap: wrap;
    }
    
    .action-button {
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-primary, #007bff);
      color: white;
      text-decoration: none;
      border-radius: var(--border-radius, 0.25rem);
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    
    .action-button:hover {
      background-color: var(--color-primary-dark, #0056b3);
    }
    
    .action-button.secondary {
      background-color: var(--color-background-secondary, #6c757d);
    }
    
    .action-button.secondary:hover {
      background-color: var(--color-background-secondary-dark, #545b62);
    }
    
    .profile-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-spacing-large, 1.5rem);
      margin-top: var(--size-spacing-large, 1.5rem);
    }
    
    .stat-card {
      background-color: white;
      padding: var(--size-spacing-large, 1.5rem);
      border-radius: var(--border-radius, 0.25rem);
      border-left: 4px solid var(--color-accent, #ffc107);
      box-shadow: var(--shadow-small, 0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .stat-card h3 {
      margin: 0 0 var(--size-spacing-small, 0.5rem) 0;
      color: var(--color-text-primary, #333);
      font-size: 1rem;
    }
    
    .stat-card p {
      margin: 0;
      color: var(--color-text-secondary, #666);
      font-size: 0.9rem;
    }
  `;let ye=yt;Ir([S()],ye.prototype,"profile");Ir([S()],ye.prototype,"loading");var Hi=Object.defineProperty,ji=Object.getOwnPropertyDescriptor,mt=(i,e,t,s)=>{for(var r=s>1?void 0:s?ji(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&Hi(e,t,r),r};const Di={"Joe Montana":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Joe Montana",position:"Quarterback",yearsActive:"1979-1994",teams:"San Francisco 49ers (1979-1992), Kansas City Chiefs (1993-1994)",jerseyNumber:"#16 (49ers), #19 (Chiefs)",hofInductionYear:"2000",nicknames:"'Joe Cool', 'The Comeback Kid'"},"Joe-Montana":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Joe Montana",position:"Quarterback",yearsActive:"1979-1994",teams:"San Francisco 49ers (1979-1992), Kansas City Chiefs (1993-1994)",jerseyNumber:"#16 (49ers), #19 (Chiefs)",hofInductionYear:"2000",nicknames:"'Joe Cool', 'The Comeback Kid'"},"Jerry Rice":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Jerry Rice",position:"Wide Receiver",yearsActive:"1985-2004",teams:"San Francisco 49ers (1985-2000), Oakland Raiders (2001-2004), Seattle Seahawks (2004)",jerseyNumber:"#80",hofInductionYear:"2010",nicknames:"'Flash 80', 'World'"},"Jerry-Rice":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Jerry Rice",position:"Wide Receiver",yearsActive:"1985-2004",teams:"San Francisco 49ers (1985-2000), Oakland Raiders (2001-2004), Seattle Seahawks (2004)",jerseyNumber:"#80",hofInductionYear:"2010",nicknames:"'Flash 80', 'World'"}},bt=class bt extends $e{get player(){return this.model.player}get loading(){return this.model.loading||!1}constructor(){super("nfl-dynasty:model")}attributeChangedCallback(e,t,s){super.attributeChangedCallback(e,t,s),e==="player-name"&&t!==s&&s&&this.dispatchMessage(["player/select",{fullName:s}])}connectedCallback(){super.connectedCallback(),this.playerName&&this.dispatchMessage(["player/select",{fullName:this.playerName}])}get fallbackPlayer(){return this.playerName?Di[this.playerName]:void 0}get displayPlayer(){return this.player||this.fallbackPlayer}get usingFallback(){return!this.player&&!!this.fallbackPlayer}get availablePlayerNavigation(){return[{name:"Joe-Montana",displayName:"Joe Montana"},{name:"Jerry-Rice",displayName:"Jerry Rice"},{name:"Joseph Clifford Montana Jr.",displayName:"Joe Montana (Full)"}].filter(t=>t.name!==this.playerName).slice(0,2)}render(){if(this.loading)return y`
        <div class="player-container">
          <div class="loading">
            <h2>Loading player data...</h2>
            <p>Fetching information for ${this.playerName}</p>
          </div>
        </div>
      `;const e=this.displayPlayer;return e?y`
      <div class="player-container">
        ${this.usingFallback?y`
          <div class="demo-notice">
            📝 <strong>Demo Mode:</strong> Showing sample data. Sign in to access live data.
          </div>
        `:y`
          <div class="api-notice">
            <strong>Live Data:</strong> Loaded from MongoDB database via API.
          </div>
        `}

        <div class="player-header">
          <h1>${e.fullName}</h1>
          <p class="player-subtitle">${e.position} | ${e.teams}</p>
        </div>

        <div class="player-info">
          <h2 class="section-header">
            <svg class="icon" aria-hidden="true">
              <use href="/icons/sections.svg#${e.iconRef||"icon-team-info"}"></use>
            </svg>
            ${e.sectionTitle||"Player Information"}
          </h2>
          
          <div class="player-details">
            <div class="detail-label">Full Name:</div>
            <div class="detail-value">${e.fullName}</div>
            
            <div class="detail-label">Position:</div>
            <div class="detail-value">${e.position}</div>
            
            <div class="detail-label">Years Active:</div>
            <div class="detail-value">${e.yearsActive}</div>
            
            <div class="detail-label">Teams:</div>
            <div class="detail-value">${e.teams}</div>
            
            <div class="detail-label">Jersey Number:</div>
            <div class="detail-value">${e.jerseyNumber}</div>
            
            <div class="detail-label">Hall of Fame:</div>
            <div class="detail-value">${e.hofInductionYear}</div>
            
            ${e.nicknames?y`
              <div class="detail-label">Nicknames:</div>
              <div class="detail-value">${e.nicknames}</div>
            `:""}
          </div>
        </div>

        <div class="navigation">
          <a href="/app" class="nav-button">← Back to Home</a>
          ${this.availablePlayerNavigation.map(t=>y`
            <a href="/app/player/${t.name}" class="nav-button">${t.displayName}</a>
          `)}
          <a href="/app/profile" class="nav-button">Profile</a>
        </div>
      </div>
    `:y`
        <div class="player-container">
          <div class="error">
            <h2>Player Not Found</h2>
            <p>No player information available for "${this.playerName}".</p>
          </div>
          <div class="navigation">
            <a href="/app" class="nav-button">← Back to Home</a>
          </div>
        </div>
      `}};bt.styles=we`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }

    .player-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .loading, .error {
      text-align: center;
      padding: var(--size-spacing-xlarge, 3rem);
    }

    .loading {
      color: var(--color-text-secondary, #666);
    }

    .error {
      color: var(--color-error, #dc3545);
      background-color: var(--color-background-error, #f8d7da);
      border: 1px solid var(--color-border-error, #f5c6cb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-large, 1.5rem);
    }

    .demo-notice {
      background-color: var(--color-background-info, #d1ecf1);
      border: 1px solid var(--color-border-info, #bee5eb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      color: var(--color-text-info, #0c5460);
      text-align: center;
    }

    .api-notice {
      background-color: var(--color-background-success, #d4edda);
      border: 1px solid var(--color-border-success, #c3e6cb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      color: var(--color-text-success, #155724);
      text-align: center;
    }

    .player-header {
      background-color: var(--color-background-secondary, #f8f9fa);
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      margin-bottom: var(--size-spacing-large, 2rem);
      text-align: center;
    }

    .player-header h1 {
      margin: 0 0 var(--size-spacing-small, 0.5rem) 0;
      color: var(--color-text-primary, #333);
      font-size: 2rem;
    }

    .player-subtitle {
      color: var(--color-text-secondary, #666);
      font-size: 1.1rem;
      margin: 0;
    }

    .player-info {
      background-color: white;
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      padding: var(--size-spacing-large, 1.5rem);
      background-color: var(--color-primary, #007bff);
      color: white;
      margin: 0;
      font-size: 1.2rem;
    }

    .icon {
      width: 1.5em;
      height: 1.5em;
      margin-right: var(--size-spacing-medium, 1rem);
      fill: currentColor;
    }

    .player-details {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 2rem);
      padding: var(--size-spacing-xlarge, 2rem);
    }

    .detail-label {
      font-weight: 600;
      color: var(--color-text-primary, #333);
      text-align: right;
    }

    .detail-value {
      color: var(--color-text-secondary, #555);
      margin: 0;
    }

    .navigation {
      margin-top: var(--size-spacing-large, 2rem);
      text-align: center;
    }

    .nav-button {
      display: inline-block;
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-background-secondary, #6c757d);
      color: white;
      text-decoration: none;
      border-radius: var(--border-radius, 0.25rem);
      margin: 0 var(--size-spacing-small, 0.5rem);
      transition: background-color 0.2s ease;
    }

    .nav-button:hover {
      background-color: var(--color-background-secondary-dark, #545b62);
    }

    .auth-message {
      text-align: center;
      padding: var(--size-spacing-xlarge, 2rem);
      background-color: var(--color-background-warning, #fff3cd);
      border: 1px solid var(--color-border-warning, #ffeaa7);
      border-radius: var(--border-radius, 0.25rem);
      color: var(--color-text-warning, #856404);
    }

    .auth-message a {
      color: var(--color-link, #007bff);
      text-decoration: none;
    }

    .auth-message a:hover {
      text-decoration: underline;
    }
  `;let re=bt;mt([Lr({attribute:"player-name"})],re.prototype,"playerName",2);mt([S()],re.prototype,"player",1);mt([S()],re.prototype,"loading",1);var Fi=Object.defineProperty,gt=(i,e,t,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&Fi(e,t,r),r};const _t=class _t extends $e{constructor(){super("nfl-dynasty:model"),this.formData={},this.loading=!1}get canSubmit(){return!!(this.formData.username&&this.formData.password)}handleChange(e){const t=e.target,s=t==null?void 0:t.name,r=t==null?void 0:t.value;s&&r!==void 0&&(this.formData={...this.formData,[s]:r})}async handleSubmit(e){if(e.preventDefault(),!!this.canSubmit){this.loading=!0,this.error=void 0;try{const t=await fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}),s=await t.json();if(!t.ok)throw new Error(s.error||`Login failed: ${t.statusText} (Status ${t.status})`);const{token:r}=s;if(r){localStorage.setItem("token",r),localStorage.setItem("auth:token",r);const o=new URLSearchParams(window.location.search).get("redirect_uri")||"/app",l=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r,redirect:o}]});this.dispatchEvent(l),window.history.pushState(null,"",o),window.dispatchEvent(new PopStateEvent("popstate"))}else throw new Error("Login successful, but no token received.")}catch(t){console.error("Login error:",t),this.error=t.message||"An unexpected error occurred during login."}finally{this.loading=!1}}}render(){return y`
      <div class="login-container">
        <div class="demo-notice">
          💡 <strong>Demo Credentials:</strong> Try username: <code>testuser2</code> with any password, or create a new account.
        </div>

        <div class="login-card">
          <div class="login-header">
            <h1>User Login</h1>
            <p>Sign in to access player data and your profile</p>
          </div>

          <form @submit=${this.handleSubmit} @input=${this.handleChange}>
            <label>
              <span class="label-text">Username:</span>
              <input 
                name="username" 
                type="text"
                autocomplete="username"
                placeholder="Enter your username"
                .value=${this.formData.username||""}
                required
              />
            </label>

            <label>
              <span class="label-text">Password:</span>
              <input 
                name="password" 
                type="password"
                autocomplete="current-password"
                placeholder="Enter your password"
                .value=${this.formData.password||""}
                required
              />
            </label>

            <button 
              type="submit" 
              class="submit-button"
              ?disabled=${!this.canSubmit||this.loading}
            >
              ${this.loading?"Signing in...":"Sign In"}
            </button>

            ${this.loading?y`<div class="loading">Authenticating...</div>`:""}
            ${this.error?y`<div class="error">${this.error}</div>`:""}
          </form>

          <div class="navigation">
            <a href="/app" class="nav-link">← Back to Home</a>
          </div>
        </div>
      </div>
    `}};_t.styles=we`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }

    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding-top: var(--size-spacing-xlarge, 3rem);
    }

    .login-card {
      background-color: var(--color-background-secondary, #f8f9fa);
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--size-spacing-large, 2rem);
    }

    .login-header h1 {
      color: var(--color-text-primary, #333);
      margin: 0 0 var(--size-spacing-small, 0.5rem) 0;
      font-size: 1.8rem;
    }

    .login-header p {
      color: var(--color-text-secondary, #666);
      margin: 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: var(--size-spacing-large, 1.5rem);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: var(--size-spacing-small, 0.5rem);
    }

    .label-text {
      font-weight: 600;
      color: var(--color-text-primary, #333);
    }

    input {
      padding: var(--size-spacing-medium, 1rem);
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    input:focus {
      outline: none;
      border-color: var(--color-primary, #007bff);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .submit-button {
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      background-color: var(--color-primary, #007bff);
      color: white;
      border: none;
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin-top: var(--size-spacing-medium, 1rem);
    }

    .submit-button:hover:not(:disabled) {
      background-color: var(--color-primary-dark, #0056b3);
    }

    .submit-button:disabled {
      background-color: var(--color-background-secondary, #6c757d);
      cursor: not-allowed;
    }

    .error {
      color: var(--color-error, #dc3545);
      background-color: var(--color-background-error, #f8d7da);
      border: 1px solid var(--color-border-error, #f5c6cb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-top: var(--size-spacing-medium, 1rem);
    }

    .loading {
      color: var(--color-text-secondary, #666);
      text-align: center;
      margin-top: var(--size-spacing-medium, 1rem);
    }

    .navigation {
      margin-top: var(--size-spacing-large, 2rem);
      text-align: center;
    }

    .nav-link {
      color: var(--color-link, #007bff);
      text-decoration: none;
      font-weight: 500;
    }

    .nav-link:hover {
      text-decoration: underline;
    }

    .demo-notice {
      background-color: var(--color-background-info, #d1ecf1);
      border: 1px solid var(--color-border-info, #bee5eb);
      border-radius: var(--border-radius, 0.25rem);
      padding: var(--size-spacing-medium, 1rem);
      margin-bottom: var(--size-spacing-large, 1.5rem);
      color: var(--color-text-info, #0c5460);
      text-align: center;
      font-size: 0.9rem;
    }
  `;let se=_t;gt([S()],se.prototype,"formData");gt([S()],se.prototype,"error");gt([S()],se.prototype,"loading");const Bi=[{path:"/app/login",view:()=>y`
      <login-view></login-view>
    `},{path:"/app/franchise/:name",view:i=>y`
      <franchise-view franchise-name=${i.name}></franchise-view>
    `},{path:"/app/player/:fullName",view:i=>y`
      <player-view player-name=${i.fullName}></player-view>
    `},{path:"/app/profile",view:()=>y`
      <profile-view></profile-view>
    `},{path:"/app",view:()=>y`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];si({"mu-auth":Ue.Provider,"mu-history":ls.Provider,"mu-store":class extends ds.Provider{constructor(){super(ki,Si,"nfl-dynasty:auth")}},"mu-switch":class extends ei.Element{constructor(){super(Bi,"nfl-dynasty:history","nfl-dynasty:auth")}},"nfl-dynasty-header":te,"home-view":tt,"profile-view":ye,"player-view":re,"login-view":se,"franchise-view":class extends HTMLElement{connectedCallback(){const e=this.getAttribute("franchise-name")||"Unknown";this.innerHTML=`
        <main style="padding: 2rem;">
          <h2>Franchise: ${e}</h2>
          <p>Franchise view placeholder.</p>
          <p>This will show dynasty information, key players, and championship history.</p>
          <a href="/app">← Back to Home</a>
        </main>
      `}}});
