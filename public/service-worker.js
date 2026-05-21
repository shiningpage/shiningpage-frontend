let CACHE_VERSION = 1114;

let CURRENT_CACHE = 'static-cache-v' + CACHE_VERSION

// let CURRENT_CACHE = {
//     static : 'static-cache-v' + CACHE_VERSION,
//     dynamic : 'dynamic-cache-v' + CACHE_VERSION
// };

// self.addEventListener('install' , (event) => {
//     // console.log('installing service worker' , event);
//     event.waitUntil(
//         caches.open(CURRENT_CACHE)
//             .then((cache) => {
//                 cache.addAll([
//                     '/',
//                     '/fa/app/islamicMedicine',

//                     '/css/bootstrap.min.css',
//                     '/css/mdb.min.css',
//                     '/css/vazir.css',
//                     '/js/app.js',
//                     '/js/promise-polyfill.js',
//                     '/js/jquery.min.js',
//                     '/js/bootstrap.bundle.min.js',
//                     '/js/bootstrap.min.js',
//                     '/js/popper.min.js',
//                 ]);
//             })
//     )
// })

// self.addEventListener('activate' , (event) => {
//     // console.log('activating service worker' , event);
//     let expectedCacheNames = Object.values(CURRENT_CACHE);

//     event.waitUntil(
//         caches.keys().then(cacheNames => {
//             return Promise.all(
//                 cacheNames.forEach(cacheName => {
//                     if(! expectedCacheNames.includes(cacheName)) {
//                         // console.log('Deleting out of date cache:' , cacheName);

//                         return caches.delete(cacheName);
//                     }
//                 })
//             )
//         })
//     )

// });

// self.addEventListener('fetch' , (event) => {
//     event.respondWith(
//         caches.open(CURRENT_CACHE).then((cache) => {
//             return cache.match(event.request).then(response => {
//                 if(response) {
//                     // console.log('Found response in cache:' , response);

//                     return response;
//                 }  

//                 // console.log('Fetching request from the network');

//                 return fetch(event.request).then(networkResponse => {
//                     cache.put(event.request , networkResponse.clone());

//                     return networkResponse;
//                 }).catch(err => {
//                     console.log('error in fetch handler:' , err);
//                     throw err;
//                 })
//             })
//         })
//     )
// });

// self.addEventListener('fetch' , (event) => {
//     event.respondWith(
//         caches.match(event.request).then(response => {
//             if(response) return response;

//             return fetch(event.request).then(networkResponse => {
//                 caches.open(CURRENT_CACHE['dynamic'])
//                     .then(cache => {
//                         cache.put(event.request , networkResponse.clone());
//                         return networkResponse;
//                     })
//             })
//         })
//     )
// });



