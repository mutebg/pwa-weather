import { Component } from 'preact';
import Router from 'preact-router';
import Today from './components/todaypage';
import Daily from './components/dailypage';
import Hourly from './components/hourlypage';
import Settings from './components/settings';
import Navigation from './components/navigation';
import Alert from './components/alert';
import Icon from './components/icon';
import Store from './utils/store';
import { get } from './utils/api';
import { getCurrentPosition } from './utils/location';
// import Today from 'async!./components/todaypage';
// import Daily from 'async!./components/dailypage';
// import Hourly from 'async!./components/hourlypage';
// import Settings from 'async!./components/settings';

import './scss/reset.scss';
import './scss/index.scss';

export default class Main extends Component {
	onRouteChange() {
		const pageElement = document.querySelector('.page');
		if (pageElement) {
			pageElement.scrollTop = 0;
			this.setState({
				currentURL: window.location.pathname
			});
		}
	}

	updateOnlineStatus() {
		const isOffline = !navigator.onLine;
		this.setState({
			isOffline
		});
	}

	async loadRemoteData() {
		try {
			// get current user location
			const { latitude, longitude } = await getCurrentPosition();

			// save current user location
			Store.set('location', { latitude, longitude });

			this.setState({ isUpdating: true, hasPermission: true });

			// get weather forecast for current location
			const data = await get(
				`weather?latitude=${latitude}&longitude=${longitude}`
			);

			// update the state and render weather data
			this.setState(
				{
					isUpdating: false,
					data,
					error: null
				},
				() => {
					// keep data in local storage, using it next time when app is open
					Store.set('weather', this.state.data);
				}
			);
		}
		catch (err) {
			this.setState({
				error: err.message,
				isUpdating: false
			});

			// clear the error after 5 sec
			setTimeout(() => {
				this.setState({ error: '' });
			}, 5000);
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			data: null,
			currentURL: '/',
			isUpdating: false,
			hasPermission: true,
			error: null,
			isOffline: false
		};

		this.onRouteChange = this.onRouteChange.bind(this);
		this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
	}

	componentDidMount() {
		// load local data
		Store.get('weather').then(data => this.setState({ data }));

		// if permissions api exists try first to ask user for Permission
		// otherwise just ask for for location
		if (typeof window !== 'undefined' && 'permissions' in navigator) {
			navigator.permissions.query({ name: 'geolocation' }).then(result => {
				if (result.state === 'granted') {
					this.setState({
						hasPermission: true
					});
					this.loadRemoteData();
				}
				else if (result.state === 'prompt') {
					this.setState({
						hasPermission: false
					});
				}
				else {
					// Permission was denied.
					// this fails to location based on IP
					this.loadRemoteData();
				}
			});
		}
		else {
			// safari does not support permission api so just ask for location
			this.loadRemoteData();
		}

		addEventListener('online', this.updateOnlineStatus);
		addEventListener('offline', this.updateOnlineStatus);
	}

	renderLoading() {
		return (
			<div style={{ marginTop: 25 }}>
				<div class="Today__summary">Loading</div>
				<div class="Today__icon">
					<Icon name="loading" />
				</div>
			</div>
		);
	}

	renderNoPermission() {
		const reqAccess = () => this.loadRemoteData();
		return (
			<div style={{ marginTop: 25 }} onClick={reqAccess}>
				<div class="Today__summary">Access location</div>
				<div class="Today__icon">
					<Icon name="loading" />
				</div>
				<div class="LocationAccess">
					<p>
						Let me access your location in order to give you correct forecast
					</p>
					<button class="btn btn--primary">Enable location</button>
					<button class="btn">Not now</button>
				</div>
			</div>
		);
	}

	render(props, state) {
		if (!state.hasPermission) {
			return this.renderNoPermission();
		}

		if (!state.data) {
			return this.renderLoading();
		}

		const { currently, daily, hourly } = state.data;

		currently.sunrise = daily.data[0].sunriseTime;
		currently.sunset = daily.data[0].sunsetTime;
		currently.hours = hourly.data;

		return (
			<div class="main">
				<div class="page">
					{<Alert message={state.error} />}
					{state.isOffline ? <Alert message={'You are offline'} /> : null}
					<Router onChange={this.onRouteChange}>
						<Today data={currently} path="/" isUpdating={state.isUpdating} />
						<Hourly {...hourly} path="/hourly" />
						<Daily {...daily} path="/daily" />
						<Settings path="/settings" />
					</Router>
					<p class="copyright">
						POWERED BY DARK SKY<br />
						<a href="https://github.com/mutebg/pwa-weather" target="blank">
							SOURCE CODE
						</a>
					</p>
				</div>
				<Navigation currentURL={state.currentURL} />
			</div>
		);
	}
}

if (process.env.NODE_ENV === 'production') {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('serv-worker.js')
			.then(registration => {
				console.log('SW registerd');
			})
			.catch(error => {
				console.log('SW fail to register', error);
			});
	}
}
