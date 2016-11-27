import './style.scss';
import {h, Component} from 'preact';
import { degToCompass } from '../../utils/wind';

class HourlyBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'temp',
      transition: false,
    }

    this.navs = [
      'temp',
      'precip',
      'wind',
      'humidity'
    ];

    this.changeSelected = this.changeSelected.bind(this);
  }

  changeSelected(selected) {
    this.setState({transition: true});

    setTimeout( () => {
      this.setState({selected});
    }, 500);

    setTimeout( () => {
      this.setState({transition: false});
    }, 1000);
  }

  render(props, state) {

    let opened = 0;
    let hours = props.data.map( (item, index) => {
      let date = new Date(item.time * 1000);
      let label = index == 0 ? 'Now' : date.getHours() + ':00';
      return <div>{label}</div>
    });

    let values = props.data.map( (item, index) => {
      switch( state.selected ) {
        case 'temp':
          return <div>{Math.round(item.temperature) + '°'}</div>;
        case 'precip':
          return <div>{Math.round(item.precipProbability * 100) }%</div>;
        case 'wind':
          return <div>{Math.round(item.windSpeed)}m/s /</div>;
        case 'humidity':
          return <div>{item.humidity}%</div>;
      }
    });

    let groups = props.data.reduce( (accumulator, currentValue) => {
      let last = accumulator[ accumulator.length - 1 ] || 0;
      if ( last && last.summary == currentValue.summary ) {
        accumulator[ accumulator.length - 1 ].value++;
      } else {
        accumulator.push({
          summary: currentValue.summary,
          value: 1,
        });
      }
      return accumulator;
    }, [])

    var summaries = groups.map( item => {
      return <div class={'size-' + item.value }>{item.summary}</div>
    });

    var scales = groups.map( item => {
      let summaryClass = item.summary.toLowerCase().replace(' ', '-');
      return <div class={'size-' + item.value + ' ' + summaryClass }></div>
    });

    return (
      <div class={'HourlyBar ' + ( state.transition ? 'HourlyBar--transition' : '' )}>
        <div class="HourlyBar__hours">{hours}</div>
        <div class="HourlyBar__values">{values}</div>
        <div class="HourlyBar__scale">{scales}</div>
        <div class="HourlyBar__summaries">{summaries}</div>
        <div class="HourlyBar__nav">
          { this.renderNav() }
        </div>
      </div>
    );
  }

  renderNav() {
    return this.navs.map( item => {
      return <button class={ item == this.state.selected ? 'selected' : null } onClick={ () => this.changeSelected(item) }>{item}</button>
    })
  }
}

export default HourlyBar;
