import './style.scss';
import {h, Component} from 'preact';
import WeatherRow from '../weatherrow';

class Hourly extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
    }

    this.handleClick = this.handleClick.bind(this);
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


      if ( state.selected.includes( index - 1 ) ) {
        opened++;
      };

      let date = new Date(item.time * 1000);
      item.onClick = () => this.handleClick(index);
      item.style = {transform: `translate3d(0, ${opened * 86}px, 0)`};
      item.isOpen = state.selected.includes(index);
      item.temp = Math.round(item.temperature) + '°';
      item.title = date.getHours() + ':00';
      item.addon =  `Feels ${ Math.round(item.apparentTemperature)}°`;
      item.id = 'h-' + index;
      if ( item.precipProbability ) {
        item.addon = `${Math.round(item.precipProbability * 100)}% ${item.precipType} - ` + item.addon;
      }

      return <WeatherRow {...item}  />;
    });

    return (
      <div className="box Hourly" style={{paddingBottom: opened * 86}}>
        {hours}
      </div>
    );
  }
}

export default Hourly;
