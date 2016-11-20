
(global => {
  'use strict';

  // Load the sw-tookbox library.
  importScripts('sw-toolbox.js'); // Update path to match your own setup

  //global.toolbox.options.cache.name = 'sw-cache-<%= hash %>';

  //global.toolbox.precache(['/', <%= precache %>]);//its variable populated by node script


  //Turn on debug logging, visible in the Developer Tools' console.
  //global.toolbox.options.debug = true;

  // By default, all requests that don't match our custom handler will use the
  // toolbox.networkFirst cache strategy, and their responses will be stored in
  // the default cache.
  //global.toolbox.router.default = global.toolbox.networkFirst;


  // Boilerplate to ensure our service worker takes control of the page as soon
  // as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));

  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

  global.addEventListener('push', (event) => {
    event.waitUntil( fetch('http://localhost:5000/weather?location=Almere,NL')
      .then(function(response) { return response.json(); })
      .then(function(data) {
        let title = data.currently.summary + ' ' + Math.round(data.currently.temperature) + '°';
        let body = 'Feels ' + Math.round(data.currently.apparentTemperature) + ' °';
        if ( data.currently.precipProbability ) {
          body = Math.round(data.currently.precipProbability * 100) + '% ' + data.currently.precipType + ' - ' + body;
        }
        let icon = 'http://downloadicons.net/sites/default/files/rain-icon-46110.png';

        self.registration.showNotification( title, {
          body: body,
          icon: icon
        });
      })
      .catch(function(err) {
        console.log('err');
        console.log(err);
      })
    );
  });

  global.onnotificationclick = evt => {
    const url = 'http://localhost:8080/';

    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    evt.notification.close();

    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    evt.waitUntil(
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
