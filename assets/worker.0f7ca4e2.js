(function(){"use strict";function lt(t,e,n){const r=new Date(t.toISOString().substr(0,10)+"T12:00Z");function a(_){return Math.sin(_*(Math.PI/180))}function i(_){return Math.asin(_)*(180/Math.PI)}function o(_){return Math.cos(_*(Math.PI/180))}function s(_){return Math.acos(_)*(180/Math.PI)}function u(_){return new Date((_-24405875e-1)*864e5)}const f=Math.floor(r.getTime()/864e5+24405875e-1)-2451545+8e-4-n/360,h=(357.5291+.98560028*f)%360,m=1.9148*a(h)+.02*a(2*h)+3e-4*a(3*h),g=(h+m+180+102.9372)%360,l=2451545+f+.0053*a(h)-.0069*a(2*g),d=i(a(g)*a(23.44)),y=s((a(-.83)-a(e)*a(d))/(o(e)*o(d)));return{sunrise:u(l-y/360),sunset:u(l+y/360)}}const R={foreground:{light:"#444444",dark:"#9ca3aa"},rain:{light:"#0066ED",dark:"#2784FF"},sun:{light:"#FFB901",dark:"#FFC637"},warning:{light:"#EA580C",dark:"#EA580C"}},ht=t=>{switch(t){case"rain":case"sleet":case"hail":case"snow":case"thunderstorm":return R.rain;case"clearDay":case"clearNight":case"partlyCloudyDay":case"partlyCloudyNight":return R.sun;default:return R.foreground}};function dt(t,e){const n=t.slice();return n.sort(e),n}const O="x--cache-timestamp";async function L(t,e=1e6){let n=await caches.match(t);if(n&&n.headers.get(O)&&+n.headers.get(O)+e*60*1e3>Date.now())return console.log("cached "+t),n;n=await fetch(t);const r=new Headers(n.headers);r.set(O,Date.now().toString());const a=n.clone(),i=new Response(a.body,{status:a.status,statusText:a.statusText,headers:r});return(await caches.open("v1")).put(t,i),n}const $="https://api.brightsky.dev/",mt=1e3*60*60;let G=new URL($+"current_weather"),b=new URL($+"weather");function q(t){return t.replace(/-\w/g,e=>e.replace(/-/,"").toUpperCase())}async function pt(t,e){return G.search=new URLSearchParams({lat:t.toFixed(3),lon:e.toFixed(3),tz:"Europe/Berlin"}).toString(),gt(await(await L(G.toString(),9)).json())}function vt(t=new Date){let e=-t.getTimezoneOffset(),n=e>=0?"+":"-";const r=a=>{const i=Math.floor(Math.abs(a));return(i<10?"0":"")+i};return n+r(e/60)+":"+r(e%60)}function wt(t=new Date,e=!1){return(e?"T23:59:00":"T00:00:00")+vt(t)}function B(t=new Date,e=!1){return new Intl.DateTimeFormat("eu").format(t).replace(/\//g,"-")+wt(t,e)}async function _t(t,e,n=3){const r=new Date,a=new Date(r.getTime()+mt*24*n-10);return b.search=new URLSearchParams({lat:t.toFixed(3),lon:e.toFixed(3),days:n.toString(),date:B(r),last_date:B(a,!0)}).toString(),yt(await(await L(b.toString(),9)).json(),t,e)}function gt(t){const e=t.weather;return{timestamp:e.timestamp,cloudCover:e.cloud_cover,condition:e.condition,dewPoint:e.dew_point,precipitation:e.precipitation_60,pressureMsl:e.pressure_msl,relativeHumidity:e.relative_humidity,visibility:e.visibility,windDirection:e.wind_direction_10,windSpeed:e.wind_speed_10,windGustDirection:e.wind_gust_direction_10,windGustSpeed:e.wind_gust_speed_10,sunshine:e.sunshine_30,temperature:Math.round(e.temperature),icon:q(e.icon)}}function yt(t,e,n){const r=t.weather.map(f=>({timestamp:f.timestamp,cloudCover:f.cloud_cover,condition:f.condition,dewPoint:f.dew_point,precipitation:f.precipitation,pressureMsl:f.pressure_msl,relativeHumidity:f.relative_humidity,visibility:f.visibility,windDirection:f.wind_direction,windSpeed:f.wind_speed,windGustDirection:f.wind_gust_direction,windGustSpeed:f.wind_gust_speed,sunshine:f.sunshine,temperature:Math.round(f.temperature),icon:q(f.icon)})),a={};r.forEach(f=>{const h=f.timestamp.split("T")[0];a[h]||(a[h]=[]),a[h].push(f)});let i={};const o=(f,h,m)=>f>=h&&f<=m,s=f=>new Date(f).getHours(),u=f=>{const h=m=>{switch(m){case"thunderstorm":case"hail":return 12;default:return 1}};return i={},f.forEach(m=>i[m.icon]=h(m.icon)+(i[m.icon]??0)),Object.entries(i).reduce((m,[g,l])=>l>m[1]?[g,l]:m,["clear-day",0])[0].replace("Night","Day")},p=f=>{let h=-1/0,m=1/0;f.forEach(l=>{l.temperature>h&&(h=l.temperature),l.temperature<m&&(m=l.temperature)});const g=h-m;return{min:{temperature:m},max:{temperature:h},dayGraph:f.map(l=>({timestamp:l.timestamp,temperature:g===0?0:Math.abs((l.temperature-m)/g),precipitation:Math.min(Math.pow(Math.sqrt(l.precipitation)*1.7,2),6)/6,sunniness:1-l.cloudCover/100}))}};return Object.entries(a).map(([f,h])=>{h=h.map(w=>({...w,hours:s(w.timestamp)}));const m=new Date(f),g=[],l=[],d=[],y=[],_=lt(m,e,n);return h.forEach(w=>{o(w.hours,4,22)&&g.push(w),o(w.hours,4,9)&&l.push(w),o(w.hours,10,17)&&d.push(w),o(w.hours,18,22)&&y.push(w)}),{day:m,dayLight:_,dayParts:[l,d,y].map(w=>{const M=u(w);return{icon:M,colors:ht(M)}}),...p(g),data:h}})}function Dt(t,e){var n=Uint8Array;if(t[0]==3&&t[1]==0)return e||new n(0);var r=Mt,a=J,i=Ct,o=K,s=e==null;s&&(e=new n(t.length>>>2<<3));for(var u=0,p=0,v=0,f=0,h=0,m=0,g=0,l=0,d=0,y,_;u==0;){if(u=r(t,d,1),p=r(t,d+1,2),d+=3,p==0){(d&7)!=0&&(d+=8-(d&7));var w=(d>>>3)+4,M=t[w-4]|t[w-3]<<8;s&&(e=U(e,l+M)),e.set(new n(t.buffer,t.byteOffset+w,M),l),d=w+M<<3,l+=M;continue}if(s&&(e=U(e,l+(1<<17))),p==1&&(y=c.flmap,_=c.fdmap,m=(1<<9)-1,g=(1<<5)-1),p==2){v=a(t,d,5)+257,f=a(t,d+5,5)+1,h=a(t,d+10,4)+4,d+=14;for(var C=0;C<38;C+=2)c.itree[C]=0,c.itree[C+1]=0;for(var I=1,C=0;C<h;C++){var H=a(t,d+C*3,3);c.itree[(c.ordr[C]<<1)+1]=H,H>I&&(I=H)}d+=3*h,P(c.itree,I),S(c.itree,I,c.imap),y=c.lmap,_=c.dmap,d=i(c.imap,(1<<I)-1,v+f,t,d,c.ttree);var Y=V(c.ttree,0,v,c.ltree);m=(1<<Y)-1;var j=V(c.ttree,v,f,c.dtree);g=(1<<j)-1,P(c.ltree,Y),S(c.ltree,Y,y),P(c.dtree,j),S(c.dtree,j,_)}for(;;){var ut=y[o(t,d)&m];d+=ut&15;var E=ut>>>4;if(E>>>8==0)e[l++]=E;else{if(E==256)break;var W=l+E-254;if(E>264){var X=c.ldef[E-257];W=l+(X>>>3)+a(t,d,X&7),d+=X&7}var ft=_[o(t,d)&g];d+=ft&15;var ce=ft>>>4,Z=c.ddef[ce],T=(Z>>>4)+r(t,d,Z&15);for(d+=Z&15,s&&(e=U(e,l+(1<<17)));l<W;)e[l]=e[l++-T],e[l]=e[l++-T],e[l]=e[l++-T],e[l]=e[l++-T];l=W}}}return e.length==l?e:e.slice(0,l)}function U(t,e){var n=t.length;if(e<=n)return t;var r=new Uint8Array(Math.max(n<<1,e));return r.set(t,0),r}function Ct(t,e,n,r,a,i){for(var o=J,s=K,u=0;u<n;){var p=t[s(r,a)&e];a+=p&15;var v=p>>>4;if(v<=15)i[u]=v,u++;else{var f=0,h=0;v==16?(h=3+o(r,a,2),a+=2,f=i[u-1]):v==17?(h=3+o(r,a,3),a+=3):v==18&&(h=11+o(r,a,7),a+=7);for(var m=u+h;u<m;)i[u]=f,u++}}return a}function V(t,e,n,r){for(var a=0,i=0,o=r.length>>>1;i<n;){var s=t[i+e];r[i<<1]=0,r[(i<<1)+1]=s,s>a&&(a=s),i++}for(;i<o;)r[i<<1]=0,r[(i<<1)+1]=0,i++;return a}function P(t,e){for(var n=t.length,r,a,i,o,s,u=c.bl_count,o=0;o<=e;o++)u[o]=0;for(o=1;o<n;o+=2)u[t[o]]++;var p=c.next_code;for(r=0,u[0]=0,a=1;a<=e;a++)r=r+u[a-1]<<1,p[a]=r;for(i=0;i<n;i+=2)s=t[i+1],s!=0&&(t[i]=p[s],p[s]++)}function S(t,e,n){for(var r=t.length,a=c.rev15,i=0;i<r;i+=2)if(t[i+1]!=0)for(var o=i>>1,s=t[i+1],u=o<<4|s,p=e-s,v=t[i]<<p,f=v+(1<<p);v!=f;){var h=a[v]>>>15-e;n[h]=u,v++}}function z(t,e){for(var n=c.rev15,r=15-e,a=0;a<t.length;a+=2){var i=t[a]<<e-t[a+1];t[a]=n[i]>>>r}}function J(t,e,n){return(t[e>>>3]|t[(e>>>3)+1]<<8)>>>(e&7)&(1<<n)-1}function Mt(t,e,n){return(t[e>>>3]|t[(e>>>3)+1]<<8|t[(e>>>3)+2]<<16)>>>(e&7)&(1<<n)-1}function K(t,e){return(t[e>>>3]|t[(e>>>3)+1]<<8|t[(e>>>3)+2]<<16)>>>(e&7)}const c=function(){var t=Uint16Array,e=Uint32Array;return{next_code:new t(16),bl_count:new t(16),ordr:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],of0:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],exb:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],ldef:new t(32),df0:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],dxb:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],ddef:new e(32),flmap:new t(512),fltree:[],fdmap:new t(32),fdtree:[],lmap:new t(32768),ltree:[],ttree:[],dmap:new t(32768),dtree:[],imap:new t(512),itree:[],rev15:new t(1<<15),lhst:new e(286),dhst:new e(30),ihst:new e(19),lits:new e(15e3),strt:new t(1<<16),prev:new t(1<<15)}}();(function(){for(var t=1<<15,e=0;e<t;e++){var n=e;n=(n&2863311530)>>>1|(n&1431655765)<<1,n=(n&3435973836)>>>2|(n&858993459)<<2,n=(n&4042322160)>>>4|(n&252645135)<<4,n=(n&4278255360)>>>8|(n&16711935)<<8,c.rev15[e]=(n>>>16|n<<16)>>>17}function r(a,i,o){for(;i--!=0;)a.push(0,o)}for(var e=0;e<32;e++)c.ldef[e]=c.of0[e]<<3|c.exb[e],c.ddef[e]=c.df0[e]<<4|c.dxb[e];r(c.fltree,144,8),r(c.fltree,255-143,9),r(c.fltree,279-255,7),r(c.fltree,287-279,8),P(c.fltree,9),S(c.fltree,9,c.flmap),z(c.fltree,9),r(c.fdtree,32,5),P(c.fdtree,5),S(c.fdtree,5,c.fdmap),z(c.fdtree,5),r(c.itree,19,0),r(c.ltree,286,0),r(c.dtree,30,0),r(c.ttree,320,0)})();const Q={table:function(){for(var t=new Uint32Array(256),e=0;e<256;e++){for(var n=e,r=0;r<8;r++)n&1?n=3988292384^n>>>1:n=n>>>1;t[e]=n}return t}(),update:function(t,e,n,r){for(var a=0;a<r;a++)t=Q.table[(t^e[n+a])&255]^t>>>8;return t},crc:function(t,e,n){return Q.update(4294967295,t,e,n)^4294967295}};function Et(t,e){return Dt(t,e)}function Pt(t,e){return t[0],t[1],Et(new Uint8Array(t.buffer,t.byteOffset+2,t.length-6),e)}const St=Math.PI/180;function tt(t){return Math.log(Math.tan(et(t)/2+Math.PI/4))}function et(t){return t*St}function It(t,{lon:e,lat:n}){let r=et(e-t.lb.lon),a=tt(n)-tt(t.lb.lat);return{x:r,y:a}}function Lt({lon:t,lat:e},n){const r=.02;return t+r>=n.lb.lon&&t-r<=n.rt.lon&&e+r>=n.lb.lat&&e-r<=n.rt.lat}const At="https://wettr-service.vercel.app/api/clouds";function Tt(t){const e=[];return t.forEach(n=>{const r=n.lon_bucket,a=n.lat_bucket,i=Pt(Uint8Array.from(atob(n.data).split("").map(s=>s.charCodeAt(0))));let o=0;for(let s=0;s<i.length;s++){const u=i[s];if(u&128)o+=u&~128;else{const p=r+o%100/100,v=a+(o/100|0)/100,f=u/100;e.push({time:n.time,lon:p,lat:v,value:f}),o++}}}),e}function nt(t,e){const n=new Date(t);return new Date(n.setMinutes(n.getMinutes()+e))}function Rt(){const t=new Date(Date.now()-5*60*1e3).toISOString(),n=(+t.match(/:(\d\d):/)[1]/15|0)*15,r=nt(new Date(t.substring(0,13)+":00:00Z"),n);return[...Array(9)].map((a,i)=>nt(r,i*15))}async function Ot(t,e=!1){const n=await(await L(At+`?bounds=${t.lb.lon},${t.rt.lon},${t.lb.lat},${t.rt.lat}${e?"&onlyNow=true":""}`,9)).json();return Tt(n)}async function Ut(t,e=!1){let n=(await Ot(t,e)).filter(a=>Lt(a,t)).map(a=>({...a,projected:It(t,a)}));return n.sort((a,i)=>a.value-i.value),n=Array.from(new Map(n.map(a=>[`${a.time} ${a.projected.x*1e4|0} ${a.projected.y*1e4|0}`,a])).values()),{times:Rt(),clouds:n,viewBounds:t}}function A(t,e,n,r,a,i){var o=(i-e)*(n-t)-(r-e)*(a-t);return o>0?!0:!(o<0)}function xt(t,e){var n=t[0][0],r=t[0][1],a=t[1][0],i=t[1][1],o=e[0][0],s=e[0][1],u=e[1][0],p=e[1][1];return A(n,r,o,s,u,p)!==A(a,i,o,s,u,p)&&A(n,r,a,i,o,s)!==A(n,r,a,i,u,p)}var Nt=xt;function D(t){var e=[];t.forEach(function(n){var r=this.point2CellXY(n),a=r[0],i=r[1];e[a]===void 0&&(e[a]=[]),e[a][i]===void 0&&(e[a][i]=[]),e[a][i].push(n)},this),this.cellPoints=function(n,r){return e[n]!==void 0&&e[n][r]!==void 0?e[n][r]:[]},this.removePoint=function(n){for(var r=this.point2CellXY(n),a=e[r[0]][r[1]],i,o=0;o<a.length;o++)if(a[o][0]===n[0]&&a[o][1]===n[1]){i=o;break}return a.splice(i,1),a}}D.prototype={point2CellXY:function(t){var e=parseInt(t[0]/D.CELL_SIZE),n=parseInt(t[1]/D.CELL_SIZE);return[e,n]},rangePoints:function(t){for(var e=this.point2CellXY([t[0],t[1]]),n=this.point2CellXY([t[2],t[3]]),r=[],a=e[0];a<=n[0];a++)for(var i=e[1];i<=n[1];i++)r=r.concat(this.cellPoints(a,i));return r},addBorder2Bbox:function(t,e){return[t[0]-e*D.CELL_SIZE,t[1]-e*D.CELL_SIZE,t[2]+e*D.CELL_SIZE,t[3]+e*D.CELL_SIZE]}};function Ft(t){return new D(t)}D.CELL_SIZE=10;var kt=Ft,Ht=Nt,Yt=kt;function jt(t){return t.sort(function(e,n){return e[0]==n[0]?e[1]-n[1]:e[0]-n[0]})}function Wt(t){for(var e=-1/0,n=t.length-1;n>=0;n--)t[n][1]>e&&(e=t[n][1]);return e}function Xt(t){for(var e=[],n=0;n<t.length;n++){for(;e.length>=2&&rt(e[e.length-2],e[e.length-1],t[n])<=0;)e.pop();e.push(t[n])}return e.pop(),e}function Zt(t){for(var e=t.reverse(),n=[],r=0;r<e.length;r++){for(;n.length>=2&&rt(n[n.length-2],n[n.length-1],e[r])<=0;)n.pop();n.push(e[r])}return n.pop(),n}function rt(t,e,n){return(e[0]-t[0])*(n[1]-t[1])-(e[1]-t[1])*(n[0]-t[0])}function x(t,e){return Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)}function at(t,e,n){var r=[e[0]-t[0],e[1]-t[1]],a=[n[0]-t[0],n[1]-t[1]],i=x(t,e),o=x(t,n),s=r[0]*a[0]+r[1]*a[1];return s/Math.sqrt(i*o)}function it(t,e){for(var n=0;n<e.length-1;n++){var r=[e[n],e[n+1]];if(!(t[0][0]===r[0][0]&&t[0][1]===r[0][1]||t[0][0]===r[1][0]&&t[0][1]===r[1][1])&&Ht(t,r))return!0}return!1}function $t(t,e){var n,r,a,i;return t[0][0]<t[1][0]?(n=t[0][0]-e,r=t[1][0]+e):(n=t[1][0]-e,r=t[0][0]+e),t[0][1]<t[1][1]?(a=t[0][1]-e,i=t[1][1]+e):(a=t[1][1]-e,i=t[0][1]+e),[n,a,r,i]}function Gt(t,e,n){for(var r=null,a=st,i=st,o,s,u=0;u<e.length;u++)o=at(t[0],t[1],e[u]),s=at(t[1],t[0],e[u]),o>a&&s>i&&!it([t[0],e[u]],n)&&!it([t[1],e[u]],n)&&(a=o,i=s,r=e[u]);return r}function ot(t,e,n,r){for(var a,i,o,s,u,p=!1,v=0;v<t.length-1;v++)if(a=[t[v],t[v+1]],!(x(a[0],a[1])<e)){i=0,o=qt,u=$t(a,o);do u=r.addBorder2Bbox(u,i),o=u[2]-u[0],s=Gt(a,r.rangePoints(u),t),i++;while(s===null&&n>o);s!==null&&(t.splice(v+1,0,s),r.removePoint(s),p=!0)}return p?ot(t,e,n,r):t}function bt(t,e){var n,r,a,i,o,s=e||20;return t.length<4?t:(t=jt(t),r=Xt(t),n=Zt(t),a=n.concat(r),a.push(t[0]),o=Math.max(t[t.length-1][0],Wt(a))*Bt,i=t.filter(function(u){return a.indexOf(u)<0}),ot(a,Math.pow(s,2),o,Yt(i)))}var st=Math.cos(90/(180/Math.PI)),qt=5,Bt=.8,Vt=bt,N={};N.__esModule=!0;function F(t,e){return t*t+e*e}function zt(t,e){return F(t[0]-e[0],t[1]-e[1])}function Jt(t,e,n){var r=e[0],a=e[1],i=n[0]-r,o=n[1]-a;if(i!==0||o!==0){var s=((t[0]-r)*i+(t[1]-a)*o)/F(i,o);s>1?(r=n[0],a=n[1]):s>0&&(r+=i*s,a+=o*s)}return F(t[0]-r,t[1]-a)}function Kt(t,e){for(var n=t[0],r,a=[n],i=1,o=t.length;i<o;i++)r=t[i],zt(r,n)>e&&(a.push(r),n=r);return n!==r&&a.push(r),a}function k(t,e,n,r,a){for(var i=r,o,s=e+1;s<n;s++){var u=Jt(t[s],t[e],t[n]);u>i&&(o=s,i=u)}i>r&&(o-e>1&&k(t,e,o,r,a),a.push(t[o]),n-o>1&&k(t,o,n,r,a))}function Qt(t,e){var n=t.length-1,r=[t[0]];return k(t,0,n,e,r),r.push(t[n]),r}function te(t,e,n){if(e===void 0&&(e=1),n===void 0&&(n=!1),t.length<=2)return t;var r=e*e;return t=n?t:Kt(t,r),t=Qt(t,r),t}N.SimplifyAP=te;var ee=N,ne=ee.SimplifyAP;const re="https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16/gemeinde_warnings_v2.json";async function ae(t){const e=await(await L(re,19)).json();return ie(e)}function ct(t,e,n){return t.level>2&&e>n}function ie(t){const e=Date.now();let n=t.warnings.map(r=>({event:oe(r.event),description:r.description,time:{start:new Date(r.start),end:new Date(r.end)},instruction:r.instruction,level:r.level,type:r.type,regions:ct(r,r.end,e)?r.regions.map(a=>se(a.polygon)):[],urls:r.urls})).filter(r=>ct(r,r.time.end,e));return dt(n,(r,a)=>{const i=r.level-a.level;return i===0?r.time.start.getTime()-a.time.start.getTime():i})}function oe(t){return t.toLowerCase().replace(/(^|\s)\p{L}/gu,e=>e.toUpperCase())}function se(t){const e={lon:100,lat:100},n={lon:0,lat:0},r=[];for(let i=0;i<t.length/2;i+=3){const o=t[i*2],s=t[i*2+1];r.push([s,o])}const a=ne(Vt(r,.1),.02,!1);for(let i=0;i<a.length;i++){const[o,s]=a[i];o<e.lon?e.lon=o:o>n.lon&&(n.lon=o),s<e.lat?e.lat=s:s>n.lat&&(n.lat=s)}return{polygon:a,bounds:{lb:e,rt:n}}}onmessage=async function({data:{type:t,data:e}}){let n;switch(t){case"currentWeatherData":n=pt(e.lat,e.lon);break;case"weatherData":n=_t(e.lat,e.lon,e.days);break;case"cloudData":n=Ut(e.bounds,e.onlyNow);break;case"weatherWarningData":n=ae()}postMessage({type:t,data:await n})}})();