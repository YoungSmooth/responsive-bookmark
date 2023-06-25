'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "3993b37f501b51f56651de63ea76e63c",
"assets/AssetManifest.json": "61b3f45e34bf42a334309b2cfaa5abac",
"assets/assets/images/bg-dots.svg": "7c66c472eb50c9abe027977b6f2b406e",
"assets/assets/images/favicon-32x32.png": "a07f423b8bbf4a50c2c449b96795fcb6",
"assets/assets/images/icon-arrow.svg": "38993f94ba58120b39289a5258af7063",
"assets/assets/images/icon-close.svg": "8132811b6f86998dea9790de1993d1de",
"assets/assets/images/icon-error.svg": "ba45f6788c38e8a4fc487eab6847a365",
"assets/assets/images/icon-facebook.svg": "c24c1904c0c62485f4200c3a49a45a27",
"assets/assets/images/icon-hamburger.svg": "e3defca190ae3f2aaeedefe79c125bd6",
"assets/assets/images/icon-twitter.svg": "a4daae10e6bd237b96908d16566647e2",
"assets/assets/images/icon.png": "a9fda30e9ac7e92aa23a315d19ac0b4c",
"assets/assets/images/illustration-features-tab-1.svg": "25a237330ac7fab409f2b5833363ae97",
"assets/assets/images/illustration-features-tab-2.svg": "11b0ec333ed9d17690ada04979c489c0",
"assets/assets/images/illustration-features-tab-3.svg": "7f696303479b76b89e45fcf33b7aff4b",
"assets/assets/images/illustration-hero.svg": "dfa0cd821469019e297c8c27cfc0d475",
"assets/assets/images/logo-bookmark.svg": "53989d2a42baf707e1d92f5d05c7899b",
"assets/assets/images/logo-chrome.svg": "3e1ab00bc1a7182ca9297e73eaa98480",
"assets/assets/images/logo-firefox.svg": "e5023c2b57490fa1d28da6dea398606b",
"assets/assets/images/logo-opera.svg": "3d8f7bcc99ea84508c6a3380e0ae0878",
"assets/assets/images/Sketch.svg": "3b89e769861e704ce38d22376fb83713",
"assets/assets/images/svgexport-4.svg": "dd95f370985367ad622ae2d6f15f3e53",
"assets/assets/images/svgexport-5.svg": "822ddb0a2749193f7ced10ad81cec29d",
"assets/assets/images/svgexport-8.svg": "b5bf2440d2e8fe4b94742b3156d9be03",
"assets/assets/images/website-search.svg": "7f414dc184bba5a5a8f9c98d897efdcf",
"assets/assets/images/website-search2.svg": "eb5913aebab4849d449ddb675b510e87",
"assets/assets/images/website-setup.svg": "0a45f1f3ebd74fd42a0510c333955139",
"assets/assets/images/website-setup2.svg": "16d6ba9a79e963aa97df9ecdab04b303",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "32fce58e2acb9c420eab0fe7b828b761",
"assets/NOTICES": "379102d2b04c0abe15a54849fce2ebaf",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "8c9ab94b3e7d4f85ca01c1b0a1e54bd1",
"canvaskit/canvaskit.wasm": "bcb5f27f1d4462c23499b5f5c73eadbf",
"canvaskit/chromium/canvaskit.js": "56facd8978a5292c9bb1d06dfcaee271",
"canvaskit/chromium/canvaskit.wasm": "a1bdb8e068b45f18affefaf412122091",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "d9d2a4b0bccb63bcedea89f95078411f",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "8039d83acad8f06a87a9bc93f4133adb",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "cdb5866c243dfc5ba8d55b947f6d1c77",
"icons/Icon-512.png": "74ad0f16f55864e2b38c8885ad9c0bbc",
"icons/Icon-maskable-192.png": "cdb5866c243dfc5ba8d55b947f6d1c77",
"icons/Icon-maskable-512.png": "74ad0f16f55864e2b38c8885ad9c0bbc",
"index.html": "90c7dd32d2efe38bc02064a868f648bf",
"/": "90c7dd32d2efe38bc02064a868f648bf",
"main.dart.js": "61b39139c018d7347ed5d309442a36e8",
"manifest.json": "34832f9dd002b22b1a689a6725547d85",
"version.json": "3326a2b3f109418f4f710420e947500a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
