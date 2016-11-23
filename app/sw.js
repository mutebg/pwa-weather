
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

  //global.location = {};

  // Boilerplate to ensure our service worker takes control of the page as soon
  // as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));

  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

  global.addEventListener('push', (event) => {
    var title = 'Your daily weather update';
    var body = 'Open weather aplication to see forecast for today';
    var icon = '';
    if ( event.data.text() ) {
      var msg = JSON.parse( event.data.text() );
      title = msg.title;
      body = msg.body;
      icon = msg.icon;

    }

    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
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

  global.addEventListener('message', (event) => {
    console.log('event data', event);
    switch(event.data.type) {
      case 'self.SAVE_LOCATION':
        console.log('event data', event);
        global.location = event.data.location;
      break;
    }
  });
})(self);
