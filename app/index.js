import './scss/reset.scss';
import './scss/index.scss';
import { h, render, Component } from 'preact';
import Router from 'preact-router';
import Today from './components/todaypage';
import Daily from './components/dailypage';
import Hourly from './components/hourlypage';
import Settings from './components/settings';
import Navigation from './components/navigation';
import Store from './utils/store';
import {get} from './utils/api';
import { getCurrentPosition } from './utils/location';


class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    }
  }

  async loadRemoteData() {
    try {
      //get current user location
      const {latitude, longitude} = await getCurrentPosition();

      //save current user location
      Store.set('location', {latitude, longitude});

      //get weather forecast for current location
      const data = await get(`weather?latitude=${latitude}&longitude=${longitude}`);

      //update the state and render weather data
      this.setState({
        data
      }, () => {
        //keep data in local storage, using it next time when app is open
        Store.set('weather', this.state.data);
      });

    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    //load local data
    Store.get('weather').then(data => this.setState({data}));

    //load remote data
    this.loadRemoteData();
  }

  render(props, state) {
    if ( !state.data ) {
      return <div>Loading</div>
    }

    let { currently, daily, hourly } = state.data;

    currently.sunrise = daily.data[0].sunriseTime;
    currently.sunset = daily.data[0].sunsetTime;
    currently.hours = hourly.data

    return (
      <div class="main">
        <div class="page">
          <Router>
            <Today data={currently} path="/"  />
            <Hourly {...hourly} path="/hourly" />
            <Daily {...daily} path="/daily" />
            <Settings path="/settings" />
          </Router>
        </div>
        <Navigation />
      </div>
    )
  }
}


render(<Main />, document.body);

require('./manifest.json');
