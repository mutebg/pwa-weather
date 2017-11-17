import { Component } from 'preact';
import {
	initialiseState,
	subscribe,
	unsubscribe,
	sendUpdateSubscriptionToServer
} from '../../utils/push';
import { requestPayment } from '../../utils/payment';
import Store from '../../utils/store';
import './style.scss';

class Settings extends Component {
	onNotificationTimeChange(e) {
		if (!e.target.value) {
			return;
		}
		this.setState(
			{
				notificationTime: e.target.value
			},
			() => {
				Store.set('notification_time', this.state.notificationTime);
				if (this.state.pushSubscription) {
					// update notification time on the server
					sendUpdateSubscriptionToServer(
						this.state.pushSubscription,
						this.state.notificationTime
					);
				}
			}
		);
	}

	onThemeChange(e) {
		const theme = e.target.value;
		this.setState({
			theme
		});
		Store.set('theme', theme);
		document.body.className = theme + '-theme';
	}

	togglePushSubscribe() {
		if (this.state.pushEnabled) {
			unsubscribe(this);
		}
		else {
			subscribe(this);
		}
	}

	makePayment() {
		requestPayment()
			.then(e => {
				this.setState({
					successPayment: true,
					paymentData: e
				});
			})
			.catch(err => {
				this.setState({
					successPayment: true,
					paymentData: err
				});
			});
	}

	constructor(props) {
		super(props);
		this.state = {
			pushSubscription: null,
			pushEnabled: false,
			pushButtonLabel: 'Enable Push Messages',
			pushButtonDisabled: false,
			notificationTime: 8,
			showPaymentBtn: false,
			successPayment: false,
			paymentData: null,
			theme: 'light'
		};

		this.togglePushSubscribe = this.togglePushSubscribe.bind(this);
		this.onThemeChange = this.onThemeChange.bind(this);
		this.onNotificationTimeChange = this.onNotificationTimeChange.bind(this);
		this.makePayment = this.makePayment.bind(this);
	}

	componentDidMount() {
		initialiseState(this);

		if ('PaymentRequest' in window) {
			this.setState({
				showPaymentBtn: true
			});
		}

		Store.get('notification_time').then(notificationTime =>
			this.setState({ notificationTime: notificationTime || 8 })
		);

		Store.get('theme').then(theme =>
			this.setState({ theme: theme || 'light' })
		);
	}

	renderPaymentButton() {
		if (this.state.showPaymentBtn) {
			return (
				<div class="Settings__row">
					<label htmlFor="donate" class="Settings__header">
						Support this project
					</label>
					<button class="btn" onClick={this.makePayment} id="donate">
						Donate 5 EUR
					</button>
				</div>
			);
		}
		return null;
	}

	renderPaymentMessage() {
		if (this.state.paymentData) {
			const details = this.state.paymentData.details;
			details.cardNumber = `XXXX-XXXX-XXXX-${details.cardNumber.substr(12)}`;
			details.cardSecurityCode = '***';

			const string = JSON.stringify(
				{
					methodName: this.state.paymentData.methodName,
					details
				},
				undefined,
				2
			);
			return <pre>{string}</pre>;
		}
		return null;
	}

	render(props, state) {
		const optionsTime = [];
		for (let value = 0; value < 24; value++) {
			const label = (value < 10 ? '0' + value : value) + ':00';
			optionsTime.push(<option value={value}>{label}</option>);
		}

		const optionsTheme = [
			<option value="dark">Dark theme</option>,
			<option value="light">Light theme</option>
		];

		return (
			<div class="Settings content">
				<div class="Settings__row">
					<label htmlFor="notification" class="Settings__header">
						Daily Summary
					</label>
					<span class="Settings__sub">
						Deliver notification with the forecaast for the day at selected time
					</span>
					<button
						id="notification"
						class="btn"
						disabled={state.pushButtonDisabled}
						onClick={() => this.togglePushSubscribe()}
					>
						{state.pushButtonLabel}
					</button>
				</div>
				<div class="Settings__row Settings__row--time">
					<select
						value={state.notificationTime}
						onChange={this.onNotificationTimeChange}
						class="btn btn--primary Settings__time"
						disabled={!state.pushEnabled}
					>
						{optionsTime}
					</select>
				</div>
				<div class="Settings__row">
					<select
						class="btn btn--primary Settings__time"
						value={state.theme}
						onChange={this.onThemeChange}
					>
						{optionsTheme}
					</select>
				</div>
				{this.renderPaymentButton()}
				{this.renderPaymentMessage()}
			</div>
		);
	}
}

export default Settings;
