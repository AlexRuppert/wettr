if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise((async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]}))},r=(r,s)=>{Promise.all(r.map(e)).then((e=>s(1===e.length?e[0]:e)))},s={require:Promise.resolve(r)};self.define=(r,i,n)=>{s[r]||(s[r]=Promise.resolve().then((()=>{let s={};const c={uri:location.origin+r.slice(1)};return Promise.all(i.map((r=>{switch(r){case"exports":return s;case"module":return c;default:return e(r)}}))).then((e=>{const r=n(...e);return s.default||(s.default=r),s}))})))}}define("./sw.js",["./workbox-d236bde4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.7996c965.js",revision:"370ca4be8704c5b2cc322f4ab5f796b1"},{url:"assets/index.cf7c98d8.css",revision:"14b0641c473ffddb6df4cca9d84af911"},{url:"assets/vendor.91ad5e4c.js",revision:"cf19334dd3697e7310f8c059f9fd1476"},{url:"index.html",revision:"9ceb8ad6bd44d45653aeb7cb10eebb03"},{url:"favicon/android-chrome-192x192.png",revision:"5d86aebe0799bafa60b0c72975b24bca"},{url:"favicon/android-chrome-512x512.png",revision:"12f77ef70cff3b9e7d975a82b642d6c9"},{url:"manifest.webmanifest",revision:"826a991631104a4143a83b57fc2b0e40"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
