(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();var F,kt;class he extends Error{}he.prototype.name="InvalidTokenError";function Wr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(e,t)=>{let s=t.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Kr(i){let e=i.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Wr(e)}catch{return atob(e)}}function rr(i,e){if(typeof i!="string")throw new he("Invalid token specified: must be a string");e||(e={});const t=e.header===!0?0:1,s=i.split(".")[t];if(typeof s!="string")throw new he(`Invalid token specified: missing part #${t+1}`);let r;try{r=Kr(s)}catch(n){throw new he(`Invalid token specified: invalid base64 for part #${t+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new he(`Invalid token specified: invalid json for part #${t+1} (${n.message})`)}}const Qr="mu:context",Ge=`${Qr}:change`;class Zr{constructor(e,t){this._proxy=Gr(e,t)}get value(){return this._proxy}set value(e){Object.assign(this._proxy,e)}apply(e){this.value=e(this.value)}}class it extends HTMLElement{constructor(e){super(),console.log("Constructing context provider",this),this.context=new Zr(e,this),this.style.display="contents"}attach(e){return this.addEventListener(Ge,e),e}detach(e){this.removeEventListener(Ge,e)}}function Gr(i,e){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let u=new CustomEvent(Ge,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:l,value:n}),e.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Xr(i,e){const t=sr(e,i);return new Promise((s,r)=>{if(t){const n=t.localName;customElements.whenDefined(n).then(()=>s(t))}else r({context:e,reason:`No provider for this context "${e}:`})})}function sr(i,e){const t=`[provides="${i}"]`;if(!e||e===document.getRootNode())return;const s=e.closest(t);if(s)return s;const r=e.getRootNode();if(r instanceof ShadowRoot)return sr(i,r.host)}class es extends CustomEvent{constructor(e,t="mu:message"){super(t,{bubbles:!0,composed:!0,detail:e})}}function ir(i="mu:message"){return(e,...t)=>e.dispatchEvent(new es(t,i))}class nt{constructor(e,t,s="service:message",r=!0){this._pending=[],this._context=t,this._update=e,this._eventType=s,this._running=r}attach(e){e.addEventListener(this._eventType,t=>{t.stopPropagation();const s=t.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(e=>this.process(e)))}apply(e){this._context.apply(e)}consume(e){this._running?this.process(e):(console.log(`Queueing ${this._eventType} message`,e),this._pending.push(e))}process(e){console.log(`Processing ${this._eventType} message`,e);const t=this._update(e,this.apply.bind(this));t&&t(this._context.value)}}function ts(i){return e=>({...e,...i})}const Xe="mu:auth:jwt",nr=class or extends nt{constructor(e,t){super((s,r)=>this.update(s,r),e,or.EVENT_TYPE),this._redirectForLogin=t}update(e,t){switch(e[0]){case"auth/signin":const{token:s,redirect:r}=e[1];return t(ss(s)),Ve(r);case"auth/signout":return t(is()),Ve(this._redirectForLogin);case"auth/redirect":return Ve(this._redirectForLogin,{next:window.location.href});default:const n=e[0];throw new Error(`Unhandled Auth message "${n}"`)}}};nr.EVENT_TYPE="auth:message";let ar=nr;const lr=ir(ar.EVENT_TYPE);function Ve(i,e={}){if(!i)return;const t=window.location.href,s=new URL(i,t);return Object.entries(e).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class rs extends it{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const e=W.authenticateFromLocalStorage();super({user:e,token:e.authenticated?e.token:void 0})}connectedCallback(){new ar(this.context,this.redirect).attach(this)}}class Y{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(e){return e.authenticated=!1,e.username="anonymous",localStorage.removeItem(Xe),e}}class W extends Y{constructor(e){super();const t=rr(e);console.log("Token payload",t),this.token=e,this.authenticated=!0,this.username=t.username}static authenticate(e){const t=new W(e);return localStorage.setItem(Xe,e),t}static authenticateFromLocalStorage(){const e=localStorage.getItem(Xe);return e?W.authenticate(e):new Y}}function ss(i){return ts({user:W.authenticate(i),token:i})}function is(){return i=>{const e=i.user;return{user:e&&e.authenticated?Y.deauthenticate(e):e,token:""}}}function ns(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function os(i){return i.authenticated?rr(i.token||""):{}}const Le=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:W,Provider:rs,User:Y,dispatch:lr,headers:ns,payload:os},Symbol.toStringTag,{value:"Module"}));function Ce(i,e,t){const s=i.target,r=new CustomEvent(e,{bubbles:!0,composed:!0,detail:t});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function et(i,e="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(e)})}const as=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:et,relay:Ce},Symbol.toStringTag,{value:"Module"}));function cr(i,...e){const t=i.map((r,n)=>n?[e[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(t),s}const ls=new DOMParser;function M(i,...e){const t=e.map(l),s=i.map((a,u)=>{if(u===0)return[a];const f=t[u-1];return f instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[f,a]}).flat().join(""),r=ls.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),t.forEach((a,u)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${u}`);if(f){const d=f.parentNode;d==null||d.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),o;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return Pt(a);case"bigint":case"boolean":case"number":case"symbol":return Pt(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,d=a.map(l);return f.replaceChildren(...d),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Pt(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function je(i,e={mode:"open"}){const t=i.attachShadow(e),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&t.appendChild(a.content.cloneNode(!0)),s}function n(...o){t.adoptedStyleSheets=o}}let cs=(F=class extends HTMLElement{constructor(){super(),this._state={},je(this).template(F.template).styles(F.styles),this.addEventListener("change",i=>{const e=i.target;if(e){const t=e.name,s=e.value;t&&(this._state[t]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Ce(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},hs(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},F.template=M`
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
  `,F.styles=cr`
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
  `,F);function hs(i,e){const t=Object.entries(i);for(const[s,r]of t){const n=e.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const ds=Object.freeze(Object.defineProperty({__proto__:null,Element:cs},Symbol.toStringTag,{value:"Module"})),hr=class dr extends nt{constructor(e){super((t,s)=>this.update(t,s),e,dr.EVENT_TYPE)}update(e,t){switch(e[0]){case"history/navigate":{const{href:s,state:r}=e[1];t(ps(s,r));break}case"history/redirect":{const{href:s,state:r}=e[1];t(fs(s,r));break}}}};hr.EVENT_TYPE="history:message";let ot=hr;class Ct extends it{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",e=>{const t=us(e);if(t){const s=new URL(t.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",e),e.preventDefault(),at(t,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",e=>{console.log("Popstate",e.state),this.context.value={location:document.location,state:e.state}})}connectedCallback(){new ot(this.context).attach(this)}}function us(i){const e=i.currentTarget,t=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(t);return r||void 0}else{for(let s=i.target;s;s===e?null:s.parentElement)if(t(s))return s;return}}function ps(i,e={}){return history.pushState(e,"",i),()=>({location:document.location,state:history.state})}function fs(i,e={}){return history.replaceState(e,"",i),()=>({location:document.location,state:history.state})}const at=ir(ot.EVENT_TYPE),ur=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ct,Provider:Ct,Service:ot,dispatch:at},Symbol.toStringTag,{value:"Module"}));class K{constructor(e,t){this._effects=[],this._target=e,this._contextLabel=t}observe(e=void 0){return new Promise((t,s)=>{if(this._provider){const r=new Ot(this._provider,e);this._effects.push(r),t(r)}else Xr(this._target,this._contextLabel).then(r=>{const n=new Ot(r,e);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),t(n)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(e){console.log("Received change event for observers",e,this._effects),e.stopPropagation(),this._effects.forEach(t=>t.runEffect())}}class Ot{constructor(e,t){this._provider=e,t&&this.setEffect(t)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(e){this._effectFn=e,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const pr=class fr extends HTMLElement{constructor(){super(),this._state={},this._user=new Y,this._authObserver=new K(this,"blazing:auth"),je(this).template(fr.template),this.form&&this.form.addEventListener("submit",e=>{if(e.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const t=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ms(r,this._state,t,this.authorization).then(n=>oe(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:t,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:t,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",e=>{const t=e.target;if(t){const s=t.name,r=t.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(e){this._state=e||{},oe(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}get authorization(){var e;return(e=this._user)!=null&&e.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:e})=>{e&&(this._user=e,this.src&&!this.isNew&&Nt(this.src,this.authorization).then(t=>{this._state=t,oe(t,this)}))})}attributeChangedCallback(e,t,s){switch(e){case"src":this.src&&s&&s!==t&&!this.isNew&&Nt(this.src,this.authorization).then(r=>{this._state=r,oe(r,this)});break;case"new":s&&(this._state={},oe({},this));break}}};pr.observedAttributes=["src","new","action"];pr.template=M`
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
  `;function Nt(i,e){return fetch(i,{headers:e}).then(t=>{if(t.status!==200)throw`Status: ${t.status}`;return t.json()}).catch(t=>console.log(`Failed to load form from ${i}:`,t))}function oe(i,e){const t=Object.entries(i);for(const[s,r]of t){const n=e.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function ms(i,e,t="PUT",s={}){return fetch(i,{method:t,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(e)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const mr=class gr extends nt{constructor(e,t){super(t,e,gr.EVENT_TYPE,!1)}};mr.EVENT_TYPE="mu:message";let vr=mr;class gs extends it{constructor(e,t,s){super(t),this._user=new Y,this._updateFn=e,this._authObserver=new K(this,s)}connectedCallback(){const e=new vr(this.context,(t,s)=>this._updateFn(t,s,this._user));e.attach(this),this._authObserver.observe(({user:t})=>{console.log("Store got auth",t),t&&(this._user=t),e.start()})}}const vs=Object.freeze(Object.defineProperty({__proto__:null,Provider:gs,Service:vr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ke=globalThis,lt=ke.ShadowRoot&&(ke.ShadyCSS===void 0||ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ct=Symbol(),Tt=new WeakMap;let yr=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ct)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(lt&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Tt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Tt.set(t,e))}return e}toString(){return this.cssText}};const ys=i=>new yr(typeof i=="string"?i:i+"",void 0,ct),bs=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new yr(t,i,ct)},_s=(i,e)=>{if(lt)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=ke.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},Rt=lt?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return ys(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$s,defineProperty:ws,getOwnPropertyDescriptor:As,getOwnPropertyNames:Es,getOwnPropertySymbols:xs,getPrototypeOf:Ss}=Object,Q=globalThis,zt=Q.trustedTypes,ks=zt?zt.emptyScript:"",Ut=Q.reactiveElementPolyfillSupport,de=(i,e)=>i,Oe={toAttribute(i,e){switch(e){case Boolean:i=i?ks:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},ht=(i,e)=>!$s(i,e),Mt={attribute:!0,type:String,converter:Oe,reflect:!1,hasChanged:ht};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Mt){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&ws(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:n}=As(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Mt}static _$Ei(){if(this.hasOwnProperty(de("elementProperties")))return;const e=Ss(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(de("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(de("properties"))){const t=this.properties,s=[...Es(t),...xs(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(Rt(r))}else e!==void 0&&t.push(Rt(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _s(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EC(e,t){var s;const r=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Oe).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(e,t){var s;const r=this.constructor,n=r._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Oe;this._$Em=n,this[n]=l.fromAttribute(t,o.type),this._$Em=null}}requestUpdate(e,t,s){if(e!==void 0){if(s??(s=this.constructor.getPropertyOptions(e)),!(s.hasChanged??ht)(this[e],t))return;this.P(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,s){this._$AL.has(e)||this._$AL.set(e,t),s.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),(e=this._$EO)==null||e.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(s)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[de("elementProperties")]=new Map,q[de("finalized")]=new Map,Ut==null||Ut({ReactiveElement:q}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ne=globalThis,Te=Ne.trustedTypes,Lt=Te?Te.createPolicy("lit-html",{createHTML:i=>i}):void 0,br="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,_r="?"+k,Ps=`<${_r}>`,j=document,me=()=>j.createComment(""),ge=i=>i===null||typeof i!="object"&&typeof i!="function",dt=Array.isArray,Cs=i=>dt(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ye=`[ 	
\f\r]`,ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,jt=/-->/g,It=/>/g,T=RegExp(`>|${Ye}(?:([^\\s"'>=/]+)(${Ye}*=${Ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ht=/'/g,Dt=/"/g,$r=/^(?:script|style|textarea|title)$/i,Os=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),le=Os(1),Z=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ft=new WeakMap,z=j.createTreeWalker(j,129);function wr(i,e){if(!dt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lt!==void 0?Lt.createHTML(e):e}const Ns=(i,e)=>{const t=i.length-1,s=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=ae;for(let l=0;l<t;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ae?f[1]==="!--"?o=jt:f[1]!==void 0?o=It:f[2]!==void 0?($r.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=T):f[3]!==void 0&&(o=T):o===T?f[0]===">"?(o=r??ae,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?T:f[3]==='"'?Dt:Ht):o===Dt||o===Ht?o=T:o===jt||o===It?o=ae:(o=T,r=void 0);const h=o===T&&i[l+1].startsWith("/>")?" ":"";n+=o===ae?a+Ps:d>=0?(s.push(u),a.slice(0,d)+br+a.slice(d)+k+h):a+k+(d===-2?l:h)}return[wr(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};let tt=class Ar{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let n=0,o=0;const l=e.length-1,a=this.parts,[u,f]=Ns(e,t);if(this.el=Ar.createElement(u,s),z.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=z.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(br)){const c=f[o++],h=r.getAttribute(d).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Rs:p[1]==="?"?zs:p[1]==="@"?Us:Ie}),r.removeAttribute(d)}else d.startsWith(k)&&(a.push({type:6,index:n}),r.removeAttribute(d));if($r.test(r.tagName)){const d=r.textContent.split(k),c=d.length-1;if(c>0){r.textContent=Te?Te.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],me()),z.nextNode(),a.push({type:2,index:++n});r.append(d[c],me())}}}else if(r.nodeType===8)if(r.data===_r)a.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(k,d+1))!==-1;)a.push({type:7,index:n}),d+=k.length-1}n++}}static createElement(e,t){const s=j.createElement("template");return s.innerHTML=e,s}};function G(i,e,t=i,s){var r,n;if(e===Z)return e;let o=s!==void 0?(r=t.o)==null?void 0:r[s]:t.l;const l=ge(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,t,s)),s!==void 0?(t.o??(t.o=[]))[s]=o:t.l=o),o!==void 0&&(e=G(i,o._$AS(i,e.values),o,s)),e}class Ts{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??j).importNode(t,!0);z.currentNode=r;let n=z.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new we(n,n.nextSibling,this,e):a.type===1?u=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(u=new Ms(n,this,e)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=z.nextNode(),o++)}return z.currentNode=j,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class we{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this.v}constructor(e,t,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),ge(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==Z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Cs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&ge(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){var t;const{values:s,_$litType$:r}=e,n=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=tt.createElement(wr(r.h,r.h[0]),this.options)),r);if(((t=this._$AH)==null?void 0:t._$AD)===n)this._$AH.p(s);else{const o=new Ts(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(e){let t=Ft.get(e.strings);return t===void 0&&Ft.set(e.strings,t=new tt(e)),t}k(e){dt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const n of e)r===t.length?t.push(s=new we(this.O(me()),this.O(me()),this,this.options)):s=t[r],s._$AI(n),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this.v=e,(t=this._$AP)==null||t.call(this,e))}}class Ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,r){const n=this.strings;let o=!1;if(n===void 0)e=G(this,e,t,0),o=!ge(e)||e!==this._$AH&&e!==Z,o&&(this._$AH=e);else{const l=e;let a,u;for(e=n[0],a=0;a<n.length-1;a++)u=G(this,l[s+a],t,a),u===Z&&(u=this._$AH[a]),o||(o=!ge(u)||u!==this._$AH[a]),u===_?e=_:e!==_&&(e+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!r&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Rs extends Ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}}class zs extends Ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}}class Us extends Ie{constructor(e,t,s,r,n){super(e,t,s,r,n),this.type=5}_$AI(e,t=this){if((e=G(this,e,t,0)??_)===Z)return;const s=this._$AH,r=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ms{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const Bt=Ne.litHtmlPolyfillSupport;Bt==null||Bt(tt,we),(Ne.litHtmlVersions??(Ne.litHtmlVersions=[])).push("3.2.0");const Ls=(i,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const n=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new we(e.insertBefore(me(),n),n,void 0,t??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let V=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=Ls(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return Z}};V._$litElement$=!0,V.finalized=!0,(kt=globalThis.litElementHydrateSupport)==null||kt.call(globalThis,{LitElement:V});const qt=globalThis.litElementPolyfillSupport;qt==null||qt({LitElement:V});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const js={attribute:!0,type:String,converter:Oe,reflect:!1,hasChanged:ht},Is=(i=js,e,t)=>{const{kind:s,metadata:r}=t;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(t.name,i),s==="accessor"){const{name:o}=t;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=t;return function(l){const a=this[o];e.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Er(i){return(e,t)=>typeof t=="object"?Is(i,e,t):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function xr(i){return Er({...i,state:!0,attribute:!1})}function Hs(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Ds(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Sr={};(function(i){var e=function(){var t=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,De){var A=y.length-1;switch(m){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},t(l,[2,4]),t(l,[2,5]),t(l,[2,6]),t(l,[2,7]),t(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},t(l,[2,10]),t(l,[2,11]),t(l,[2,12]),{1:[2,1]},t(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},t(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,De="",A=0,Et=0,qr=2,xt=1,Jr=m.slice.call(arguments,1),b=Object.create(this.lexer),O={yy:{}};for(var Fe in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Fe)&&(O.yy[Fe]=this.yy[Fe]);b.setInput(c,O.yy),O.yy.lexer=b,O.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var Be=b.yylloc;m.push(Be);var Vr=b.options&&b.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Yr=function(){var D;return D=b.lex()||xt,typeof D!="number"&&(D=h.symbols_[D]||D),D},w,N,E,qe,H={},xe,S,St,Se;;){if(N=p[p.length-1],this.defaultActions[N]?E=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Yr()),E=y[N]&&y[N][w]),typeof E>"u"||!E.length||!E[0]){var Je="";Se=[];for(xe in y[N])this.terminals_[xe]&&xe>qr&&Se.push("'"+this.terminals_[xe]+"'");b.showPosition?Je="Parse error on line "+(A+1)+`:
`+b.showPosition()+`
Expecting `+Se.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Je="Parse error on line "+(A+1)+": Unexpected "+(w==xt?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Je,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:Be,expected:Se})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(b.yytext),m.push(b.yylloc),p.push(E[1]),w=null,Et=b.yyleng,De=b.yytext,A=b.yylineno,Be=b.yylloc;break;case 2:if(S=this.productions_[E[1]][1],H.$=g[g.length-S],H._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Vr&&(H._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),qe=this.performAction.apply(H,[De,Et,A,O.yy,E[1],g,m].concat(Jr)),typeof qe<"u")return qe;S&&(p=p.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),p.push(this.productions_[E[1]][0]),g.push(H.$),m.push(H._$),St=y[p[p.length-2]][p[p.length-1]],p.push(St);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Ds<"u"&&(i.parser=e,i.Parser=e.Parser,i.parse=function(){return e.parse.apply(e,arguments)})})(Sr);function B(i){return function(e,t){return{displayName:i,props:e,children:t||[]}}}var kr={Root:B("Root"),Concat:B("Concat"),Literal:B("Literal"),Splat:B("Splat"),Param:B("Param"),Optional:B("Optional")},Pr=Sr.parser;Pr.yy=kr;var Fs=Pr,Bs=Object.keys(kr);function qs(i){return Bs.forEach(function(e){if(typeof i[e]>"u")throw new Error("No handler defined for "+e.displayName)}),{visit:function(e,t){return this.handlers[e.displayName].call(this,e,t)},handlers:i}}var Cr=qs,Js=Cr,Vs=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Or(i){this.captures=i.captures,this.re=i.re}Or.prototype.match=function(i){var e=this.re.exec(i),t={};if(e)return this.captures.forEach(function(s,r){typeof e[r+1]>"u"?t[s]=void 0:t[s]=decodeURIComponent(e[r+1])}),t};var Ys=Js({Concat:function(i){return i.children.reduce((function(e,t){var s=this.visit(t);return{re:e.re+s.re,captures:e.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Vs,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var e=this.visit(i.children[0]);return{re:"(?:"+e.re+")?",captures:e.captures}},Root:function(i){var e=this.visit(i.children[0]);return new Or({re:new RegExp("^"+e.re+"(?=\\?|$)"),captures:e.captures})}}),Ws=Ys,Ks=Cr,Qs=Ks({Concat:function(i,e){var t=i.children.map((function(s){return this.visit(s,e)}).bind(this));return t.some(function(s){return s===!1})?!1:t.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,e){return e[i.props.name]?e[i.props.name]:!1},Param:function(i,e){return e[i.props.name]?e[i.props.name]:!1},Optional:function(i,e){var t=this.visit(i.children[0],e);return t||""},Root:function(i,e){e=e||{};var t=this.visit(i.children[0],e);return t?encodeURI(t):!1}}),Zs=Qs,Gs=Fs,Xs=Ws,ei=Zs;Ae.prototype=Object.create(null);Ae.prototype.match=function(i){var e=Xs.visit(this.ast),t=e.match(i);return t||!1};Ae.prototype.reverse=function(i){return ei.visit(this.ast,i)};function Ae(i){var e;if(this?e=this:e=Object.create(Ae.prototype),typeof i>"u")throw new Error("A route spec is required");return e.spec=i,e.ast=Gs.parse(i),e}var ti=Ae,ri=ti,si=ri;const ii=Hs(si);var ni=Object.defineProperty,Nr=(i,e,t,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&ni(e,t,r),r};const Tr=class extends V{constructor(e,t,s=""){super(),this._cases=[],this._fallback=()=>le` <h1>Not Found</h1> `,this._cases=e.map(r=>({...r,route:new ii(r.path)})),this._historyObserver=new K(this,t),this._authObserver=new K(this,s)}connectedCallback(){this._historyObserver.observe(({location:e})=>{console.log("New location",e),e&&(this._match=this.matchRoute(e))}),this._authObserver.observe(({user:e})=>{this._user=e}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),le` <main>${(()=>{const t=this._match;if(t){if("view"in t)return this._user?t.auth&&t.auth!=="public"&&this._user&&!this._user.authenticated?(lr(this,"auth/redirect"),le` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",t.params,t.query),t.view(t.params||{},t.query)):le` <h1>Authenticating</h1> `;if("redirect"in t){const s=t.redirect;if(typeof s=="string")return this.redirect(s),le` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(e){e.has("_match")&&this.requestUpdate()}matchRoute(e){const{search:t,pathname:s}=e,r=new URLSearchParams(t),n=s+t;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(e){at(this,"history/redirect",{href:e})}};Tr.styles=bs`
    :host,
    main {
      display: contents;
    }
  `;let Re=Tr;Nr([xr()],Re.prototype,"_user");Nr([xr()],Re.prototype,"_match");const oi=Object.freeze(Object.defineProperty({__proto__:null,Element:Re,Switch:Re},Symbol.toStringTag,{value:"Module"})),ai=class Rr extends HTMLElement{constructor(){if(super(),je(this).template(Rr.template),this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name='actuator']");e&&e.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ai.template=M`
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
  `;const zr=class rt extends HTMLElement{constructor(){super(),this._array=[],je(this).template(rt.template).styles(rt.styles),this.addEventListener("input-array:add",e=>{e.stopPropagation(),this.append(Ur("",this._array.length))}),this.addEventListener("input-array:remove",e=>{e.stopPropagation(),this.removeClosestItem(e.target)}),this.addEventListener("change",e=>{e.stopPropagation();const t=e.target;if(t&&t!==this){const s=new Event("change",{bubbles:!0}),r=t.value,n=t.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",e=>{et(e,"button.add")?Ce(e,"input-array:add"):et(e,"button.remove")&&Ce(e,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(e){this._array=Array.isArray(e)?e:[e],li(this._array,this)}removeClosestItem(e){const t=e.closest("label");if(console.log("Removing closest item:",t,e),t){const s=Array.from(this.children).indexOf(t);this._array.splice(s,1),t.remove()}}};zr.template=M`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;zr.styles=cr`
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
  `;function li(i,e){e.replaceChildren(),i.forEach((t,s)=>e.append(Ur(t)))}function Ur(i,e){const t=i===void 0?M`<input />`:M`<input value="${i}" />`;return M`
    <label>
      ${t}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Mr(i){return Object.entries(i).map(([e,t])=>{customElements.get(e)||customElements.define(e,t)}),customElements}var ci=Object.defineProperty,hi=Object.getOwnPropertyDescriptor,di=(i,e,t,s)=>{for(var r=hi(e,t),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&ci(e,t,r),r};class ie extends V{constructor(e){super(),this._pending=[],this._observer=new K(this,e)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var e;super.connectedCallback(),(e=this._observer)==null||e.observe().then(t=>{console.log("View effect (initial)",this,t),this._context=t.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),t.setEffect(()=>{var s;if(console.log("View effect",this,t,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(e,t=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:e});this._context?(console.log("Dispatching message event",s),t.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([t,s]))}ref(e){return this.model?this.model[e]:void 0}}di([Er()],ie.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pe=globalThis,ut=Pe.ShadowRoot&&(Pe.ShadyCSS===void 0||Pe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pt=Symbol(),Jt=new WeakMap;let Lr=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==pt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ut&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Jt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Jt.set(t,e))}return e}toString(){return this.cssText}};const ui=i=>new Lr(typeof i=="string"?i:i+"",void 0,pt),ne=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Lr(t,i,pt)},pi=(i,e)=>{if(ut)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=Pe.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},Vt=ut?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return ui(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:fi,defineProperty:mi,getOwnPropertyDescriptor:gi,getOwnPropertyNames:vi,getOwnPropertySymbols:yi,getPrototypeOf:bi}=Object,C=globalThis,Yt=C.trustedTypes,_i=Yt?Yt.emptyScript:"",We=C.reactiveElementPolyfillSupport,ue=(i,e)=>i,ze={toAttribute(i,e){switch(e){case Boolean:i=i?_i:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},ft=(i,e)=>!fi(i,e),Wt={attribute:!0,type:String,converter:ze,reflect:!1,useDefault:!1,hasChanged:ft};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let J=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Wt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&mi(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:n}=gi(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Wt}static _$Ei(){if(this.hasOwnProperty(ue("elementProperties")))return;const e=bi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ue("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ue("properties"))){const t=this.properties,s=[...vi(t),...yi(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(Vt(r))}else e!==void 0&&t.push(Vt(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pi(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var n;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:ze).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){var n,o;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:ze;this._$Em=r,this[r]=a.fromAttribute(t,l.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(e,t,s){var r;if(e!==void 0){const n=this.constructor,o=this[e];if(s??(s=n.getPropertyOptions(e)),!((s.hasChanged??ft)(o,t)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[ue("elementProperties")]=new Map,J[ue("finalized")]=new Map,We==null||We({ReactiveElement:J}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pe=globalThis,Ue=pe.trustedTypes,Kt=Ue?Ue.createPolicy("lit-html",{createHTML:i=>i}):void 0,jr="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Ir="?"+P,$i=`<${Ir}>`,I=document,ve=()=>I.createComment(""),ye=i=>i===null||typeof i!="object"&&typeof i!="function",mt=Array.isArray,wi=i=>mt(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ke=`[ 	
\f\r]`,ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qt=/-->/g,Zt=/>/g,R=RegExp(`>|${Ke}(?:([^\\s"'>=/]+)(${Ke}*=${Ke}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Gt=/'/g,Xt=/"/g,Hr=/^(?:script|style|textarea|title)$/i,Ai=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),v=Ai(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),er=new WeakMap,U=I.createTreeWalker(I,129);function Dr(i,e){if(!mt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Kt!==void 0?Kt.createHTML(e):e}const Ei=(i,e)=>{const t=i.length-1,s=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=ce;for(let l=0;l<t;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ce?f[1]==="!--"?o=Qt:f[1]!==void 0?o=Zt:f[2]!==void 0?(Hr.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=r??ce,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?R:f[3]==='"'?Xt:Gt):o===Xt||o===Gt?o=R:o===Qt||o===Zt?o=ce:(o=R,r=void 0);const h=o===R&&i[l+1].startsWith("/>")?" ":"";n+=o===ce?a+$i:d>=0?(s.push(u),a.slice(0,d)+jr+a.slice(d)+P+h):a+P+(d===-2?l:h)}return[Dr(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class be{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let n=0,o=0;const l=e.length-1,a=this.parts,[u,f]=Ei(e,t);if(this.el=be.createElement(u,s),U.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=U.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(jr)){const c=f[o++],h=r.getAttribute(d).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Si:p[1]==="?"?ki:p[1]==="@"?Pi:He}),r.removeAttribute(d)}else d.startsWith(P)&&(a.push({type:6,index:n}),r.removeAttribute(d));if(Hr.test(r.tagName)){const d=r.textContent.split(P),c=d.length-1;if(c>0){r.textContent=Ue?Ue.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],ve()),U.nextNode(),a.push({type:2,index:++n});r.append(d[c],ve())}}}else if(r.nodeType===8)if(r.data===Ir)a.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(P,d+1))!==-1;)a.push({type:7,index:n}),d+=P.length-1}n++}}static createElement(e,t){const s=I.createElement("template");return s.innerHTML=e,s}}function ee(i,e,t=i,s){var o,l;if(e===X)return e;let r=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const n=ye(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=r:t._$Cl=r),r!==void 0&&(e=ee(i,r._$AS(i,e.values),r,s)),e}class xi{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??I).importNode(t,!0);U.currentNode=r;let n=U.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new Ee(n,n.nextSibling,this,e):a.type===1?u=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(u=new Ci(n,this,e)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=U.nextNode(),o++)}return U.currentNode=I,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Ee{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ee(this,e,t),ye(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==X&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):wi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==$&&ye(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){var n;const{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=be.createElement(Dr(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(t);else{const o=new xi(r,this),l=o.u(this.options);o.p(t),this.T(l),this._$AH=o}}_$AC(e){let t=er.get(e.strings);return t===void 0&&er.set(e.strings,t=new be(e)),t}k(e){mt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const n of e)r===t.length?t.push(s=new Ee(this.O(ve()),this.O(ve()),this,this.options)):s=t[r],s._$AI(n),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class He{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(e,t=this,s,r){const n=this.strings;let o=!1;if(n===void 0)e=ee(this,e,t,0),o=!ye(e)||e!==this._$AH&&e!==X,o&&(this._$AH=e);else{const l=e;let a,u;for(e=n[0],a=0;a<n.length-1;a++)u=ee(this,l[s+a],t,a),u===X&&(u=this._$AH[a]),o||(o=!ye(u)||u!==this._$AH[a]),u===$?e=$:e!==$&&(e+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!r&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Si extends He{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}}class ki extends He{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==$)}}class Pi extends He{constructor(e,t,s,r,n){super(e,t,s,r,n),this.type=5}_$AI(e,t=this){if((e=ee(this,e,t,0)??$)===X)return;const s=this._$AH,r=e===$&&s!==$||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ci{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){ee(this,e)}}const Qe=pe.litHtmlPolyfillSupport;Qe==null||Qe(be,Ee),(pe.litHtmlVersions??(pe.litHtmlVersions=[])).push("3.3.0");const Oi=(i,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const n=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new Ee(e.insertBefore(ve(),n),n,void 0,t??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=globalThis;class fe extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Oi(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return X}}var tr;fe._$litElement$=!0,fe.finalized=!0,(tr=L.litElementHydrateSupport)==null||tr.call(L,{LitElement:fe});const Ze=L.litElementPolyfillSupport;Ze==null||Ze({LitElement:fe});(L.litElementVersions??(L.litElementVersions=[])).push("4.2.0");const Ni={};function Ti(i,e,t){switch(i[0]){case"player/select":Ri(i[1],t).then(r=>e(n=>({...n,player:r,loading:!1}))).catch(r=>{console.error("Failed to load player:",r),e(n=>({...n,loading:!1}))}),e(r=>({...r,loading:!0}));break;case"players/load-all":zi(i[1],t).then(r=>e(n=>({...n,players:r,loading:!1}))).catch(r=>{console.error("Failed to load players:",r),e(n=>({...n,loading:!1}))}),e(r=>({...r,loading:!0}));break;case"profile/load":Ui(i[1]).then(r=>e(n=>({...n,profile:r,loading:!1}))).catch(r=>{console.error("Failed to load profile:",r),e(n=>({...n,loading:!1}))}),e(r=>({...r,loading:!0}));break;case"loading/set":e(r=>({...r,loading:i[1].loading}));break;case"player/save":Mi(i[1],t).then(r=>e(n=>({...n,player:r,loading:!1}))).then(()=>{const{onSuccess:r}=i[1];r&&r()}).catch(r=>{e(o=>({...o,loading:!1}));const{onFailure:n}=i[1];n&&n(r)}),e(r=>({...r,loading:!0}));break;case"profile/save":Li(i[1]).then(r=>e(n=>({...n,profile:r,loading:!1}))).then(()=>{const{onSuccess:r}=i[1];r&&r()}).catch(r=>{e(o=>({...o,loading:!1}));const{onFailure:n}=i[1];n&&n(r)}),e(r=>({...r,loading:!0}));break;default:const s=i;throw new Error(`Unhandled message "${s}"`)}}function Ri(i,e){return fetch(`/api/players/${i.fullName}`,{headers:Le.headers(e)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Player:",t),t})}function zi(i,e){return fetch("/api/players",{headers:Le.headers(e)}).then(t=>t.status===200?t.json():[]).then(t=>(console.log("All Players:",t),t||[]))}function Ui(i,e){return Promise.resolve({username:i.username})}function Mi(i,e){return fetch(`/api/players/${i.fullName}`,{method:"PUT",headers:{"Content-Type":"application/json",...Le.headers(e)},body:JSON.stringify(i.player)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to save player: ${t.status}`)}).then(t=>(console.log("Saved Player:",t),t))}function Li(i,e){return Promise.resolve(i.profile)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ji=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ii={attribute:!0,type:String,converter:ze,reflect:!1,hasChanged:ft},Hi=(i=Ii,e,t)=>{const{kind:s,metadata:r}=t;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(t.name,i),s==="accessor"){const{name:o}=t;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=t;return function(l){const a=this[o];e.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function gt(i){return(e,t)=>typeof t=="object"?Hi(i,e,t):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function x(i){return gt({...i,state:!0,attribute:!1})}var Di=Object.defineProperty,Fi=Object.getOwnPropertyDescriptor,vt=(i,e,t,s)=>{for(var r=s>1?void 0:s?Fi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&Di(e,t,r),r};let te=class extends fe{constructor(){super(...arguments),this.loggedIn=!1,this._authObserver=new K(this,"nfl-dynasty:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:i})=>{i&&i.authenticated?(this.loggedIn=!0,this.userid=i.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignInButton(){return v`
      <a href="/app/login" class="auth-link">Sign In</a>
    `}renderSignOutButton(){return v`
      <button @click=${this._handleSignOut} class="auth-button">Sign Out</button>
    `}_handleSignOut(i){as.relay(i,"auth:message",["auth/signout"])}render(){return v`
      <div class="header-content">
        <a href="/app">
          <h1 class="title">NFL Dynasty Tracker</h1>
          <p class="subtitle">Explore the greatest dynasties in NFL history</p>
        </a>
      </div>
      <div class="auth-controls">
        ${this.loggedIn?v`
              <span class="user-greeting">Hello, ${this.userid}</span>
              <a href="/app/profile" class="auth-link">Profile</a>
              ${this.renderSignOutButton()}
            `:this.renderSignInButton()}
      </div>
    `}};te.styles=ne`
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
  `;vt([x()],te.prototype,"userid",2);vt([x()],te.prototype,"loggedIn",2);te=vt([ji("nfl-dynasty-header")],te);const _t=class _t extends ie{constructor(){super("nfl-dynasty:model")}render(){return v`
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
    `}};_t.styles=ne`
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
  `;let st=_t;var Bi=Object.defineProperty,qi=Object.getOwnPropertyDescriptor,Fr=(i,e,t,s)=>{for(var r=qi(e,t),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&Bi(e,t,r),r};const $t=class $t extends ie{get profile(){return this.model.profile}get loading(){return this.model.loading||!1}constructor(){super("nfl-dynasty:model")}connectedCallback(){super.connectedCallback(),this.profile||this.dispatchMessage(["profile/load",{username:"current-user"}])}render(){return this.loading?v`
        <div class="loading">
          <p>Loading user information...</p>
        </div>
      `:this.profile?v`
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
    `:v`
        <div class="loading">
          <p>Redirecting to login...</p>
        </div>
      `}};$t.styles=ne`
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
  `;let _e=$t;Fr([x()],_e.prototype,"profile");Fr([x()],_e.prototype,"loading");var Ji=Object.defineProperty,Vi=Object.getOwnPropertyDescriptor,yt=(i,e,t,s)=>{for(var r=s>1?void 0:s?Vi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&Ji(e,t,r),r};const Yi={"Joe Montana":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Joe Montana",position:"Quarterback",yearsActive:"1979-1994",teams:"San Francisco 49ers (1979-1992), Kansas City Chiefs (1993-1994)",jerseyNumber:"#16 (49ers), #19 (Chiefs)",hofInductionYear:"2000",nicknames:"'Joe Cool', 'The Comeback Kid'"},"Joe-Montana":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Joe Montana",position:"Quarterback",yearsActive:"1979-1994",teams:"San Francisco 49ers (1979-1992), Kansas City Chiefs (1993-1994)",jerseyNumber:"#16 (49ers), #19 (Chiefs)",hofInductionYear:"2000",nicknames:"'Joe Cool', 'The Comeback Kid'"},"Jerry Rice":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Jerry Rice",position:"Wide Receiver",yearsActive:"1985-2004",teams:"San Francisco 49ers (1985-2000), Oakland Raiders (2001-2004), Seattle Seahawks (2004)",jerseyNumber:"#80",hofInductionYear:"2010",nicknames:"'Flash 80', 'World'"},"Jerry-Rice":{sectionTitle:"Player Information",iconRef:"icon-team-info",fullName:"Jerry Rice",position:"Wide Receiver",yearsActive:"1985-2004",teams:"San Francisco 49ers (1985-2000), Oakland Raiders (2001-2004), Seattle Seahawks (2004)",jerseyNumber:"#80",hofInductionYear:"2010",nicknames:"'Flash 80', 'World'"}},wt=class wt extends ie{get player(){return this.model.player}get loading(){return this.model.loading||!1}constructor(){super("nfl-dynasty:model")}attributeChangedCallback(e,t,s){super.attributeChangedCallback(e,t,s),e==="player-name"&&t!==s&&s&&this.dispatchMessage(["player/select",{fullName:s}])}connectedCallback(){super.connectedCallback(),this.playerName&&this.dispatchMessage(["player/select",{fullName:this.playerName}])}get fallbackPlayer(){return this.playerName?Yi[this.playerName]:void 0}get displayPlayer(){return this.player||this.fallbackPlayer}get usingFallback(){return!this.player&&!!this.fallbackPlayer}get availablePlayerNavigation(){return[{name:"Joe-Montana",displayName:"Joe Montana"},{name:"Jerry-Rice",displayName:"Jerry Rice"},{name:"Joseph Clifford Montana Jr.",displayName:"Joe Montana (Full)"}].filter(t=>t.name!==this.playerName).slice(0,2)}render(){if(this.loading)return v`
        <div class="player-container">
          <div class="loading">
            <h2>Loading player data...</h2>
            <p>Fetching information for ${this.playerName}</p>
          </div>
        </div>
      `;const e=this.displayPlayer;return e?v`
      <div class="player-container">
        ${this.usingFallback?v`
          <div class="demo-notice">
            📝 <strong>Demo Mode:</strong> Showing sample data. Sign in to access live data.
          </div>
        `:v`
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
            
            ${e.nicknames?v`
              <div class="detail-label">Nicknames:</div>
              <div class="detail-value">${e.nicknames}</div>
            `:""}
          </div>
        </div>

        <div class="navigation">
          <a href="/app" class="nav-button">← Back to Home</a>
          <a href="/app/player/${this.playerName}/edit" class="nav-button">Edit Player</a>
          ${this.availablePlayerNavigation.map(t=>v`
            <a href="/app/player/${t.name}" class="nav-button">${t.displayName}</a>
          `)}
          <a href="/app/profile" class="nav-button">Profile</a>
        </div>
      </div>
    `:v`
        <div class="player-container">
          <div class="error">
            <h2>Player Not Found</h2>
            <p>No player information available for "${this.playerName}".</p>
          </div>
          <div class="navigation">
            <a href="/app" class="nav-button">← Back to Home</a>
          </div>
        </div>
      `}};wt.styles=ne`
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
  `;let re=wt;yt([gt({attribute:"player-name"})],re.prototype,"playerName",2);yt([x()],re.prototype,"player",1);yt([x()],re.prototype,"loading",1);var Wi=Object.defineProperty,Ki=Object.getOwnPropertyDescriptor,Br=(i,e,t,s)=>{for(var r=s>1?void 0:s?Ki(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&Wi(e,t,r),r};const Me=class Me extends ie{get player(){return this.model.player}constructor(){super("nfl-dynasty:model")}connectedCallback(){super.connectedCallback(),this.playerName&&!this.player&&this.dispatchMessage(["player/select",{fullName:this.playerName}])}handleSubmit(e){this.dispatchMessage(["player/save",{fullName:this.playerName,player:e.detail,onSuccess:()=>ur.dispatch(this,"history/navigate",{href:`/app/player/${this.playerName}`}),onFailure:t=>console.log("ERROR:",t)}])}render(){var e,t,s,r,n,o,l,a;return v`
      <div class="edit-container">
        <h1>Edit Player: ${((e=this.player)==null?void 0:e.fullName)||this.playerName}</h1>
        
        <mu-form
          .init=${this.player}
          @mu-form:submit=${this.handleSubmit}>
          
          <label>
            <span>Full Name:</span>
            <input name="fullName" .value=${((t=this.player)==null?void 0:t.fullName)||""}>
          </label>
          
          <label>
            <span>Position:</span>
            <input name="position" .value=${((s=this.player)==null?void 0:s.position)||""}>
          </label>
          
          <label>
            <span>Years Active:</span>
            <input name="yearsActive" .value=${((r=this.player)==null?void 0:r.yearsActive)||""}>
          </label>
          
          <label>
            <span>Teams:</span>
            <input name="teams" .value=${((n=this.player)==null?void 0:n.teams)||""}>
          </label>
          
          <label>
            <span>Jersey Number:</span>
            <input name="jerseyNumber" .value=${((o=this.player)==null?void 0:o.jerseyNumber)||""}>
          </label>
          
          <label>
            <span>Hall of Fame Year:</span>
            <input name="hofInductionYear" .value=${((l=this.player)==null?void 0:l.hofInductionYear)||""}>
          </label>
          
          <label>
            <span>Nicknames:</span>
            <input name="nicknames" .value=${((a=this.player)==null?void 0:a.nicknames)||""}>
          </label>

          <div class="form-buttons">
            <a href="/app/player/${this.playerName}" class="cancel-btn">Cancel</a>
          </div>

        </mu-form>
      </div>
    `}};Me.uses=Mr({"mu-form":ds.Element}),Me.styles=ne`
    :host {
      display: block;
      padding: var(--size-spacing-large, 2rem);
    }

    .edit-container {
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      color: var(--color-text-primary, #333);
      margin-bottom: var(--size-spacing-large, 2rem);
    }

    mu-form {
      background: white;
      padding: var(--size-spacing-xlarge, 2rem);
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
    }

    label {
      display: block;
      margin-bottom: var(--size-spacing-large, 1.5rem);
    }

    label span {
      display: block;
      font-weight: 600;
      margin-bottom: var(--size-spacing-small, 0.5rem);
      color: var(--color-text-primary, #333);
    }

    input {
      width: 100%;
      padding: var(--size-spacing-medium, 1rem);
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
    }

    .form-buttons {
      display: flex;
      gap: var(--size-spacing-medium, 1rem);
      margin-top: var(--size-spacing-large, 2rem);
      align-items: center;
      clear: both;
    }

    .submit-btn, .cancel-btn {
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem);
      border: none;
      border-radius: var(--border-radius, 0.25rem);
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      display: inline-block;
      min-width: 120px;
    }

    .submit-btn {
      background-color: var(--color-primary, #007bff);
      color: white;
    }

    .cancel-btn {
      background-color: var(--color-background-secondary, #6c757d);
      color: white;
    }

    /* Style the mu-form's built-in submit button */
    mu-form button[type="submit"] {
      background-color: #dc3545 !important;
      color: white !important;
      padding: var(--size-spacing-medium, 1rem) var(--size-spacing-large, 1.5rem) !important;
      border: none !important;
      border-radius: var(--border-radius, 0.25rem) !important;
      font-size: 1rem !important;
      cursor: pointer !important;
      display: inline-block !important;
      float: left !important;
      min-width: 120px !important;
    }

    mu-form button[type="submit"]:hover {
      background-color: #c82333 !important;
    }

    /* Ensure form buttons container displays properly */
    mu-form .form-buttons {
      display: inline-block !important;
      margin-left: var(--size-spacing-medium, 1rem) !important;
      float: left !important;
    }

    /* Clear floats after buttons */
    mu-form::after {
      content: "";
      display: table;
      clear: both;
    }
  `;let $e=Me;Br([gt({attribute:"player-name"})],$e.prototype,"playerName",2);Br([x()],$e.prototype,"player",1);var Qi=Object.defineProperty,bt=(i,e,t,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(e,t,r)||r);return r&&Qi(e,t,r),r};const At=class At extends ie{constructor(){super("nfl-dynasty:model"),this.formData={},this.loading=!1}get canSubmit(){return!!(this.formData.username&&this.formData.password)}handleChange(e){const t=e.target,s=t==null?void 0:t.name,r=t==null?void 0:t.value;s&&r!==void 0&&(this.formData={...this.formData,[s]:r})}async handleSubmit(e){if(e.preventDefault(),!!this.canSubmit){this.loading=!0,this.error=void 0;try{const t=await fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}),s=await t.json();if(!t.ok)throw new Error(s.error||`Login failed: ${t.statusText} (Status ${t.status})`);const{token:r}=s;if(r){localStorage.setItem("token",r),localStorage.setItem("auth:token",r);const o=new URLSearchParams(window.location.search).get("redirect_uri")||"/app",l=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r,redirect:o}]});this.dispatchEvent(l),window.history.pushState(null,"",o),window.dispatchEvent(new PopStateEvent("popstate"))}else throw new Error("Login successful, but no token received.")}catch(t){console.error("Login error:",t),this.error=t.message||"An unexpected error occurred during login."}finally{this.loading=!1}}}render(){return v`
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

            ${this.loading?v`<div class="loading">Authenticating...</div>`:""}
            ${this.error?v`<div class="error">${this.error}</div>`:""}
          </form>

          <div class="navigation">
            <a href="/app" class="nav-link">← Back to Home</a>
          </div>
        </div>
      </div>
    `}};At.styles=ne`
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
  `;let se=At;bt([x()],se.prototype,"formData");bt([x()],se.prototype,"error");bt([x()],se.prototype,"loading");const Zi=[{path:"/app/login",view:()=>v`
      <login-view></login-view>
    `},{path:"/app/franchise/:name",view:i=>v`
      <franchise-view franchise-name=${i.name}></franchise-view>
    `},{path:"/app/player/:fullName/edit",view:i=>v`
      <player-edit-view player-name=${i.fullName}></player-edit-view>
    `},{path:"/app/player/:fullName",view:i=>v`
      <player-view player-name=${i.fullName}></player-view>
    `},{path:"/app/profile",view:()=>v`
      <profile-view></profile-view>
    `},{path:"/app",view:()=>v`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];Mr({"mu-auth":Le.Provider,"mu-history":ur.Provider,"mu-store":class extends vs.Provider{constructor(){super(Ti,Ni,"nfl-dynasty:auth")}},"mu-switch":class extends oi.Element{constructor(){super(Zi,"nfl-dynasty:history","nfl-dynasty:auth")}},"nfl-dynasty-header":te,"home-view":st,"profile-view":_e,"player-view":re,"player-edit-view":$e,"login-view":se,"franchise-view":class extends HTMLElement{connectedCallback(){const e=this.getAttribute("franchise-name")||"Unknown";this.innerHTML=`
        <main style="padding: 2rem;">
          <h2>Franchise: ${e}</h2>
          <p>Franchise view placeholder.</p>
          <p>This will show dynasty information, key players, and championship history.</p>
          <a href="/app">← Back to Home</a>
        </main>
      `}}});
