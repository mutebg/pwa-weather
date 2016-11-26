import './style.scss';
import {h, Component} from 'preact';
import { degToCompass } from '../../utils/wind';
import HourlyBar from '../hourlybar';
import Icon from '../icon';

class Today extends Component {
  constructor(props) {
    super(props);
  }

  render(props, state) {
    //const date = new Date(props.time * 1000);

    let { summary, icon, temperature, apparentTemperature, humidity,
      windSpeed, windBearing, precipProbability, precipIntensity, hours,
      sunset, sunrise
    } = props.data;

    let now = new Date(hours[0].time * 1000);
    let hourLimit = Math.max( 24 - now.getHours(), 12 );

    const sunriseTime = new Date( sunrise * 1000);
    const sunsetTime = new Date( sunset * 1000);


    return (
      <div class="Today">
        <div class="Today__summary">{summary}</div>
        <div class="Today__icon">
          <Icon name={icon} />
        </div>
        <div class="Today__more">
          <div class="Today__temp">{ Math.round(temperature)}&deg;</div>
          <div class="Today__details">
            <div class="Today__details-row">
              <span>Feels like</span>
              <span>{ Math.round(apparentTemperature)}&deg;</span>
            </div>
            <div class="Today__details-row">
              <span>Humidity</span>
              <span>{Math.round(humidity * 100) }%</span>
            </div>
            <div class="Today__details-row">
              <span>Wind</span>
              <span>{windSpeed} {degToCompass(windBearing)}</span>
            </div>
            <div class="Today__details-row">
              <span>Rain</span>
              <span>{Math.round(precipProbability * 100) }% </span>
            </div>
          </div>
        </div>

        <HourlyBar data={hours.slice(0, hourLimit)} />

        <div class="Today__sun">
          Sunrise {sunriseTime.getHours() + ':' + sunriseTime.getMinutes() } |
          Sunset {sunsetTime.getHours() + ':' + sunsetTime.getMinutes()}
        </div>
      </div>
    );
  }
}

export default Today;
