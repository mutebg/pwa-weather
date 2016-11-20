import './style.scss';
import {h, Component} from 'preact';
import { degToCompass } from '../../utils/wind';


class WeatherRow extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    if ( this.props.id && this.props.icon ) {
      const skycons = new Skycons({"color": "white"});
      let key = this.props.icon.replace(/-/g, '_').toUpperCase();
      skycons.add(this.props.id, Skycons[key]);
      skycons.play();
    }
  }

  render(props, state) {
    let { style, onClick, isOpen, id, ...rest } = props;

    let detailsStyle = isOpen ? { opacity: 1 } : null;

    return (
      <div class="WeatherRow" style={style} onClick={onClick} >
        <div class="WeatherRow__main">
          <div class="WeatherRow__icon">
            <canvas width="50" height="50" id={id}></canvas>
          </div>
          <div class="WeatherRow__cont">
            <div class="WeatherRow__top">
              <div class="WeatherRow__time">{ rest.title }</div>
              <div class="WeatherRow__temp">{ rest.temp }</div>
            </div>
            <div class="WeatherRow__down">
              <div class="WeatherRow__summary">{rest.summary }</div>
              <div class="WeatherRow__addon">{ rest.addon }</div>
            </div>
          </div>
        </div>
        <div class="WeatherRow__detail" style={detailsStyle}>
          <div class="WeatherRow__detail-row">
            <div class="WeatherRow__detail-icon"></div>
            <div class="WeatherRow__detail-value">{rest.windSpeed}</div>
            <div class="WeatherRow__detail-label">{ degToCompass(rest.windBearing) }</div>
          </div>
          <div class="WeatherRow__detail-row">
            <div class="WeatherRow__detail-icon"></div>
            <div class="WeatherRow__detail-value">{ Math.round(rest.precipProbability * 100) }%</div>
            <div class="WeatherRow__detail-label">{rest.precipIntensity} cm</div>
          </div>
          <div class="WeatherRow__detail-row">
            <div class="WeatherRow__detail-icon"></div>
            <div class="WeatherRow__detail-value">{ Math.round(rest.humidity * 100)}%</div>
            <div class="WeatherRow__detail-label">Humidity</div>
          </div>
          <div class="WeatherRow__detail-row">
            <div class="WeatherRow__detail-icon"></div>
            <div class="WeatherRow__detail-value">{ Math.round(rest.dewPoint) }&deg;</div>
            <div class="WeatherRow__detail-label">Dew Point</div>
          </div>
          <div class="WeatherRow__detail-row">
            <div class="WeatherRow__detail-icon"></div>
            <div class="WeatherRow__detail-value">{ Math.round(rest.pressure)}hPa</div>
            <div class="WeatherRow__detail-label">Pressure</div>
          </div>
        </div>
      </div>
    );
  }
}

export default WeatherRow;
