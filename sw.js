if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let t={};const l=e=>i(e,o),u={module:{uri:o},exports:t,require:l};s[o]=Promise.all(n.map((e=>u[e]||l(e)))).then((e=>(r(...e),t)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DDeNYKcx.js",revision:null},{url:"assets/index-DiQDqeaG.css",revision:null},{url:"assets/Radar-YiThZY9A.js",revision:null},{url:"assets/workbox-window.prod.es5-CivIwa8x.js",revision:null},{url:"assets/worker-Bw0pG_0V.js",revision:null},{url:"index.html",revision:"5e4afcb3a3df4e629dae08fee3adbf30"},{url:"manifest.webmanifest",revision:"fdc618f1f17747f646eca3bef56ac05b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
