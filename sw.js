if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const l=e=>n(e,t),c={module:{uri:t},exports:o,require:l};s[t]=Promise.all(i.map((e=>c[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-6cd28afd"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.39bc703c.js",revision:null},{url:"assets/index.51d4bbaa.css",revision:null},{url:"assets/vendor.d72dbf04.js",revision:null},{url:"assets/worker.fc1b8007.js",revision:null},{url:"index.html",revision:"6a7f0aca5ec3a9b0f3826b11df847a2d"},{url:"manifest.webmanifest",revision:"fdc618f1f17747f646eca3bef56ac05b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
