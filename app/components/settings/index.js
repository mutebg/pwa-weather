import './style.scss';
import {h, Component} from 'preact';
import { initialiseState, subscribe, unsubscribe, sendUpdateSubscriptionToServer } from '../../utils/push';
import { requestPayment } from '../../utils/payment';
import Store from '../../utils/store';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pushSubscription: null,
      pushEnabled: false,
      pushButtonLabel: 'Enable Push Messages',
      pushButtonDisabled: true,
      notificationTime: '08:00',
      showPaymentBtn: false,
      successPayment: false,
      paymentData: null,
    }

    this.togglePushSubscribe = this.togglePushSubscribe.bind(this);
    this.onNotificationTimeChange = this.onNotificationTimeChange.bind(this);
    this.makePayment = this.makePayment.bind(this);
  }

  componentDidMount() {
    initialiseState( this );

    if ( 'PaymentRequest' in window ) {
      this.setState({
        showPaymentBtn: true,
      })
    }
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
        sendUpdateSubscriptionToServer(this.state.subscription, this.state.time);
      }
    });
  }

  makePayment() {
    requestPayment().then( e => {
      this.setState({
        successPayment: true,
        paymentData: e,
      });
    }).catch(err => {
      this.setState({
        successPayment: true,
        paymentData: err,
      });
    });
  }

  render(props, state) {
    console.log('state', state);
    return (
      <div class="Settings">
        <div class="Settings__row">
          <label class="Settings__header">Daily Summary</label>
          <span class="Settings__sub">Deliver notification with the forecaast fot the day at selected time</span>
          <button class="btn" disabled={state.pushButtonDisabled} onClick={ () => this.togglePushSubscribe() }>
            {state.pushButtonLabel}
          </button>
        </div>
        <div class="Settings__row Settings__row--time">
          <button class="btn btn--primary" disabled={state.pushButtonDisabled}>
            Notificaiton time: {state.notificationTime}
          </button>
          <input type="time" value={state.notificationTime} onChange={this.onNotificationTimeChange} class="Settings__time" disabled={state.pushButtonDisabled}/>
        </div>
        { this.renderPaymentButton() }
        { this.renderPaymentMessage() }

      </div>
    );
  }

  renderPaymentButton() {
    if ( this.state.showPaymentBtn ) {
      return (
        <div class="Settings__row">
          <label class="Settings__header">Support the project, make donation:</label>
          <button class="btn"  onClick={ this.makePayment }>
            Donate 5 EUR
          </button>
        </div>
      )
    }
    return null;
  }

  renderPaymentMessage() {
    if ( this.state.paymentData ) {
      let details = this.state.paymentData.details;
      details.cardNumber = 'XXXX-XXXX-XXXX-' + details.cardNumber.substr(12);
      details.cardSecurityCode = '***';

      let string = JSON.stringify({
        methodName: this.state.paymentData.methodName,
        details: details
      }, undefined, 2);
      return <pre>{string}</pre>;
    }
    return null;
  }
}

export default Settings;
