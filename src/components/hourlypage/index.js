// import { h } from 'preact';
import HourlyBar from '../hourlybar';
import './style.scss';

export default function({ data, summary }) {
	return (
		<div class="Hourly content">
			<div class="Today__summary" style={{ marginBottom: 25 }}>
				{summary}
			</div>
			<HourlyBar data={data.slice(0, 48)} />
		</div>
	);
}
