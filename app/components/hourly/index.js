import './style.scss';
import {h, Component} from 'preact';
import { degToCompass } from '../../utils/wind';

class Hourly extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const skycons = new Skycons({"color": "black", "background": "white"});
    this.props.data.slice(0, 24).forEach( (item, index) => {
      let key = item.icon.replace(/-/g, '_').toUpperCase();
      skycons.add('hourly' + index, Skycons[key]);
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
    let hours = props.data.slice(0, 24).map( (item, index) => {

      let date = new Date(item.time * 1000);
      if ( state.selected.includes( index - 1 ) ) {
        opened++;
      };

      let style = {transform: `translate3d(0, ${opened * 86}px, 0)`};
      return (
        <div class="Hourly__row" onClick={ () => this.handleClick(index) } style={style}>
          <div class="Hourly__main">
            <div class="Hourly__icon">
              <canvas id={'hourly' + index} width="50" height="50"></canvas>
            </div>
            <div class="Hourly__cont">
              <div class="Hourly__top">
                <div class="Hourly__time">{ date.getHours() }:00</div>
                <div class="Hourly__temp">{ Math.round(item.temperature)}&deg;</div>
              </div>
              <div class="Hourly__down">
                <div class="Hourly__summary">{item.summary}</div>
                <div class="Hourly__addon">{ Math.round(item.precipProbability * 100) }% {item.precipType} -
                  Feels { Math.round(item.apparentTemperature)}&deg;</div>
              </div>
            </div>
          </div>
          <div class="Hourly__detail">
            <div class="Hourly__detail-row">
              <div class="Hourly__detail-icon"></div>
              <div class="Hourly__detail-value">{item.windSpeed}</div>
              <div class="Hourly__detail-label">{ degToCompass(item.windBearing) }</div>
            </div>
            <div class="Hourly__detail-row">
              <div class="Hourly__detail-icon"></div>
              <div class="Hourly__detail-value">{ Math.round(item.precipProbability * 100) }%</div>
              <div class="Hourly__detail-label">{item.precipIntensity} cm</div>
            </div>
            <div class="Hourly__detail-row">
              <div class="Hourly__detail-icon"></div>
              <div class="Hourly__detail-value">{ Math.round(item.humidity * 100)}%</div>
              <div class="Hourly__detail-label">Humidity</div>
            </div>
            <div class="Hourly__detail-row">
              <div class="Hourly__detail-icon"></div>
              <div class="Hourly__detail-value">{ Math.round(item.dewPoint) }&deg;</div>
              <div class="Hourly__detail-label">Dew Point</div>
            </div>
            <div class="Hourly__detail-row">
              <div class="Hourly__detail-icon"></div>
              <div class="Hourly__detail-value">{ Math.round(item.pressure)} hPa</div>
              <div class="Hourly__detail-label">Pressure</div>
            </div>

          </div>
        </div>
      );
    });

    return (
      <div className="Hourly" style={{paddingBottom: opened * 86}}>
        {hours}
      </div>
    );
  }
}

export default Hourly;
