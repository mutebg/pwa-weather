
(global => {
  'use strict';

  // Load the sw-tookbox library.
  importScripts('sw-toolbox.js'); // Update path to match your own setup
  importScripts('idb-keyval.js')

  global.toolbox.options.cache.name = 'sw-cache-<%= hash %>';

  global.toolbox.precache(['/', <%= precache %>]);//its variable populated by node script


  //Turn on debug logging, visible in the Developer Tools' console.
  //global.toolbox.options.debug = true;

  // By default, all requests that don't match our custom handler will use the
  // toolbox.networkFirst cache strategy, and their responses will be stored in
  // the default cache.
  global.toolbox.router.default = global.toolbox.networkFirst;

  //global.location = {};

  // Boilerplate to ensure our service worker takes control of the page as soon
  // as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));

  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

  // global.addEventListener('push', (event) => {
  //   var title = 'Your daily weather update';
  //   var body = 'Open weather aplication to see forecast for today';
  //   var icon = '';
  //   if ( event.data.text() ) {
  //     var msg = JSON.parse( event.data.text() );
  //     title = msg.title;
  //     body = msg.body;
  //     icon = msg.icon;
  //
  //   }
  //
  //   event.waitUntil(
  //     self.registration.showNotification(title, {
  //       body: body,
  //       icon: icon,
  //     })
  //   );
  // });
  global.addEventListener('push', (event) => {
    event.waitUntil(
      idbKeyval.get('location').then( location => {
        location = JSON.parse(location);
        const url = '<%= api_url %>weather?latitude=' + location.latitude + '&longitude=' + location.longitude;
        return fetch(url)
          .then( response => response.json() )
          .then( data => {
            let title = data.currently.summary + ' ' + Math.round(data.currently.temperature) + '°';
            let body = 'Feels ' + Math.round(data.currently.apparentTemperature) + ' °';
            if ( data.currently.precipProbability && data.currently.precipType ) {
              body = Math.round(data.currently.precipProbability * 100) + '% ' + data.currently.precipType + ' - ' + body;
            }

            let icon = '/notification-icon.png';
            self.registration.showNotification( title, {
              body: body,
              icon: icon
            });
          })
          .catch( err => {
            console.log('Cant make push',err);
          });
      })
    )
  });

  global.onnotificationclick = event => {
    const url = '<%= base_url %>';

    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    event.notification.close();

    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(
      Promise.all([
        clients.matchAll({
          type: 'window'
        })
        .then(windowClients => {
          const client = windowClients.find(client => {
            return (client.url === url && 'focus' in client);
          });

          if (client) {
            client.focus();
          } else if (clients.openWindow) {
            return clients.openWindow(url);
          }
        }),
      ])
    );
  };
})(self);
