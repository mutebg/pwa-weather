import { h, render, Component } from 'preact';
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

import './scss/reset.scss';
import './scss/index.scss';


class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      currentURL: '/',
      isUpdating: false,
      error: null,
    };

    this.onRouteChange = this.onRouteChange.bind(this);
  }

  componentDidMount() {
    // load local data
    Store.get('weather').then(data => this.setState({ data }));

    // load remote data
    this.loadRemoteData();
  }

  onRouteChange() {
    const pageElement = document.querySelector('.page');
    if (pageElement) {
      pageElement.scrollTop = 0;
      this.setState({
        currentURL: window.location.pathname,
      });
    }
  }

  async loadRemoteData() {
    try {
      // get current user location
      const { latitude, longitude } = await getCurrentPosition();

      // save current user location
      Store.set('location', { latitude, longitude });

      this.setState({ isUpdating: true });

      // get weather forecast for current location
      const data = await get(`weather?latitude=${latitude}&longitude=${longitude}`);

      // update the state and render weather data
      this.setState({
        isUpdating: false,
        data,
        error: null,
      }, () => {
        // keep data in local storage, using it next time when app is open
        Store.set('weather', this.state.data);
      });
    } catch (err) {
      this.setState({
        error: err.message,
      });

      // clear the error after 5 sec
      setTimeout(() => {
        this.setState({ error: '' });
      }, 5000);
    }
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

  render(props, state) {
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
          <Alert message={state.error} />
          <Router onChange={this.onRouteChange}>
            <Today data={currently} path="/" isUpdating={state.isUpdating} />
            <Hourly {...hourly} path="/hourly" />
            <Daily {...daily} path="/daily" />
            <Settings path="/settings" />
          </Router>
          <p class="copyright">POWERED BY DARK SKY</p>
        </div>
        <Navigation currentURL={state.currentURL} />
      </div>
    );
  }
}

const container = document.getElementById('app');
container.innerHTML = '';
render(<Main />, container);

require('./manifest.json');
