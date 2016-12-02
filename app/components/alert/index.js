import './style.scss';
import {h, Component} from 'preact';

class Alert extends Component {
  constructor(props) {
    super(props);
  }

  render(props, state) {
    if ( props.message ) {
      return (
        <div class="Alert">{props.message}</div>
      );
    }
    return null;
  }
}

export default Alert;
