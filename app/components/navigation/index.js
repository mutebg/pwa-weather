import './style.scss';
import {h, Component} from 'preact';

class Sky extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="Navigation">
          <a class="Navigation__item" href="/">
            <span class="Navigation__icon"></span>
            <span class="Navigation__label">Today</span>
          </a>
          <a class="Navigation__item" href="/hourly">
            <span class="Navigation__icon"></span>
            <span class="Navigation__label">48 Hours</span>
          </a>
          <a class="Navigation__item" href="/daily">
            <span class="Navigation__icon"></span>
            <span class="Navigation__label">10 Days</span>
          </a>
          <a class="Navigation__item" href="/settings">
            <span class="Navigation__icon"></span>
            <span class="Navigation__label">Settings</span>
          </a>
      </div>
    );
  }
}

export default Sky;
