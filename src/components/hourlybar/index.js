import { Component } from 'preact';
import Wind from '../wind';
import './style.scss';

class HourlyBar extends Component {
	changeSelected(selected) {
		this.setState({ transition: true });

		setTimeout(() => {
			this.setState({ selected });
		}, 500);

		setTimeout(() => {
			this.setState({ transition: false });
		}, 1000);
	}

	constructor(props) {
		super(props);

		this.state = {
			selected: 'temp',
			transition: false
		};

		this.navs = ['temp', 'precip', 'wind', 'humidity'];

		this.changeSelected = this.changeSelected.bind(this);
	}

	renderNav() {
		return this.navs.map(item => (
			<button
				class={item === this.state.selected ? 'selected' : null}
				onClick={() => this.changeSelected(item)}
			>
				{item}
			</button>
		));
	}

	render(props, state) {
		const hours = props.data.map((item, index) => {
			const date = new Date(item.time * 1000);
			const label = index === 0 ? 'Now' : `${date.getHours()}:00`;
			return <div>{label}</div>;
		});

		const values = props.data.map(item => {
			switch (state.selected) {
				case 'temp':
					return <div>{`${Math.round(item.temperature)} °`}</div>;
				case 'precip':
					return <div>{Math.round(item.precipProbability * 100)}%</div>;
				case 'wind':
					return (
						<div>
							{Math.round(item.windSpeed)}m/s
							<Wind rotate={item.windBearing} size="14" />
						</div>
					);
				case 'humidity':
					return <div>{item.humidity}%</div>;
				default:
					return null;
			}
		});

		const groups = props.data.reduce((accumulator, currentValue) => {
			const last = accumulator[accumulator.length - 1] || 0;
			if (last && last.summary === currentValue.summary) {
				accumulator[accumulator.length - 1].value += 1;
			}
			else {
				accumulator.push({
					summary: currentValue.summary,
					value: 1
				});
			}
			return accumulator;
		}, []);

		const summaries = groups.map(item => (
			<div class={`size-${item.value}`}>{item.summary}</div>
		));

		const scales = groups.map(item => {
			const summaryClass = item.summary.toLowerCase().replace(/ /g, '-');
			return <div class={`size-${item.value} ${summaryClass}`} />;
		});

		return (
			<div
				class={`HourlyBar ${state.transition ? 'HourlyBar--transition' : ''}`}
			>
				<div class="HourlyBar__hours">{hours}</div>
				<div class="HourlyBar__values">{values}</div>
				<div class="HourlyBar__scale">{scales}</div>
				<div class="HourlyBar__summaries">{summaries}</div>
				<div class="HourlyBar__nav">{this.renderNav()}</div>
			</div>
		);
	}
}

export default HourlyBar;
