import './style.scss';
import {h, Component} from 'preact';
import { degToCompass } from '../../utils/wind';


class Current extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const skycons = new Skycons({"color": "white"});
    let key = this.props.icon.replace(/-/g, '_').toUpperCase();
    skycons.add('main', Skycons[key]);
    skycons.play();
  }

  render(props) {
    const date = new Date(props.time * 1000);
    const sunriseTime = new Date( props.sunriseTime * 1000);
    const sunsetTime = new Date( props.sunsetTime * 1000);

    return (
      <div class="box Current">
        <div class="Current__main">
          <div class="Current__icon">
            <canvas width="64" height="64" id="main"></canvas>
          </div>
          <div class="Current__text">
            <div class="Current__title">Right now</div>
            <div class="Current__summery">{props.summary}</div>
          </div>
          <div class="Current__temp">
            { Math.round(props.temperature) }°
          </div>
        </div>

        <div class="Current__row">
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ props.windSpeed}</div>
            <div class="Current__col-label">{ degToCompass(props.windBearing) }</div>
          </div>
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ Math.round(props.precipProbability * 100) }%</div>
            <div class="Current__col-label">{props.precipIntensity} cm</div>
          </div>
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ sunsetTime.getHours() + ':' + sunsetTime.getMinutes() }</div>
            <div class="Current__col-label">Sunset</div>
          </div>
        </div>

        <div class="Current__row">
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ props.moonPhase }</div>
            <div class="Current__col-label"></div>
          </div>
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ Math.round(props.humidity * 100)}%</div>
            <div class="Current__col-label">Humidity</div>
          </div>
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ Math.round(props.dewPoint) }&deg;</div>
            <div class="Current__col-label">Dew Point</div>
          </div>
        </div>

        <div class="Current__row">
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ Math.round(props.pressure)}hPa</div>
            <div class="Current__col-label">Pressure</div>
          </div>
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">N/A</div>
            <div class="Current__col-label">Visibility</div>
          </div>
          <div class="Current__col">
            <div class="Current__col-icon"></div>
            <div class="Current__col-value">{ Math.round(props.apparentTemperature)}&deg;</div>
            <div class="Current__col-label">Feels</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Current;
