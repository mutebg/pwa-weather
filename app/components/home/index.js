import './style.scss';
import {h, Component} from 'preact';
import Sky from '../sky';
import Current from '../current';
import Hourly from '../hourly';
import Daily from '../daily';
import config from '../../config';
import Store from '../../utils/store';
import {get} from '../../utils/api';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: Store.get('weather'),
    }
  }

  async loadData() {
    try {
      const data = await get('weather');
      this.setState({
        data
      }, () => {
        Store.set('weather', this.state.data);
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.loadData();
  }

  render(props, state) {
    if ( !state.data ) {
      return <div>Loading</div>
    }

    let { currently, daily, hourly } = state.data;

    currently.sunriseTime = daily.data[0].sunriseTime;
    currently.sunsetTime = daily.data[0].sunsetTime;
    currently.moonPhase = daily.data[0].moonPhase;

    return (
      <div class="Home">
        {
          // <Sky />
        }
        {
          <Current { ...currently } />
        }
        {
          <Hourly data={ hourly.data } />
        }
        {
          <Daily data={ daily.data } />
        }

        <p><a href="/settings">SETTINGS</a></p>
        <p>POWERED BY DARK SKY</p>
      </div>
    );
  }
}

export default Home;
