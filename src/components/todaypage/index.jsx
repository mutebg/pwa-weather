//// import { h } from 'preact';
import HourlyBar from '../hourlybar';
import Icon from '../icon';
import Wind from '../wind';
import { formatDate } from '../../utils/date';
import './style.scss';

export default function({ data, isUpdating }) {
	const {
		summary,
		icon,
		temperature,
		apparentTemperature,
		humidity,
		windSpeed,
		windBearing,
		precipProbability,
		hours,
		sunset,
		sunrise
	} = data;

	const now = new Date(hours[0].time * 1000);
	const hourLimit = Math.max(24 - now.getHours(), 12);

	const sunriseTime = new Date(sunrise * 1000);
	const sunsetTime = new Date(sunset * 1000);

	let update = `Last update ${formatDate(now)}`;
	if (isUpdating) {
		update = 'is updating...';
	}

	return (
		<div class="Today content">
			<div class="Today__update">{update}</div>
			<div class="Today__summary">{summary}</div>
			<div class="Today__icon">
				<Icon name={icon} />
			</div>
			<div class="Today__more">
				<div class="Today__temp">{Math.round(temperature)}&deg;</div>
				<div class="Today__details">
					<div class="Today__details-row">
						<span>Feels like</span>
						<span>{Math.round(apparentTemperature)}&deg;</span>
					</div>
					<div class="Today__details-row">
						<span>Humidity</span>
						<span>{Math.round(humidity * 100)}%</span>
					</div>
					<div class="Today__details-row">
						<span>Wind</span>
						<span>
							{Math.round(windSpeed)}m/s<Wind rotate={windBearing} size="14" />
						</span>
					</div>
					<div class="Today__details-row">
						<span>Rain</span>
						<span>{Math.round(precipProbability * 100)}% </span>
					</div>
				</div>
			</div>

			<HourlyBar data={hours.slice(0, hourLimit)} />

			<div class="Today__sun">
				Sunrise {`${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`} |
				Sunset {`${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`}
			</div>
		</div>
	);
}
