function t(){}const n=t=>t;function e(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(e)}function i(t){return"function"==typeof t}function s(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}let a;function c(t,n){return a||(a=document.createElement("a")),a.href=n,t===a.href}function u(t,n){return t!=t?n==n:t!==n}function f(n,...e){if(null==n)return t;const r=n.subscribe(...e);return r.unsubscribe?()=>r.unsubscribe():r}function l(t){let n;return f(t,(t=>n=t))(),n}function d(t,n,e){t.$$.on_destroy.push(f(n,e))}function p(t,n,e,r){if(t){const o=h(t,n,e,r);return t[0](o)}}function h(t,n,e,r){return t[1]&&r?function(t,n){for(const e in n)t[e]=n[e];return t}(e.ctx.slice(),t[1](r(n))):e.ctx}function v(t,n,e,r){if(t[2]&&r){const o=t[2](r(e));if(void 0===n.dirty)return o;if("object"==typeof o){const t=[],e=Math.max(n.dirty.length,o.length);for(let r=0;e>r;r+=1)t[r]=n.dirty[r]|o[r];return t}return n.dirty|o}return n.dirty}function g(t,n,e,r,o,i){if(o){const s=h(n,e,r,i);t.p(s,o)}}function m(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let t=0;e>t;t++)n[t]=-1;return n}return-1}function y(t,n,e){return t.set(e),n}function w(n){return n&&i(n.destroy)?n.destroy:t}const L="undefined"!=typeof window;let b=L?()=>window.performance.now():()=>Date.now(),$=L?t=>requestAnimationFrame(t):t;const E=new Set;function x(t){E.forEach((n=>{n.c(t)||(E.delete(n),n.f())})),0!==E.size&&$(x)}function S(t){let n;return 0===E.size&&$(x),{promise:new Promise((e=>{E.add(n={c:t,f:e})})),abort(){E.delete(n)}}}function C(t,n){t.appendChild(n)}function M(t){if(!t)return document;const n=t.getRootNode?t.getRootNode():t.ownerDocument;return n&&n.host?n:t.ownerDocument}function k(t){const n=H("style");return function(t,n){C(t.head||t,n)}(M(t),n),n.sheet}function A(t,n,e){t.insertBefore(n,e||null)}function V(t){t.parentNode.removeChild(t)}function P(t,n){for(let e=0;t.length>e;e+=1)t[e]&&t[e].d(n)}function H(t){return document.createElement(t)}function j(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function W(t){return document.createTextNode(t)}function I(){return W(" ")}function R(){return W("")}function U(t,n,e,r){return t.addEventListener(n,e,r),()=>t.removeEventListener(n,e,r)}function O(t){return function(n){return n.stopPropagation(),t.call(this,n)}}function z(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function D(t){return""===t?null:+t}function T(t,n){t.wholeText!==(n=""+n)&&(t.data=n)}function N(t,n){t.value=n??""}function Z(t,n,e,r){null===e?t.style.removeProperty(n):t.style.setProperty(n,e,r?"important":"")}let B;function q(t,n){"static"===getComputedStyle(t).position&&(t.style.position="relative");const e=H("iframe");e.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),e.setAttribute("aria-hidden","true"),e.tabIndex=-1;const r=function(){if(void 0===B){B=!1;try{"undefined"!=typeof window&&window.parent&&window}catch(t){B=!0}}return B}();let o;return r?(e.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=U(window,"message",(t=>{t.source===e.contentWindow&&n()}))):(e.src="about:blank",e.onload=()=>{o=U(e.contentWindow,"resize",n)}),C(t,e),()=>{(r||o&&e.contentWindow)&&o(),V(e)}}function F(t,n,e){t.classList[e?"add":"remove"](n)}function X(t,n,e=!1){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,e,!1,n),r}const Y=new Map;let G,K=0;function J(t,n,e,r,o,i,s,a=0){const c=16.666/r;let u="{\n";for(let g=0;1>=g;g+=c){const t=n+(e-n)*i(g);u+=100*g+`%{${s(t,1-t)}}\n`}const f=u+`100% {${s(e,1-e)}}\n}`,l=`__svelte_${function(t){let n=5381,e=t.length;for(;e--;)n=(n<<5)-n^t.charCodeAt(e);return n>>>0}(f)}_${a}`,d=M(t),{stylesheet:p,rules:h}=Y.get(d)||function(t,n){const e={stylesheet:k(n),rules:{}};return Y.set(t,e),e}(d,t);h[l]||(h[l]=!0,p.insertRule(`@keyframes ${l} ${f}`,p.cssRules.length));const v=t.style.animation||"";return t.style.animation=`${v?`${v}, `:""}${l} ${r}ms linear ${o}ms 1 both`,K+=1,l}function Q(t,n){const e=(t.style.animation||"").split(", "),r=e.filter(n?t=>0>t.indexOf(n):t=>-1===t.indexOf("__svelte")),o=e.length-r.length;o&&(t.style.animation=r.join(", "),K-=o,K||$((()=>{K||(Y.forEach((t=>{const{stylesheet:n}=t;let e=n.cssRules.length;for(;e--;)n.deleteRule(e);t.rules={}})),Y.clear())})))}function tt(t){G=t}function nt(){if(!G)throw new Error("Function called outside component initialization");return G}function et(t){nt().$$.on_mount.push(t)}function rt(){const t=nt();return(n,e)=>{const r=t.$$.callbacks[n];if(r){const o=X(n,e);r.slice().forEach((n=>{n.call(t,o)}))}}}function ot(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach((t=>t.call(this,n)))}const it=[],st=[],at=[],ct=[],ut=Promise.resolve();let ft=!1;function lt(){ft||(ft=!0,ut.then(mt))}function dt(){return lt(),ut}function pt(t){at.push(t)}const ht=new Set;let vt,gt=0;function mt(){const t=G;do{for(;it.length>gt;){const t=it[gt];gt++,tt(t),yt(t.$$)}for(tt(null),it.length=0,gt=0;st.length;)st.pop()();for(let t=0;at.length>t;t+=1){const n=at[t];ht.has(n)||(ht.add(n),n())}at.length=0}while(it.length);for(;ct.length;)ct.pop()();ft=!1,ht.clear(),tt(t)}function yt(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(pt)}}function wt(){return vt||(vt=Promise.resolve(),vt.then((()=>{vt=null}))),vt}function Lt(t,n,e){t.dispatchEvent(X(`${n?"intro":"outro"}${e}`))}const bt=new Set;let $t;function Et(){$t={r:0,c:[],p:$t}}function xt(){$t.r||o($t.c),$t=$t.p}function St(t,n){t&&t.i&&(bt.delete(t),t.i(n))}function _t(t,n,e,r){if(t&&t.o){if(bt.has(t))return;bt.add(t),$t.c.push((()=>{bt.delete(t),r&&(e&&t.d(1),r())})),t.o(n)}}const Ct={duration:0};function Mt(e,r,o){let s,a,c=r(e,o),u=!1,f=0;function l(){s&&Q(e,s)}function d(){const{delay:r=0,duration:o=300,easing:i=n,tick:d=t,css:p}=c||Ct;p&&(s=J(e,0,1,o,r,i,p,f++)),d(0,1);const h=b()+r,v=h+o;a&&a.abort(),u=!0,pt((()=>Lt(e,!0,"start"))),a=S((t=>{if(u){if(t>=v)return d(1,0),Lt(e,!0,"end"),l(),u=!1;if(t>=h){const n=i((t-h)/o);d(n,1-n)}}return u}))}let p=!1;return{start(){p||(p=!0,Q(e),i(c)?(c=c(),wt().then(d)):d())},invalidate(){p=!1},end(){u&&(l(),u=!1)}}}function kt(e,r,s,a){let c=r(e,s),u=a?0:1,f=null,l=null,d=null;function p(){d&&Q(e,d)}function h(t,n){const e=t.b-u;return n*=Math.abs(e),{a:u,b:t.b,d:e,duration:n,start:t.start,end:t.start+n,group:t.group}}function v(r){const{delay:i=0,duration:s=300,easing:a=n,tick:v=t,css:g}=c||Ct,m={start:b()+i,b:r};r||(m.group=$t,$t.r+=1),f||l?l=m:(g&&(p(),d=J(e,u,r,s,i,a,g)),r&&v(0,1),f=h(m,s),pt((()=>Lt(e,r,"start"))),S((t=>(l&&t>l.start&&(f=h(l,s),l=null,Lt(e,f.b,"start"),g&&(p(),d=J(e,u,f.b,f.duration,0,a,c.css))),f&&(f.end>t?f.start>t||(u=f.a+f.d*a((t-f.start)/f.duration),v(u,1-u)):(v(u=f.b,1-u),Lt(e,f.b,"end"),l||(f.b?p():--f.group.r||o(f.group.c)),f=null)),!(!f&&!l)))))}return{run(t){i(c)?wt().then((()=>{c=c(),v(t)})):v(t)},end(){p(),f=l=null}}}const At="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function Vt(t,n){_t(t,1,1,(()=>{n.delete(t.key)}))}function Pt(t,n,e,r,o,i,s,a,c,u,f,l){let d=t.length,p=i.length,h=d;const v={};for(;h--;)v[t[h].key]=h;const g=[],m=new Map,y=new Map;for(h=p;h--;){const t=l(o,i,h),a=e(t);let c=s.get(a);c?r&&c.p(t,n):(c=u(a,t),c.c()),m.set(a,g[h]=c),a in v&&y.set(a,Math.abs(h-v[a]))}const w=new Set,L=new Set;function b(t){St(t,1),t.m(a,f),s.set(t.key,t),f=t.first,p--}for(;d&&p;){const n=g[p-1],e=t[d-1],r=n.key,o=e.key;n===e?(f=n.first,d--,p--):m.has(o)?!s.has(r)||w.has(r)?b(n):L.has(o)?d--:y.get(r)>y.get(o)?(L.add(r),b(n)):(w.add(o),d--):(c(e,s),d--)}for(;d--;){const n=t[d];m.has(n.key)||c(n,s)}for(;p;)b(g[p-1]);return g}function Ht(t){t&&t.c()}function jt(t,n,r,s){const{fragment:a,on_mount:c,on_destroy:u,after_update:f}=t.$$;a&&a.m(n,r),s||pt((()=>{const n=c.map(e).filter(i);u?u.push(...n):o(n),t.$$.on_mount=[]})),f.forEach(pt)}function Wt(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function It(n,e,i,s,a,c,u,f=[-1]){const l=G;tt(n);const d=n.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:r(),dirty:f,skip_bound:!1,root:e.target||l.$$.root};u&&u(d.root);let p=!1;if(d.ctx=i?i(n,e.props||{},((t,e,...r)=>{const o=r.length?r[0]:e;return d.ctx&&a(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),p&&function(t,n){-1===t.$$.dirty[0]&&(it.push(t),lt(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}(n,t)),e})):[],d.update(),p=!0,o(d.before_update),d.fragment=!!s&&s(d.ctx),e.target){if(e.hydrate){const t=Array.from(e.target.childNodes);d.fragment&&d.fragment.l(t),t.forEach(V)}else d.fragment&&d.fragment.c();e.intro&&St(n.$$.fragment),jt(n,e.target,e.anchor,e.customElement),mt()}tt(l)}class Rt{$destroy(){Wt(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){this.$$set&&0!==Object.keys(t).length&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const Ut=[];function Ot(t,n){return{subscribe:zt(t,n).subscribe}}function zt(n,e=t){let r;const o=new Set;function i(t){if(s(n,t)&&(n=t,r)){const t=!Ut.length;for(const e of o)e[1](),Ut.push(e,n);if(t){for(let t=0;Ut.length>t;t+=2)Ut[t][0](Ut[t+1]);Ut.length=0}}}return{set:i,update:function(t){i(t(n))},subscribe:function(s,a=t){const c=[s,a];return o.add(c),1===o.size&&(r=e(i)||t),s(n),()=>{o.delete(c),0===o.size&&(r(),r=null)}}}}function Dt(t,n){for(var e,r,o,i,s=t.length,a=Zt.bl_count,c=0;n>=c;c++)a[c]=0;for(c=1;s>c;c+=2)a[t[c]]++;var u=Zt.next_code;for(e=0,a[0]=0,r=1;n>=r;r++)u[r]=e=e+a[r-1]<<1;for(o=0;s>o;o+=2)0!=(i=t[o+1])&&(t[o]=u[i],u[i]++)}function Tt(t,n,e){for(var r=t.length,o=Zt.rev15,i=0;r>i;i+=2)if(0!=t[i+1])for(var s=t[i+1],a=i>>1<<4|s,c=n-s,u=t[i]<<c,f=u+(1<<c);u!=f;)e[o[u]>>>15-n]=a,u++}function Nt(t,n){for(var e=Zt.rev15,r=15-n,o=0;t.length>o;o+=2)t[o]=e[t[o]<<n-t[o+1]]>>>r}const Zt=(Bt=Uint16Array,qt=Uint32Array,{next_code:new Bt(16),bl_count:new Bt(16),ordr:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],of0:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],exb:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],ldef:new Bt(32),df0:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],dxb:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],ddef:new qt(32),flmap:new Bt(512),fltree:[],fdmap:new Bt(32),fdtree:[],lmap:new Bt(32768),ltree:[],ttree:[],dmap:new Bt(32768),dtree:[],imap:new Bt(512),itree:[],rev15:new Bt(32768),lhst:new qt(286),dhst:new qt(30),ihst:new qt(19),lits:new qt(15e3),strt:new Bt(65536),prev:new Bt(32768)});var Bt,qt;!function(){for(var t=0;32768>t;t++){var n=t;Zt.rev15[t]=((n=(4278255360&(n=(4042322160&(n=(3435973836&(n=(2863311530&n)>>>1|(1431655765&n)<<1))>>>2|(858993459&n)<<2))>>>4|(252645135&n)<<4))>>>8|(16711935&n)<<8)>>>16|n<<16)>>>17}function e(t,n,e){for(;0!=n--;)t.push(0,e)}for(t=0;32>t;t++)Zt.ldef[t]=Zt.of0[t]<<3|Zt.exb[t],Zt.ddef[t]=Zt.df0[t]<<4|Zt.dxb[t];e(Zt.fltree,144,8),e(Zt.fltree,112,9),e(Zt.fltree,24,7),e(Zt.fltree,8,8),Dt(Zt.fltree,9),Tt(Zt.fltree,9,Zt.flmap),Nt(Zt.fltree,9),e(Zt.fdtree,32,5),Dt(Zt.fdtree,5),Tt(Zt.fdtree,5,Zt.fdmap),Nt(Zt.fdtree,5),e(Zt.itree,19,0),e(Zt.ltree,286,0),e(Zt.dtree,30,0),e(Zt.ttree,320,0)}();const Ft={table:function(){for(var t=new Uint32Array(256),n=0;256>n;n++){for(var e=n,r=0;8>r;r++)1&e?e=3988292384^e>>>1:e>>>=1;t[n]=e}return t}(),update:function(t,n,e,r){for(var o=0;r>o;o++)t=Ft.table[255&(t^n[e+o])]^t>>>8;return t},crc:function(t,n,e){return 4294967295^Ft.update(4294967295,t,n,e)}};function Xt(t){const n=t-1;return n*n*n+1}function Yt(t,{delay:e=0,duration:r=400,easing:o=n}={}){const i=+getComputedStyle(t).opacity;return{delay:e,duration:r,easing:o,css:t=>"opacity: "+t*i}}function Gt(t,{delay:n=0,duration:e=400,easing:r=Xt,x:o=0,y:i=0,opacity:s=0}={}){const a=getComputedStyle(t),c=+a.opacity,u="none"===a.transform?"":a.transform,f=c*(1-s);return{delay:n,duration:e,easing:r,css:(t,n)=>`\n\t\t\ttransform: ${u} translate(${(1-t)*o}px, ${(1-t)*i}px);\n\t\t\topacity: ${c-f*n}`}}function Kt(t,{delay:n=0,duration:e=400,easing:r=Xt,start:o=0,opacity:i=0}={}){const s=getComputedStyle(t),a=+s.opacity,c="none"===s.transform?"":s.transform,u=1-o,f=a*(1-i);return{delay:n,duration:e,easing:r,css:(t,n)=>`\n\t\t\ttransform: ${c} scale(${1-u*n});\n\t\t\topacity: ${a-f*n}\n\t\t`}}var Jt="M23,12L20.56,14.78L20.9,18.46L17.29,19.28L15.4,22.46L12,21L8.6,22.47L6.71,19.29L3.1,18.47L3.44,14.78L1,12L3.44,9.21L3.1,5.53L6.71,4.72L8.6,1.54L12,3L15.4,1.54L17.29,4.72L20.9,5.54L20.56,9.22L23,12M20.33,12L18.5,9.89L18.74,7.1L16,6.5L14.58,4.07L12,5.18L9.42,4.07L8,6.5L5.26,7.09L5.5,9.88L3.67,12L5.5,14.1L5.26,16.9L8,17.5L9.42,19.93L12,18.81L14.58,19.92L16,17.5L18.74,16.89L18.5,14.1L20.33,12M11,15H13V17H11V15M11,7H13V13H11V7",Qt="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",tn="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z",nn="M10 11C9.43 11 9 11.45 9 12S9.43 13 10 13C10.54 13 11 12.55 11 12S10.54 11 10 11M10.5 2C15 2 15.09 5.57 12.73 6.75C11.74 7.24 11.3 8.29 11.11 9.22C11.59 9.42 12 9.73 12.33 10.13C16.03 8.13 20 8.92 20 12.5C20 17 16.43 17.1 15.26 14.73C14.76 13.74 13.7 13.3 12.77 13.11C12.57 13.59 12.26 14 11.86 14.34C13.85 18.03 13.06 22 9.5 22C5 22 4.9 18.42 7.26 17.24C8.24 16.75 8.68 15.71 8.88 14.79C8.39 14.59 7.96 14.27 7.64 13.87C3.95 15.85 0 15.07 0 11.5C0 7 3.56 6.89 4.73 9.26C5.23 10.25 6.28 10.68 7.21 10.87C7.4 10.39 7.72 9.97 8.13 9.65C6.14 5.96 6.93 2 10.5 2M22 13V7H24V13H22M22 17V15H24V17H22Z",en="M16,18H18V6H16M6,18L14.5,12L6,6V18Z",rn="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z",on="M16.46,9.41L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L16.46,14.61M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44M19,13V7H21V13H19M19,17V15H21V17H19Z";function sn(t,n,e){return t.addEventListener(n,e),()=>t.removeEventListener(n,e)}function an(t,n,e,r,o){t.dispatchEvent(new CustomEvent(`${n}${o}`,{detail:{event:e,pointersCount:r.length}}))}function cn(t,n={timeframe:300,minSwipeDistance:60,touchAction:"none"}){const e="swipe";let r,o,i,s;return function(t,n,e,r,o,i="none"){n.style.touchAction=i;let s=[];const a=sn(n,"pointerdown",(function(i){s.push(i),an(n,t,i,s,"down"),null==r||r(s,i);const a=i.pointerId;function c(e){a===e.pointerId&&(s=function(t,n){return n.filter((n=>t.pointerId!==n.pointerId))}(e,s),s.length||u(),an(n,t,e,s,"up"),null==o||o(s,e))}function u(){f(),l(),d(),p()}const f=sn(n,"pointermove",(r=>{s=s.map((t=>r.pointerId===t.pointerId?r:t)),an(n,t,r,s,"move"),null==e||e(s,r)})),l=sn(n,"lostpointercapture",(t=>{c(t)})),d=sn(n,"pointerup",(t=>{c(t)})),p=sn(n,"pointerleave",(e=>{s=[],u(),an(n,t,e,s,"up"),null==o||o(s,e)}))}));return{destroy:()=>{a()}}}(e,t,null,(function(t,n){o=n.clientX,i=n.clientY,r=Date.now(),1===t.length&&(s=n.target)}),(function(a,c){if("pointerup"===c.type&&0===a.length&&Date.now()-r<n.timeframe){const r=c.clientX-o,a=c.clientY-i,u=Math.abs(r),f=Math.abs(a);let l=null;u>=2*f&&u>n.minSwipeDistance?l=r>0?"right":"left":f>=2*u&&f>n.minSwipeDistance&&(l=a>0?"bottom":"top"),l&&t.dispatchEvent(new CustomEvent(e,{detail:{direction:l,target:s}}))}}),n.touchAction)}var un={exports:{}},fn=function(t,n,e,r){var o=t[0],i=t[1],s=!1;void 0===e&&(e=0),void 0===r&&(r=n.length);for(var a=(r-e)/2,c=0,u=a-1;a>c;u=c++){var f=n[e+2*c+0],l=n[e+2*c+1],d=n[e+2*u+1];l>i!=d>i&&(n[e+2*u+0]-f)*(i-l)/(d-l)+f>o&&(s=!s)}return s},ln=function(t,n,e,r){var o=t[0],i=t[1],s=!1;void 0===e&&(e=0),void 0===r&&(r=n.length);for(var a=r-e,c=0,u=a-1;a>c;u=c++){var f=n[c+e][0],l=n[c+e][1],d=n[u+e][1];l>i!=d>i&&(n[u+e][0]-f)*(i-l)/(d-l)+f>o&&(s=!s)}return s};un.exports=function(t,n,e,r){return n.length>0&&Array.isArray(n[0])?ln(t,n,e,r):fn(t,n,e,r)};var dn=un.exports.nested=ln;un.exports.flat=fn;try{self["workbox:window:6.4.1"]&&_()}catch(En){}function pn(t,n){return new Promise((function(e){var r=new MessageChannel;r.port1.onmessage=function(t){e(t.data)},t.postMessage(n,[r.port2])}))}function hn(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);n>e;e++)r[e]=t[e];return r}try{self["workbox:core:6.4.1"]&&_()}catch(En){}var vn=function(){var t=this;this.promise=new Promise((function(n,e){t.resolve=n,t.reject=e}))};function gn(t,n){var e=location.href;return new URL(t,e).href===new URL(n,e).href}var mn=function(t,n){this.type=t,Object.assign(this,n)};function yn(t,n,e){return e?n?n(t):t:(t&&t.then||(t=Promise.resolve(t)),n?t.then(n):t)}function wn(){}var Ln={type:"SKIP_WAITING"};function bn(t,n){if(!n)return t&&t.then?t.then(wn):Promise.resolve()}var $n=function(t){var n,e;function r(n,e){var r,o;return void 0===e&&(e={}),(r=t.call(this)||this).nn={},r.tn=0,r.rn=new vn,r.en=new vn,r.on=new vn,r.un=0,r.an=new Set,r.cn=function(){var t=r.fn,n=t.installing;r.tn>0||!gn(n.scriptURL,r.sn.toString())||performance.now()>r.un+6e4?(r.vn=n,t.removeEventListener("updatefound",r.cn)):(r.hn=n,r.an.add(n),r.rn.resolve(n)),++r.tn,n.addEventListener("statechange",r.ln)},r.ln=function(t){var n=r.fn,e=t.target,o=e.state,i=e===r.vn,s={sw:e,isExternal:i,originalEvent:t};!i&&r.mn&&(s.isUpdate=!0),r.dispatchEvent(new mn(o,s)),"installed"===o?r.wn=self.setTimeout((function(){"installed"===o&&n.waiting===e&&r.dispatchEvent(new mn("waiting",s))}),200):"activating"===o&&(clearTimeout(r.wn),i||r.en.resolve(e))},r.dn=function(t){var n=r.hn,e=n!==navigator.serviceWorker.controller;r.dispatchEvent(new mn("controlling",{isExternal:e,originalEvent:t,sw:n,isUpdate:r.mn})),e||r.on.resolve(n)},r.gn=(o=function(t){var n=t.data,e=t.ports,o=t.source;return yn(r.getSW(),(function(){r.an.has(o)&&r.dispatchEvent(new mn("message",{data:n,originalEvent:t,ports:e,sw:o}))}))},function(){for(var t=[],n=0;arguments.length>n;n++)t[n]=arguments[n];try{return Promise.resolve(o.apply(this,t))}catch(e){return Promise.reject(e)}}),r.sn=n,r.nn=e,navigator.serviceWorker.addEventListener("message",r.gn),r}e=t,(n=r).prototype=Object.create(e.prototype),n.prototype.constructor=n,n.__proto__=e;var o,i=r.prototype;return i.register=function(t){var n,e,r=(void 0===t?{}:t).immediate,o=void 0!==r&&r;try{var i=this;return n=function(){return i.mn=Boolean(navigator.serviceWorker.controller),i.yn=i.pn(),yn(i.bn(),(function(t){i.fn=t,i.yn&&(i.hn=i.yn,i.en.resolve(i.yn),i.on.resolve(i.yn),i.yn.addEventListener("statechange",i.ln,{once:!0}));var n=i.fn.waiting;return n&&gn(n.scriptURL,i.sn.toString())&&(i.hn=n,Promise.resolve().then((function(){i.dispatchEvent(new mn("waiting",{sw:n,wasWaitingBeforeRegister:!0}))})).then((function(){}))),i.hn&&(i.rn.resolve(i.hn),i.an.add(i.hn)),i.fn.addEventListener("updatefound",i.cn),navigator.serviceWorker.addEventListener("controllerchange",i.dn),i.fn}))},(e=function(){if(!o&&"complete"!==document.readyState)return bn(new Promise((function(t){return window.addEventListener("load",t)})))}())&&e.then?e.then(n):n()}catch(s){return Promise.reject(s)}},i.update=function(){try{return this.fn?bn(this.fn.update()):void 0}catch(En){return Promise.reject(En)}},i.getSW=function(){return void 0!==this.hn?Promise.resolve(this.hn):this.rn.promise},i.messageSW=function(t){try{return yn(this.getSW(),(function(n){return pn(n,t)}))}catch(En){return Promise.reject(En)}},i.messageSkipWaiting=function(){this.fn&&this.fn.waiting&&pn(this.fn.waiting,Ln)},i.pn=function(){var t=navigator.serviceWorker.controller;return t&&gn(t.scriptURL,this.sn.toString())?t:void 0},i.bn=function(){try{var t=this;return function(n,e){try{var r=yn(navigator.serviceWorker.register(t.sn,t.nn),(function(n){return t.un=performance.now(),n}))}catch(o){return e(o)}return r&&r.then?r.then(void 0,e):r}(0,(function(t){throw t}))}catch(n){return Promise.reject(n)}},(o=[{key:"active",get:function(){return this.en.promise}},{key:"controlling",get:function(){return this.on.promise}}])&&function(t,n){for(var e=0;n.length>e;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}(r.prototype,o),r}(function(){function t(){this.Pn=new Map}var n=t.prototype;return n.addEventListener=function(t,n){this.Sn(t).add(n)},n.removeEventListener=function(t,n){this.Sn(t).delete(n)},n.dispatchEvent=function(t){t.target=this;for(var n,e=function(t){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,n){if(t){if("string"==typeof t)return hn(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?hn(t,n):void 0}}(t))){n&&(t=n);var e=0;return function(){return t.length>e?{done:!1,value:t[e++]}:{done:!0}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=t[Symbol.iterator]()).next.bind(n)}(this.Sn(t.type));!(n=e()).done;)(0,n.value)(t)},n.Sn=function(t){return this.Pn.has(t)||this.Pn.set(t,new Set),this.Pn.get(t)},t}());export{rn as $,Yt as A,y as B,s as C,I as D,W as E,T as F,Et as G,xt as H,R as I,F as J,Kt as K,P as L,Pt as M,Vt as N,Gt as O,O as P,rt as Q,p as R,Rt as S,g as T,m as U,v as V,ot as W,o as X,N as Y,tn as Z,c as _,z as a,en as a0,D as a1,w as a2,cn as a3,Mt as a4,nn as a5,on as a6,Jt as a7,dn as a8,Qt as a9,At as aa,$n as ab,A as b,C as c,t as d,V as e,Ht as f,l as g,_t as h,It as i,Wt as j,H as k,Z as l,jt as m,u as n,pt as o,q as p,d as q,Ot as r,j as s,St as t,et as u,dt as v,zt as w,st as x,U as y,kt as z};
