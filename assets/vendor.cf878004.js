function t(){}const n=t=>t;function e(t,n){for(const e in n)t[e]=n[e];return t}function r(t){return t()}function o(){return Object.create(null)}function i(t){t.forEach(r)}function s(t){return"function"==typeof t}function a(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}let c;function u(t,n){return c||(c=document.createElement("a")),c.href=n,t===c.href}function f(t,n){return t!=t?n==n:t!==n}function l(n,...e){if(null==n)return t;const r=n.subscribe(...e);return r.unsubscribe?()=>r.unsubscribe():r}function d(t){let n;return l(t,(t=>n=t))(),n}function p(t,n,e){t.$$.on_destroy.push(l(n,e))}function h(t,n,e,r){if(t){const o=v(t,n,e,r);return t[0](o)}}function v(t,n,r,o){return t[1]&&o?e(r.ctx.slice(),t[1](o(n))):r.ctx}function g(t,n,e,r){if(t[2]&&r){const o=t[2](r(e));if(void 0===n.dirty)return o;if("object"==typeof o){const t=[],e=Math.max(n.dirty.length,o.length);for(let r=0;e>r;r+=1)t[r]=n.dirty[r]|o[r];return t}return n.dirty|o}return n.dirty}function m(t,n,e,r,o,i){if(o){const s=v(n,e,r,i);t.p(s,o)}}function y(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let t=0;e>t;t++)n[t]=-1;return n}return-1}function w(t,n,e){return t.set(e),n}function b(n){return n&&s(n.destroy)?n.destroy:t}const $="undefined"!=typeof window;let E=$?()=>window.performance.now():()=>Date.now(),x=$?t=>requestAnimationFrame(t):t;const S=new Set;function k(t){S.forEach((n=>{n.c(t)||(S.delete(n),n.f())})),0!==S.size&&x(k)}function A(t){let n;return 0===S.size&&x(k),{promise:new Promise((e=>{S.add(n={c:t,f:e})})),abort(){S.delete(n)}}}function P(t,n){t.appendChild(n)}function j(t){if(!t)return document;const n=t.getRootNode?t.getRootNode():t.ownerDocument;return n&&n.host?n:t.ownerDocument}function L(t){const n=I("style");return function(t,n){P(t.head||t,n)}(j(t),n),n.sheet}function C(t,n,e){t.insertBefore(n,e||null)}function W(t){t.parentNode.removeChild(t)}function M(t,n){for(let e=0;t.length>e;e+=1)t[e]&&t[e].d(n)}function I(t){return document.createElement(t)}function O(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function R(t){return document.createTextNode(t)}function U(){return R(" ")}function D(){return R("")}function T(t,n,e,r){return t.addEventListener(n,e,r),()=>t.removeEventListener(n,e,r)}function z(t){return function(n){return n.stopPropagation(),t.call(this,n)}}function N(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function B(t){return""===t?null:+t}function q(t,n){t.wholeText!==(n=""+n)&&(t.data=n)}function F(t,n){t.value=n??""}function X(t,n,e,r){null===e?t.style.removeProperty(n):t.style.setProperty(n,e,r?"important":"")}let Y;function G(t,n){"static"===getComputedStyle(t).position&&(t.style.position="relative");const e=I("iframe");e.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),e.setAttribute("aria-hidden","true"),e.tabIndex=-1;const r=function(){if(void 0===Y){Y=!1;try{"undefined"!=typeof window&&window.parent&&window}catch(t){Y=!0}}return Y}();let o;return r?(e.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=T(window,"message",(t=>{t.source===e.contentWindow&&n()}))):(e.src="about:blank",e.onload=()=>{o=T(e.contentWindow,"resize",n)}),P(t,e),()=>{(r||o&&e.contentWindow)&&o(),W(e)}}function K(t,n,e){t.classList[e?"add":"remove"](n)}function H(t,n,e=!1){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,e,!1,n),r}const J=new Map;let Q,V=0;function Z(t,n,e,r,o,i,s,a=0){const c=16.666/r;let u="{\n";for(let g=0;1>=g;g+=c){const t=n+(e-n)*i(g);u+=100*g+`%{${s(t,1-t)}}\n`}const f=u+`100% {${s(e,1-e)}}\n}`,l=`__svelte_${function(t){let n=5381,e=t.length;for(;e--;)n=(n<<5)-n^t.charCodeAt(e);return n>>>0}(f)}_${a}`,d=j(t),{stylesheet:p,rules:h}=J.get(d)||function(t,n){const e={stylesheet:L(n),rules:{}};return J.set(t,e),e}(d,t);h[l]||(h[l]=!0,p.insertRule(`@keyframes ${l} ${f}`,p.cssRules.length));const v=t.style.animation||"";return t.style.animation=`${v?`${v}, `:""}${l} ${r}ms linear ${o}ms 1 both`,V+=1,l}function tt(t,n){const e=(t.style.animation||"").split(", "),r=e.filter(n?t=>0>t.indexOf(n):t=>-1===t.indexOf("__svelte")),o=e.length-r.length;o&&(t.style.animation=r.join(", "),V-=o,V||x((()=>{V||(J.forEach((t=>{const{stylesheet:n}=t;let e=n.cssRules.length;for(;e--;)n.deleteRule(e);t.rules={}})),J.clear())})))}function nt(t){Q=t}function et(){if(!Q)throw new Error("Function called outside component initialization");return Q}function rt(t){et().$$.on_mount.push(t)}function ot(){const t=et();return(n,e)=>{const r=t.$$.callbacks[n];if(r){const o=H(n,e);r.slice().forEach((n=>{n.call(t,o)}))}}}function it(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach((t=>t.call(this,n)))}const st=[],at=[],ct=[],ut=[],ft=Promise.resolve();let lt=!1;function dt(){lt||(lt=!0,ft.then(yt))}function pt(){return dt(),ft}function ht(t){ct.push(t)}const vt=new Set;let gt,mt=0;function yt(){const t=Q;do{for(;st.length>mt;){const t=st[mt];mt++,nt(t),wt(t.$$)}for(nt(null),st.length=0,mt=0;at.length;)at.pop()();for(let t=0;ct.length>t;t+=1){const n=ct[t];vt.has(n)||(vt.add(n),n())}ct.length=0}while(st.length);for(;ut.length;)ut.pop()();lt=!1,vt.clear(),nt(t)}function wt(t){if(null!==t.fragment){t.update(),i(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(ht)}}function bt(){return gt||(gt=Promise.resolve(),gt.then((()=>{gt=null}))),gt}function $t(t,n,e){t.dispatchEvent(H(`${n?"intro":"outro"}${e}`))}const Et=new Set;let xt;function _t(){xt={r:0,c:[],p:xt}}function St(){xt.r||i(xt.c),xt=xt.p}function kt(t,n){t&&t.i&&(Et.delete(t),t.i(n))}function At(t,n,e,r){if(t&&t.o){if(Et.has(t))return;Et.add(t),xt.c.push((()=>{Et.delete(t),r&&(e&&t.d(1),r())})),t.o(n)}}const Pt={duration:0};function jt(e,r,o){let i,a,c=r(e,o),u=!1,f=0;function l(){i&&tt(e,i)}function d(){const{delay:r=0,duration:o=300,easing:s=n,tick:d=t,css:p}=c||Pt;p&&(i=Z(e,0,1,o,r,s,p,f++)),d(0,1);const h=E()+r,v=h+o;a&&a.abort(),u=!0,ht((()=>$t(e,!0,"start"))),a=A((t=>{if(u){if(t>=v)return d(1,0),$t(e,!0,"end"),l(),u=!1;if(t>=h){const n=s((t-h)/o);d(n,1-n)}}return u}))}let p=!1;return{start(){p||(p=!0,tt(e),s(c)?(c=c(),bt().then(d)):d())},invalidate(){p=!1},end(){u&&(l(),u=!1)}}}function Lt(e,r,o,a){let c=r(e,o),u=a?0:1,f=null,l=null,d=null;function p(){d&&tt(e,d)}function h(t,n){const e=t.b-u;return n*=Math.abs(e),{a:u,b:t.b,d:e,duration:n,start:t.start,end:t.start+n,group:t.group}}function v(r){const{delay:o=0,duration:s=300,easing:a=n,tick:v=t,css:g}=c||Pt,m={start:E()+o,b:r};r||(m.group=xt,xt.r+=1),f||l?l=m:(g&&(p(),d=Z(e,u,r,s,o,a,g)),r&&v(0,1),f=h(m,s),ht((()=>$t(e,r,"start"))),A((t=>(l&&t>l.start&&(f=h(l,s),l=null,$t(e,f.b,"start"),g&&(p(),d=Z(e,u,f.b,f.duration,0,a,c.css))),f&&(f.end>t?f.start>t||(u=f.a+f.d*a((t-f.start)/f.duration),v(u,1-u)):(v(u=f.b,1-u),$t(e,f.b,"end"),l||(f.b?p():--f.group.r||i(f.group.c)),f=null)),!(!f&&!l)))))}return{run(t){s(c)?bt().then((()=>{c=c(),v(t)})):v(t)},end(){p(),f=l=null}}}const Ct="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function Wt(t,n){At(t,1,1,(()=>{n.delete(t.key)}))}function Mt(t,n,e,r,o,i,s,a,c,u,f,l){let d=t.length,p=i.length,h=d;const v={};for(;h--;)v[t[h].key]=h;const g=[],m=new Map,y=new Map;for(h=p;h--;){const t=l(o,i,h),a=e(t);let c=s.get(a);c?r&&c.p(t,n):(c=u(a,t),c.c()),m.set(a,g[h]=c),a in v&&y.set(a,Math.abs(h-v[a]))}const w=new Set,b=new Set;function $(t){kt(t,1),t.m(a,f),s.set(t.key,t),f=t.first,p--}for(;d&&p;){const n=g[p-1],e=t[d-1],r=n.key,o=e.key;n===e?(f=n.first,d--,p--):m.has(o)?!s.has(r)||w.has(r)?$(n):b.has(o)?d--:y.get(r)>y.get(o)?(b.add(r),$(n)):(w.add(o),d--):(c(e,s),d--)}for(;d--;){const n=t[d];m.has(n.key)||c(n,s)}for(;p;)$(g[p-1]);return g}function It(t){t&&t.c()}function Ot(t,n,e,o){const{fragment:a,on_mount:c,on_destroy:u,after_update:f}=t.$$;a&&a.m(n,e),o||ht((()=>{const n=c.map(r).filter(s);u?u.push(...n):i(n),t.$$.on_mount=[]})),f.forEach(ht)}function Rt(t,n){const e=t.$$;null!==e.fragment&&(i(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function Ut(n,e,r,s,a,c,u,f=[-1]){const l=Q;nt(n);const d=n.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:o(),dirty:f,skip_bound:!1,root:e.target||l.$$.root};u&&u(d.root);let p=!1;if(d.ctx=r?r(n,e.props||{},((t,e,...r)=>{const o=r.length?r[0]:e;return d.ctx&&a(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),p&&function(t,n){-1===t.$$.dirty[0]&&(st.push(t),dt(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}(n,t)),e})):[],d.update(),p=!0,i(d.before_update),d.fragment=!!s&&s(d.ctx),e.target){if(e.hydrate){const t=Array.from(e.target.childNodes);d.fragment&&d.fragment.l(t),t.forEach(W)}else d.fragment&&d.fragment.c();e.intro&&kt(n.$$.fragment),Ot(n,e.target,e.anchor,e.customElement),yt()}nt(l)}class Dt{$destroy(){Rt(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){this.$$set&&0!==Object.keys(t).length&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Tt(t){const n=t-1;return n*n*n+1}function zt(t,{delay:e=0,duration:r=400,easing:o=n}={}){const i=+getComputedStyle(t).opacity;return{delay:e,duration:r,easing:o,css:t=>"opacity: "+t*i}}function Nt(t,{delay:n=0,duration:e=400,easing:r=Tt,x:o=0,y:i=0,opacity:s=0}={}){const a=getComputedStyle(t),c=+a.opacity,u="none"===a.transform?"":a.transform,f=c*(1-s);return{delay:n,duration:e,easing:r,css:(t,n)=>`\n\t\t\ttransform: ${u} translate(${(1-t)*o}px, ${(1-t)*i}px);\n\t\t\topacity: ${c-f*n}`}}function Bt(t,{delay:n=0,duration:e=400,easing:r=Tt,start:o=0,opacity:i=0}={}){const s=getComputedStyle(t),a=+s.opacity,c="none"===s.transform?"":s.transform,u=1-o,f=a*(1-i);return{delay:n,duration:e,easing:r,css:(t,n)=>`\n\t\t\ttransform: ${c} scale(${1-u*n});\n\t\t\topacity: ${a-f*n}\n\t\t`}}const qt=[];function Ft(t,n){return{subscribe:Xt(t,n).subscribe}}function Xt(n,e=t){let r;const o=new Set;function i(t){if(a(n,t)&&(n=t,r)){const t=!qt.length;for(const e of o)e[1](),qt.push(e,n);if(t){for(let t=0;qt.length>t;t+=2)qt[t][0](qt[t+1]);qt.length=0}}}return{set:i,update:function(t){i(t(n))},subscribe:function(s,a=t){const c=[s,a];return o.add(c),1===o.size&&(r=e(i)||t),s(n),()=>{o.delete(c),0===o.size&&(r(),r=null)}}}}function Yt(t,n){for(var e,r,o,i,s=t.length,a=Ht.bl_count,c=0;n>=c;c++)a[c]=0;for(c=1;s>c;c+=2)a[t[c]]++;var u=Ht.next_code;for(e=0,a[0]=0,r=1;n>=r;r++)u[r]=e=e+a[r-1]<<1;for(o=0;s>o;o+=2)0!=(i=t[o+1])&&(t[o]=u[i],u[i]++)}function Gt(t,n,e){for(var r=t.length,o=Ht.rev15,i=0;r>i;i+=2)if(0!=t[i+1])for(var s=t[i+1],a=i>>1<<4|s,c=n-s,u=t[i]<<c,f=u+(1<<c);u!=f;)e[o[u]>>>15-n]=a,u++}function Kt(t,n){for(var e=Ht.rev15,r=15-n,o=0;t.length>o;o+=2)t[o]=e[t[o]<<n-t[o+1]]>>>r}const Ht=(Jt=Uint16Array,Qt=Uint32Array,{next_code:new Jt(16),bl_count:new Jt(16),ordr:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],of0:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],exb:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],ldef:new Jt(32),df0:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],dxb:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],ddef:new Qt(32),flmap:new Jt(512),fltree:[],fdmap:new Jt(32),fdtree:[],lmap:new Jt(32768),ltree:[],ttree:[],dmap:new Jt(32768),dtree:[],imap:new Jt(512),itree:[],rev15:new Jt(32768),lhst:new Qt(286),dhst:new Qt(30),ihst:new Qt(19),lits:new Qt(15e3),strt:new Jt(65536),prev:new Jt(32768)});var Jt,Qt;!function(){for(var t=0;32768>t;t++){var n=t;Ht.rev15[t]=((n=(4278255360&(n=(4042322160&(n=(3435973836&(n=(2863311530&n)>>>1|(1431655765&n)<<1))>>>2|(858993459&n)<<2))>>>4|(252645135&n)<<4))>>>8|(16711935&n)<<8)>>>16|n<<16)>>>17}function e(t,n,e){for(;0!=n--;)t.push(0,e)}for(t=0;32>t;t++)Ht.ldef[t]=Ht.of0[t]<<3|Ht.exb[t],Ht.ddef[t]=Ht.df0[t]<<4|Ht.dxb[t];e(Ht.fltree,144,8),e(Ht.fltree,112,9),e(Ht.fltree,24,7),e(Ht.fltree,8,8),Yt(Ht.fltree,9),Gt(Ht.fltree,9,Ht.flmap),Kt(Ht.fltree,9),e(Ht.fdtree,32,5),Yt(Ht.fdtree,5),Gt(Ht.fdtree,5,Ht.fdmap),Kt(Ht.fdtree,5),e(Ht.itree,19,0),e(Ht.ltree,286,0),e(Ht.dtree,30,0),e(Ht.ttree,320,0)}();const Vt={table:function(){for(var t=new Uint32Array(256),n=0;256>n;n++){for(var e=n,r=0;8>r;r++)1&e?e=3988292384^e>>>1:e>>>=1;t[n]=e}return t}(),update:function(t,n,e,r){for(var o=0;r>o;o++)t=Vt.table[255&(t^n[e+o])]^t>>>8;return t},crc:function(t,n,e){return 4294967295^Vt.update(4294967295,t,n,e)}};function Zt(t){return"[object Date]"===Object.prototype.toString.call(t)}function tn(t,n){if(t===n||t!=t)return()=>t;const e=typeof t;if(e!==typeof n||Array.isArray(t)!==Array.isArray(n))throw new Error("Cannot interpolate values of different type");if(Array.isArray(t)){const e=n.map(((n,e)=>tn(t[e],n)));return t=>e.map((n=>n(t)))}if("object"===e){if(!t||!n)throw new Error("Object cannot be null");if(Zt(t)&&Zt(n)){t=t.getTime();const e=(n=n.getTime())-t;return n=>new Date(t+n*e)}const e=Object.keys(n),r={};return e.forEach((e=>{r[e]=tn(t[e],n[e])})),t=>{const n={};return e.forEach((e=>{n[e]=r[e](t)})),n}}if("number"===e){const e=n-t;return n=>t+n*e}throw new Error(`Cannot interpolate ${e} values`)}function nn(t,r={}){const o=Xt(t);let i,s=t;function a(a,c){if(null==t)return o.set(t=a),Promise.resolve();s=a;let u=i,f=!1,{delay:l=0,duration:d=400,easing:p=n,interpolate:h=tn}=e(e({},r),c);if(0===d)return u&&(u.abort(),u=null),o.set(t=s),Promise.resolve();const v=E()+l;let g;return i=A((n=>{if(v>n)return!0;f||(g=h(t,a),"function"==typeof d&&(d=d(t,a)),f=!0),u&&(u.abort(),u=null);const e=n-v;return e>d?(o.set(t=a),!1):(o.set(t=g(p(e/d))),!0)})),i.promise}return{set:a,update:(n,e)=>a(n(s,t),e),subscribe:o.subscribe}}function en(t,n,e){return t.addEventListener(n,e),()=>t.removeEventListener(n,e)}function rn(t,n,e,r,o){t.dispatchEvent(new CustomEvent(`${n}${o}`,{detail:{event:e,pointersCount:r.length}}))}function on(t,n={timeframe:300,minSwipeDistance:60,touchAction:"none"}){const e="swipe";let r,o,i,s;return function(t,n,e,r,o,i="none"){n.style.touchAction=i;let s=[];const a=en(n,"pointerdown",(function(i){s.push(i),rn(n,t,i,s,"down"),null==r||r(s,i);const a=i.pointerId;function c(e){a===e.pointerId&&(s=function(t,n){return n.filter((n=>t.pointerId!==n.pointerId))}(e,s),s.length||u(),rn(n,t,e,s,"up"),null==o||o(s,e))}function u(){f(),l(),d(),p()}const f=en(n,"pointermove",(r=>{s=s.map((t=>r.pointerId===t.pointerId?r:t)),rn(n,t,r,s,"move"),null==e||e(s,r)})),l=en(n,"lostpointercapture",(t=>{c(t)})),d=en(n,"pointerup",(t=>{c(t)})),p=en(n,"pointerleave",(e=>{s=[],u(),rn(n,t,e,s,"up"),null==o||o(s,e)}))}));return{destroy:()=>{a()}}}(e,t,null,(function(t,n){o=n.clientX,i=n.clientY,r=Date.now(),1===t.length&&(s=n.target)}),(function(a,c){if("pointerup"===c.type&&0===a.length&&Date.now()-r<n.timeframe){const r=c.clientX-o,a=c.clientY-i,u=Math.abs(r),f=Math.abs(a);let l=null;u>=2*f&&u>n.minSwipeDistance?l=r>0?"right":"left":f>=2*u&&f>n.minSwipeDistance&&(l=a>0?"bottom":"top"),l&&t.dispatchEvent(new CustomEvent(e,{detail:{direction:l,target:s}}))}}),n.touchAction)}var sn={exports:{}},an=function(t,n,e,r){var o=t[0],i=t[1],s=!1;void 0===e&&(e=0),void 0===r&&(r=n.length);for(var a=(r-e)/2,c=0,u=a-1;a>c;u=c++){var f=n[e+2*c+0],l=n[e+2*c+1],d=n[e+2*u+1];l>i!=d>i&&(n[e+2*u+0]-f)*(i-l)/(d-l)+f>o&&(s=!s)}return s},cn=function(t,n,e,r){var o=t[0],i=t[1],s=!1;void 0===e&&(e=0),void 0===r&&(r=n.length);for(var a=r-e,c=0,u=a-1;a>c;u=c++){var f=n[c+e][0],l=n[c+e][1],d=n[u+e][1];l>i!=d>i&&(n[u+e][0]-f)*(i-l)/(d-l)+f>o&&(s=!s)}return s};sn.exports=function(t,n,e,r){return n.length>0&&Array.isArray(n[0])?cn(t,n,e,r):an(t,n,e,r)};var un=sn.exports.nested=cn;sn.exports.flat=an;try{self["workbox:window:6.4.1"]&&_()}catch(bn){}function fn(t,n){return new Promise((function(e){var r=new MessageChannel;r.port1.onmessage=function(t){e(t.data)},t.postMessage(n,[r.port2])}))}function ln(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);n>e;e++)r[e]=t[e];return r}try{self["workbox:core:6.4.1"]&&_()}catch(bn){}var dn=function(){var t=this;this.promise=new Promise((function(n,e){t.resolve=n,t.reject=e}))};function pn(t,n){var e=location.href;return new URL(t,e).href===new URL(n,e).href}var hn=function(t,n){this.type=t,Object.assign(this,n)};function vn(t,n,e){return e?n?n(t):t:(t&&t.then||(t=Promise.resolve(t)),n?t.then(n):t)}function gn(){}var mn={type:"SKIP_WAITING"};function yn(t,n){if(!n)return t&&t.then?t.then(gn):Promise.resolve()}var wn=function(t){var n,e;function r(n,e){var r,o;return void 0===e&&(e={}),(r=t.call(this)||this).nn={},r.tn=0,r.rn=new dn,r.en=new dn,r.on=new dn,r.un=0,r.an=new Set,r.cn=function(){var t=r.fn,n=t.installing;r.tn>0||!pn(n.scriptURL,r.sn.toString())||performance.now()>r.un+6e4?(r.vn=n,t.removeEventListener("updatefound",r.cn)):(r.hn=n,r.an.add(n),r.rn.resolve(n)),++r.tn,n.addEventListener("statechange",r.ln)},r.ln=function(t){var n=r.fn,e=t.target,o=e.state,i=e===r.vn,s={sw:e,isExternal:i,originalEvent:t};!i&&r.mn&&(s.isUpdate=!0),r.dispatchEvent(new hn(o,s)),"installed"===o?r.wn=self.setTimeout((function(){"installed"===o&&n.waiting===e&&r.dispatchEvent(new hn("waiting",s))}),200):"activating"===o&&(clearTimeout(r.wn),i||r.en.resolve(e))},r.dn=function(t){var n=r.hn,e=n!==navigator.serviceWorker.controller;r.dispatchEvent(new hn("controlling",{isExternal:e,originalEvent:t,sw:n,isUpdate:r.mn})),e||r.on.resolve(n)},r.gn=(o=function(t){var n=t.data,e=t.ports,o=t.source;return vn(r.getSW(),(function(){r.an.has(o)&&r.dispatchEvent(new hn("message",{data:n,originalEvent:t,ports:e,sw:o}))}))},function(){for(var t=[],n=0;arguments.length>n;n++)t[n]=arguments[n];try{return Promise.resolve(o.apply(this,t))}catch(e){return Promise.reject(e)}}),r.sn=n,r.nn=e,navigator.serviceWorker.addEventListener("message",r.gn),r}e=t,(n=r).prototype=Object.create(e.prototype),n.prototype.constructor=n,n.__proto__=e;var o,i=r.prototype;return i.register=function(t){var n,e,r=(void 0===t?{}:t).immediate,o=void 0!==r&&r;try{var i=this;return n=function(){return i.mn=Boolean(navigator.serviceWorker.controller),i.yn=i.pn(),vn(i.bn(),(function(t){i.fn=t,i.yn&&(i.hn=i.yn,i.en.resolve(i.yn),i.on.resolve(i.yn),i.yn.addEventListener("statechange",i.ln,{once:!0}));var n=i.fn.waiting;return n&&pn(n.scriptURL,i.sn.toString())&&(i.hn=n,Promise.resolve().then((function(){i.dispatchEvent(new hn("waiting",{sw:n,wasWaitingBeforeRegister:!0}))})).then((function(){}))),i.hn&&(i.rn.resolve(i.hn),i.an.add(i.hn)),i.fn.addEventListener("updatefound",i.cn),navigator.serviceWorker.addEventListener("controllerchange",i.dn),i.fn}))},(e=function(){if(!o&&"complete"!==document.readyState)return yn(new Promise((function(t){return window.addEventListener("load",t)})))}())&&e.then?e.then(n):n()}catch(s){return Promise.reject(s)}},i.update=function(){try{return this.fn?yn(this.fn.update()):void 0}catch(bn){return Promise.reject(bn)}},i.getSW=function(){return void 0!==this.hn?Promise.resolve(this.hn):this.rn.promise},i.messageSW=function(t){try{return vn(this.getSW(),(function(n){return fn(n,t)}))}catch(bn){return Promise.reject(bn)}},i.messageSkipWaiting=function(){this.fn&&this.fn.waiting&&fn(this.fn.waiting,mn)},i.pn=function(){var t=navigator.serviceWorker.controller;return t&&pn(t.scriptURL,this.sn.toString())?t:void 0},i.bn=function(){try{var t=this;return function(n,e){try{var r=vn(navigator.serviceWorker.register(t.sn,t.nn),(function(n){return t.un=performance.now(),n}))}catch(o){return e(o)}return r&&r.then?r.then(void 0,e):r}(0,(function(t){throw t}))}catch(n){return Promise.reject(n)}},(o=[{key:"active",get:function(){return this.en.promise}},{key:"controlling",get:function(){return this.on.promise}}])&&function(t,n){for(var e=0;n.length>e;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}(r.prototype,o),r}(function(){function t(){this.Pn=new Map}var n=t.prototype;return n.addEventListener=function(t,n){this.Sn(t).add(n)},n.removeEventListener=function(t,n){this.Sn(t).delete(n)},n.dispatchEvent=function(t){t.target=this;for(var n,e=function(t){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=function(t,n){if(t){if("string"==typeof t)return ln(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?ln(t,n):void 0}}(t))){n&&(t=n);var e=0;return function(){return t.length>e?{done:!1,value:t[e++]}:{done:!0}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=t[Symbol.iterator]()).next.bind(n)}(this.Sn(t.type));!(n=e()).done;)(0,n.value)(t)},n.Sn=function(t){return this.Pn.has(t)||this.Pn.set(t,new Set),this.Pn.get(t)},t}());export{u as $,p as A,X as B,G as C,rt as D,pt as E,at as F,zt as G,w as H,a as I,K as J,q as K,M as L,nn as M,Tt as N,Mt as O,Wt as P,Nt as Q,z as R,Dt as S,ot as T,h as U,m as V,y as W,g as X,it as Y,i as Z,F as _,N as a,B as a0,b as a1,on as a2,jt as a3,un as a4,Ct as a5,wn as a6,C as b,P as c,t as d,W as e,I as f,d as g,It as h,Ut as i,kt as j,ht as k,T as l,Ot as m,f as n,Lt as o,At as p,Rt as q,Ft as r,O as s,R as t,U as u,D as v,Xt as w,_t as x,St as y,Bt as z};