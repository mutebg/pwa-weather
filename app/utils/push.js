import { post, remove, patch } from './api';

function sendSubscriptionToServer(subscription, time) {
  post('push/subscribe', { subscription, time });
}

export function sendUpdateSubscriptionToServer(subscription, time) {
  patch('push/subscribe', { subscription, time });
}

function sendUnSubscriptionToServer(subscription) {
  remove('push/subscribe', { subscription });
}


export function unsubscribe(react) {
  react.setState({
    pushButtonDisabled: true,
  });


  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    // To unsubscribe from push messaging, you need get the
    // subcription object, which you can call unsubscribe() on.
    serviceWorkerRegistration.pushManager.getSubscription().then((pushSubscription) => {
        // Check we have a subscription to unsubscribe
      if (!pushSubscription) {
        // No subscription object, so set the state
        // to allow the user to subscribe to push
        react.setState({
          pushButtonDisabled: false,
          pushButtonLabel: 'Enable Push Messages',
          pushEnabled: false,
        });
        return;
      }

      // TODO: Make a request to your server to remove
      // the users data from your data store so you
      // don't attempt to send them push messages anymore

      // We have a subcription, so call unsubscribe on it
      pushSubscription.unsubscribe().then(() => {
        react.setState({
          pushButtonDisabled: false,
          pushButtonLabel: 'Enable Push Messages',
          pushEnabled: false,
        });
        sendUnSubscriptionToServer(pushSubscription);
      }).catch(() => {
        // We failed to unsubscribe, this can lead to
        // an unusual state, so may be best to remove
        // the subscription id from your data store and
        // inform the user that you disabled push

        react.setState({
          pushButtonDisabled: false,
          pushButtonLabel: 'Unsubscription error',
        });
      });
    }).catch((e) => {
      console.log('Error thrown while unsubscribing from push messaging.', e);
    });
  });
}

export function subscribe(react) {
  // Disable the button so it can't be changed while
  // we process the permission request
  react.setState({
    pushButtonDisabled: true,
  });

  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
    }).then((subscription) => {
      // The subscription was successful
      react.setState({
        pushEnabled: true,
        pushButtonDisabled: false,
        pushButtonLabel: 'Disable Push Messages',
        pushSubscription: subscription,
      });

      // TODO: Send the subscription subscription.endpoint
      // to your server and save it to send a push message
      // at a later date
      return sendSubscriptionToServer(subscription, react.state.notificationTime);
    })
    .catch((e) => {
      if (Notification.permission === 'denied') {
        // The user denied the notification permission which
        // means we failed to subscribe and the user will need
        // to manually change the notification permission to
        // subscribe to push messages
        react.setState({
          pushButtonDisabled: true,
          pushButtonLabel: 'Permission for Notifications was denied',
        });
      } else {
        // A problem occurred with the subscription, this can
        // often be down to an issue or lack of the gcm_sender_id
        // and / or gcm_user_visible_only
        console.log('Unable to subscribe to push.', e);
        react.setState({
          pushButtonDisabled: false,
          pushButtonLabel: 'Enable Push Messages',
        });
      }
    });
  });
}

// Once the service worker is registered set the initial state
export function initialiseState(react) {
  // Are Notifications supported in the service worker?
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    react.setState({
      pushButtonDisabled: true,
      pushButtonLabel: 'Notifications aren\'t supported.',
    });
    console.log('Notifications aren\'t supported.');
    return false;
  }

  // Check the current Notification permission.
  // If its denied, it's a permanent block until the
  // user changes the permission
  if (Notification.permission === 'denied') {
    react.setState({
      pushButtonDisabled: true,
      pushButtonLabel: 'The user has blocked notifications.',
    });
    console.log('The user has blocked notifications.');
    return false;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    react.setState({
      pushButtonDisabled: true,
      pushButtonLabel: 'Push messaging isn\'t supported.',
    });
    console.log('Push messaging isn\'t supported.');
    return false;
  }

  // We need the service worker registration to check for a subscription
  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    // Do we already have a push message subscription?
    serviceWorkerRegistration.pushManager.getSubscription()
      .then((subscription) => {
        // Enable any UI which subscribes / unsubscribes from
        // push messages.
        react.setState({
          pushButtonDisabled: false,
        });

        if (!subscription) {
          // We aren’t subscribed to push, so set UI
          // to allow the user to enable push
          return;
        }

        // Keep your server in sync with the latest subscription
        sendUpdateSubscriptionToServer(subscription, react.state.notificationTime);

        react.setState({
          pushSubscription: subscription,
        });

        // Set your UI to show they have subscribed for
        // push messages
        react.setState({
          pushEnabled: true,
          pushButtonLabel: 'Disable Push Messages',
        });
      })
      .catch(() => {
        react.setState({
          pushButtonLabel: 'Error during subscription',
        });
        return 'Error during getSubscription()';
      });
  });
}
