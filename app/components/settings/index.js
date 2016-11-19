import './style.scss';
import {h, Component} from 'preact';
import { initialiseState, subscribe, unsubscribe, sendUpdateSubscriptionToServer } from '../../utils/push';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pushSubscription: null,
      pushEnabled: false,
      pushButtonLabel: 'Enable Push Messages',
      pushButtonDisabled: true,
      notificationTime: '08:00',
    }

    this.togglePushSubscribe = this.togglePushSubscribe.bind(this);
    this.onNotificationTimeChange = this.onNotificationTimeChange.bind(this);
  }

  componentDidMount() {
    initialiseState( this );
  }

  togglePushSubscribe() {
    if ( this.state.pushEnabled ) {
      unsubscribe(this);
    } else {
      subscribe(this);
    }
  }

  onNotificationTimeChange(e) {
    if ( !e.srcElement.value ) {
      return;
    }
    this.setState({
      notificationTime: e.srcElement.value,
    }, () => {
      if ( this.state.subscription ) {
        //update notification time on the server
        sendUpdateSubscriptionToServer(this.state.subscription)
      }
    });
  }

  render(props, state) {
    console.log('state', state);
    return (
      <div class="Settings">
        <div class="Settings__title">
          <label>Daily notifications with weweather</label>
          <button disabled={state.pushButtonDisabled} onClick={ () => this.togglePushSubscribe() }>
            {state.pushButtonLabel}
          </button>
        </div>
        <button disabled={state.pushButtonDisabled}>
          Notificaiton time: {state.notificationTime}
        </button>
        <p>Time: <input type="time" value={state.notificationTime} onChange={this.onNotificationTimeChange} /></p>


      </div>
    );
  }
}

export default Settings;
