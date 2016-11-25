import './style.scss';
import {h, Component} from 'preact';
import HourlyBar from '../hourlybar';


class Hourly extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {

    let {data, summary} = props;

    return (
      <div class="Hourly">
        <div class="Today__summary" style={{marginBottom: 25}}>{summary}</div>
        <HourlyBar  data={data.slice(0, 48)} />
      </div>
    );
  }
}

export default Hourly;
