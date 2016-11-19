import './style.scss';
import {h, Component} from 'preact';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

class Daily extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const skycons = new Skycons({"color": "black"});
    this.props.data.forEach( (item, index) => {
      let key = item.icon.replace(/-/g, '_').toUpperCase();
      skycons.add('daily' + index, Skycons[key]);
    });
    skycons.play();
  }

  handleClick(index) {
    let selected = this.state.selected;
    let arrayIndex = selected.indexOf(index);
    if ( arrayIndex >= 0 ) {
      selected.splice(arrayIndex, 1);
    } else {
      selected.push(index);
    }
    this.setState({selected: selected.sort() });
  }

  render(props, state) {

    let opened = 0;
    let days = props.data.slice(0, 24).map( (item, index) => {

      let date = new Date(item.time * 1000);
      let day = DAYS_OF_WEEK[ date.getDay() ];
      if ( index == 0 ) {
        day = 'Today';
      } else if ( index == 1 ) {
        day = 'Tomorrow';
      }

      if ( state.selected.includes( index - 1 ) ) {
        opened++;
      };

      let style = {transform: `translate3d(0, ${opened * 86}px, 0)`};
      return (
        <div class="Daily__row" onClick={ () => this.handleClick(index) } style={style}>
          <div class="Daily__main">
            <div class="Daily__icon">
              <canvas id={'daily' + index} width="50" height="50"></canvas>
            </div>
            <div class="Daily__cont">
              <div class="Daily__top">
                <div class="Daily__time">{ day }</div>
                <div class="Daily__temp">{ Math.round(item.temperatureMin)}&deg; { Math.round(item.temperatureMax)}&deg;</div>
              </div>
              <div class="Daily__down">{item.summary}
              </div>
            </div>
          </div>
          {
          <div class="Daily__detail">
            <div class="Daily__detail-row">
              <div class="Daily__detail-icon"></div>
              <div class="Daily__detail-value">{item.windSpeed}</div>
              <div class="Daily__detail-label">{item.windBearing}</div>
            </div>
            <div class="Daily__detail-row">
              <div class="Daily__detail-icon"></div>
              <div class="Daily__detail-value">{ Math.round(item.precipProbability * 100) }%</div>
              <div class="Daily__detail-label">{item.precipIntensity} cm</div>
            </div>
            <div class="Daily__detail-row">
              <div class="Daily__detail-icon"></div>
              <div class="Daily__detail-value">{ Math.round(item.humidity * 100)}%</div>
              <div class="Daily__detail-label">Humidity</div>
            </div>
            <div class="Daily__detail-row">
              <div class="Daily__detail-icon"></div>
              <div class="Daily__detail-value">{ Math.round(item.dewPoint) }&deg;</div>
              <div class="Daily__detail-label">Dew Point</div>
            </div>
            <div class="Daily__detail-row">
              <div class="Daily__detail-icon"></div>
              <div class="Daily__detail-value">{ Math.round(item.pressure)} hPa</div>
              <div class="Daily__detail-label">Pressure</div>
            </div>
          </div>
          }
        </div>
      );
    });

    return (
      <div className="Daily" style={{paddingBottom: opened * 86}}>
        {days}
      </div>
    );
  }
}

export default Daily;
