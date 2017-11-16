export function requestPayment() {
	const supportedInstruments = [
		{
			supportedMethods: [
				'amex',
				'diners',
				'discover',
				'jcb',
				'mastercard',
				'unionpay',
				'visa'
			]
		}
	];

	const details = {
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
				amount: { currency: 'EUR', value: '5.00' }
			}
		],
		shippingOptions: [
			{
				id: 'freeWorldwideShipping',
				label: 'Free shipping worldwide',
				amount: { currency: 'EUR', value: '0.00' },
				selected: true
			}
		]
	};

	const options = { requestShipping: true };
	const request = new PaymentRequest(supportedInstruments, details, options);
	request.addEventListener('shippingaddresschange', evt => {
		evt.updateWith(Promise.resolve(details));
	});
	return request.show();
}
