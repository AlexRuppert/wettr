(function(){"use strict";function P(n,t,s){const u=new Date(n.toISOString().substr(0,10)+"T12:00Z");function r(p){return Math.sin(p*(Math.PI/180))}function d(p){return Math.asin(p)*(180/Math.PI)}function l(p){return Math.cos(p*(Math.PI/180))}function y(p){return Math.acos(p)*(180/Math.PI)}function g(p){return new Date((p-24405875e-1)*864e5)}const e=Math.floor(u.getTime()/864e5+24405875e-1)-2451545+8e-4-s/360,a=(357.5291+.98560028*e)%360,i=1.9148*r(a)+.02*r(2*a)+3e-4*r(3*a),h=(a+i+180+102.9372)%360,o=2451545+e+.0053*r(a)-.0069*r(2*h),m=d(r(h)*r(23.44)),f=y((r(-.83)-r(t)*r(m))/(l(t)*l(m)));return{sunrise:g(o-f/360),sunset:g(o+f/360)}}const w={foreground:{light:"#444444",dark:"#9ca3aa"},rain:{light:"#0066ED",dark:"#2784FF"},sun:{light:"#FFB901",dark:"#FFC637"},warning:{light:"#EA580C",dark:"#EA580C"}},R=n=>{switch(n){case"rain":case"sleet":case"hail":case"snow":case"thunderstorm":return w.rain;case"clearDay":case"clearNight":case"partlyCloudyDay":case"partlyCloudyNight":return w.sun;default:return w.foreground}},D="x--cache-timestamp";async function _(n,t=1e6){let s=await caches.match(n);if(s&&s.headers.get(D)&&+s.headers.get(D)+t*60*1e3>Date.now())return console.log("cached "+n),s;s=await fetch(n);const u=new Headers(s.headers);u.set(D,Date.now().toString());const r=s.clone(),d=new Response(r.body,{status:r.status,statusText:r.statusText,headers:u});return(await caches.open("v1")).put(n,d),s}const M="https://api.brightsky.dev/",F=1e3*60*60;let T=new URL(M+"current_weather"),S=new URL(M+"weather");function C(n){return n.replace(/-\w/g,t=>t.replace(/-/,"").toUpperCase())}async function O(n,t){return T.search=new URLSearchParams({lat:n.toFixed(3),lon:t.toFixed(3),tz:"Europe/Berlin"}).toString(),k(await(await _(T.toString(),9)).json())}function x(n=new Date){let t=-n.getTimezoneOffset(),s=t>=0?"+":"-";const u=r=>{const d=Math.floor(Math.abs(r));return(d<10?"0":"")+d};return s+u(t/60)+":"+u(t%60)}function H(n=new Date,t=!1){return(t?"T23:59:00":"T00:00:00")+x(n)}function b(n=new Date,t=!1){return new Intl.DateTimeFormat("eu").format(n).replace(/\//g,"-")+H(n,t)}async function U(n,t,s=3){const u=new Date,r=new Date(u.getTime()+F*24*s-10);return S.search=new URLSearchParams({lat:n.toFixed(3),lon:t.toFixed(3),days:s.toString(),date:b(u),last_date:b(r,!0)}).toString(),W(await(await _(S.toString(),9)).json(),n,t)}function k(n){const t=n.weather;return{timestamp:t.timestamp,cloudCover:t.cloud_cover,condition:t.condition,dewPoint:t.dew_point,precipitation:t.precipitation_60,pressureMsl:t.pressure_msl,relativeHumidity:t.relative_humidity,visibility:t.visibility,windDirection:t.wind_direction_10,windSpeed:t.wind_speed_10,windGustDirection:t.wind_gust_direction_10,windGustSpeed:t.wind_gust_speed_10,sunshine:t.sunshine_30,temperature:Math.round(t.temperature),icon:C(t.icon)}}function W(n,t,s){const u=n.weather.map(e=>({timestamp:e.timestamp,cloudCover:e.cloud_cover,condition:e.condition,dewPoint:e.dew_point,precipitation:e.precipitation,pressureMsl:e.pressure_msl,relativeHumidity:e.relative_humidity,visibility:e.visibility,windDirection:e.wind_direction,windSpeed:e.wind_speed,windGustDirection:e.wind_gust_direction,windGustSpeed:e.wind_gust_speed,sunshine:e.sunshine,temperature:Math.round(e.temperature),icon:C(e.icon)})),r={};u.forEach(e=>{const a=e.timestamp.split("T")[0];r[a]||(r[a]=[]),r[a].push(e)});let d={};const l=(e,a,i)=>e>=a&&e<=i,y=e=>new Date(e).getHours(),g=e=>{const a=i=>{switch(i){case"thunderstorm":case"hail":return 12;default:return 1}};return d={},e.forEach(i=>d[i.icon]=a(i.icon)+(d[i.icon]??0)),Object.entries(d).reduce((i,[h,o])=>o>i[1]?[h,o]:i,["clear-day",0])[0].replace("Night","Day")},I=e=>{let a=-1/0,i=1/0;e.forEach(o=>{o.temperature>a&&(a=o.temperature),o.temperature<i&&(i=o.temperature)});const h=a-i;return{min:{temperature:i},max:{temperature:a},dayGraph:e.map(o=>({timestamp:o.timestamp,temperature:Math.abs((o.temperature-i)/h),precipitation:Math.min(Math.pow(Math.sqrt(o.precipitation)*1.7,2),6)/6,sunniness:1-o.cloudCover/100}))}};return Object.entries(r).map(([e,a])=>{a=a.map(c=>({...c,hours:y(c.timestamp)}));const i=new Date(e),h=[],o=[],m=[],f=[],p=P(i,t,s);return a.forEach(c=>{l(c.hours,4,22)&&h.push(c),l(c.hours,4,9)&&o.push(c),l(c.hours,10,17)&&m.push(c),l(c.hours,18,22)&&f.push(c)}),{day:i,dayLight:p,dayParts:[o,m,f].map(c=>{const E=g(c);return{icon:E,colors:R(E)}}),...I(h),data:a}})}onmessage=async function({data:{type:n,data:t}}){let s;switch(n){case"currentWeatherData":s=O(t.lat,t.lon);break;case"weatherData":s=U(t.lat,t.lon,t.days);break}postMessage({type:n,data:await s})}})();
