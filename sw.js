if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const l=e=>n(e,t),u={module:{uri:t},exports:o,require:l};s[t]=Promise.all(i.map((e=>u[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-6cd28afd"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.2ad2b737.css",revision:null},{url:"assets/index.e186aa78.js",revision:null},{url:"assets/vendor.510734fa.js",revision:null},{url:"assets/worker.ccbc7883.js",revision:null},{url:"index.html",revision:"235fb6b76f1b05675b8154e1eb8d1e77"},{url:"manifest.webmanifest",revision:"fdc618f1f17747f646eca3bef56ac05b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
