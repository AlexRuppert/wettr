if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const l=e=>n(e,r),d={module:{uri:r},exports:o,require:l};s[r]=Promise.all(i.map((e=>d[e]||l(e)))).then((e=>(t(...e),o)))}}define(["./workbox-6cd28afd"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.524dc333.js",revision:null},{url:"assets/index.be0aaea6.css",revision:null},{url:"assets/locations.d56629de.js",revision:null},{url:"assets/vendor.2ae0fd47.js",revision:null},{url:"index.html",revision:"6d6ff3b89e32be0d70005b201ca05e30"},{url:"manifest.webmanifest",revision:"1026e06f0aa8be22cb7c0dfd517f0927"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
