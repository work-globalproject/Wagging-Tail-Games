/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "137a08b08c2b245ac0e54667b5beeefe"
  }, {
    "url": "pwa-512x512.png",
    "revision": "07fe6990a6701282cda7af5afb9f6058"
  }, {
    "url": "pwa-192x192.png",
    "revision": "ffffcc045b486b3635aab01a4d528f4c"
  }, {
    "url": "logo.svg",
    "revision": "4bdabf6f330fc06de3e4f6f923737703"
  }, {
    "url": "index.html",
    "revision": "77e3994f7b3931fee9cc29bb7b6f244d"
  }, {
    "url": "icon.svg",
    "revision": "bfc7cb4eee463edd8ae4885771966d7f"
  }, {
    "url": "favicon.ico",
    "revision": "e38abef4f2927111b67fa48bed5899a6"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "41daea514adfefb71ddf8b468cb001f6"
  }, {
    "url": "assets/index-OHnAHOxk.js",
    "revision": null
  }, {
    "url": "assets/index-C-Y7aIw6.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "41daea514adfefb71ddf8b468cb001f6"
  }, {
    "url": "favicon.ico",
    "revision": "e38abef4f2927111b67fa48bed5899a6"
  }, {
    "url": "icon.svg",
    "revision": "bfc7cb4eee463edd8ae4885771966d7f"
  }, {
    "url": "pwa-192x192.png",
    "revision": "ffffcc045b486b3635aab01a4d528f4c"
  }, {
    "url": "pwa-512x512.png",
    "revision": "07fe6990a6701282cda7af5afb9f6058"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "137a08b08c2b245ac0e54667b5beeefe"
  }, {
    "url": "manifest.webmanifest",
    "revision": "f0e7ae05646e79c78d36344626f169ef"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
