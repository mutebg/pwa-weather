export function requestPayment() {
  var supportedInstruments = [{
    supportedMethods: ['amex', 'diners', 'discover', 'jcb', 'mastercard',
        'unionpay', 'visa']
  }];

  var details = {
    total: {
      label: 'Total',
      amount: {
        currency: 'EUR',
        value: '5.00'
      }
    },
    displayItems: [
      {
        label: 'Donation amount',
        amount: {currency: 'EUR', value: '5.00'}
      },
    ],
    shippingOptions: [{
      id: 'freeWorldwideShipping',
      label: 'Free shipping worldwide',
      amount: {currency: 'EUR', value: '0.00'},
      selected: true
    }]
  };

  var options = {requestShipping: true};
  var request = new PaymentRequest(supportedInstruments, details, options);
  request.addEventListener('shippingaddresschange', function(evt) {
    evt.updateWith(Promise.resolve(details));
  });

  return request.show();
}
