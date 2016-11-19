import './style.scss';
import {h, Component} from 'preact';
import WeatherRow from '../weatherrow';


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
    let days = props.data.map( (item, index) => {

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

      item.style = {transform: `translate3d(0, ${opened * 86}px, 0)`};
      item.onClick = () => this.handleClick(index);
      item.isOpen = state.selected.includes(index);
      item.temp = Math.round(item.temperatureMin) + '° ' + Math.round(item.temperatureMax) + '°';
      item.title = day;
      item.id = 'd-' + index;
      return <WeatherRow {...item} />
    });

    return (
      <div className="box Daily" style={{paddingBottom: opened * 86}}>
        {days}
      </div>
    );
  }
}

export default Daily;
