import './style.scss';
import {h, Component} from 'preact';
import Sky from '../sky';
import Current from '../current';
import Hourly from '../hourly';
import Daily from '../daily';
import config from '../../config';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
    }
  }

  async loadData() {
    try {
      const url = config.API_URL + 'weather';
      const response = await fetch( url );
      const data = await response.json();
      this.setState({
        data
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.loadData();
  }

  render(props, state) {
    let { currently, daily, hourly } = state.data;

    if ( ! currently ) {
      return <div>Loading</div>
    }

    return (
      <div class="Home">
        {
          <Sky />
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
