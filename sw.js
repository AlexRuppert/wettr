if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,t)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const n={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return n;default:return e(s)}}))).then((e=>{const s=t(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-d236bde4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.34cd347d.js",revision:"5a8ad1a17c26a3feb1cb484c8fb2a501"},{url:"assets/index.71f90c80.css",revision:"611be43a414b0afa2d5703828f68443b"},{url:"assets/locations.d56629de.js",revision:"076626b7372d8d5073ecfb7d5344c946"},{url:"assets/vendor.57378936.js",revision:"aa2847bfd1b4e79a81746333399ce401"},{url:"index.html",revision:"0cfd618a82b8c5dbf062cc06f3355fa2"},{url:"manifest.webmanifest",revision:"b22bafcd0eb0021f25e31196a1104316"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
