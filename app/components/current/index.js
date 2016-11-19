import './style.scss';
import {h, Component} from 'preact';

class Current extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    const date = new Date(this.props.time * 1000);
    return (
      <div class="box Current">
        <div class="Current__temp">{ props.temperature }</div>
        <div class="Current__summary">{ props.summary }</div>
        <div class="Current__time">{ date.toLocaleString() }</div>
      </div>
    );
  }
}

export default Current;
