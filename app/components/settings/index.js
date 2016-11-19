import './style.scss';
import {h, Component} from 'preact';
import { initialiseState, subscribe, unsubscribe } from '../../utils/push';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pushEnabled: false,
      pushButtonLabel: 'Enable Push Messages',
      pushButtonDisabled: true,
    }

    this.togglePushSubscribe = this.togglePushSubscribe.bind(this);
  }

  componentDidMount() {
    initialiseState( this );
  }

  togglePushSubscribe() {
    console.log('click on toggle');
    if ( this.state.pushEnabled ) {
      console.log('unsubscribe');
      unsubscribe(this);
    } else {
      console.log('subscribe');
      subscribe(this);
    }
  }

  render(props, state) {
    console.log('state', state);
    return (
      <div class="Settings">
        <div class="Settings__row">
          <label>Daily notifications with weweather</label>
          <button disabled={state.pushButtonDisabled} onClick={ () => {
            console.log('button is clicked');
            this.togglePushSubscribe();
          }}>
            {state.pushButtonLabel}
          </button>
        </div>

        <p>Time: <input type="time" value="08:00" /></p>

      </div>
    );
  }
}

export default Settings;
