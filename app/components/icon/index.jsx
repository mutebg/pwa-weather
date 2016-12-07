import { h, Component } from 'preact';
import './style.scss';


class Icon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'temp',
      transition: false,
    };
  }

  renderClear(status) {
    return (
      <div class="icon icon--clear">
        <div class={`circle circle--${status}`} />
        <div class="h-line h-line--1 l-hide" />
        <div class="h-line h-line--2 l-hide" />
        <div class="h-line h-line--3 l-hide" />
        <div class="h-line h-line--4 l-hide" />
        <div class="h-line h-line--5 l-hide" />
        <div class="h-line h-line--6 l-hide" />
        <div class="h-line h-line--7 l-hide" />
        <div class="h-line h-line--8 l-hide" />
        <div class="v-line v-line--1 l-hide" />
        <div class="v-line v-line--2 l-hide" />
        <div class="v-line v-line--3 l-hide" />
        <div class="v-line v-line--4 l-hide" />
        <div class="v-line v-line--5 l-hide" />
        <div class="v-line v-line--6 l-hide" />
        <div class="v-line v-line--7 l-hide" />
        <div class="v-line v-line--8 l-hide" />
        <div class="v-line v-line--9 l-hide" />
      </div>
    );
  }

  renderPartlyCloudy(status) {
    return (
      <div class="icon icon--partly">
        <div class={`circle circle--m  circle--${status}`} />
        <div class="h-line h-line--1 h-size-h h-left l-below" />
        <div class="h-line h-line--2 h-size-h h-left l-below" />
        <div class="h-line h-line--3 h-size-h h-left l-below" />
        <div class="h-line h-line--4 h-size-h h-left l-below" />
        <div class="h-line h-line--5 h-size-h h-right" />
        <div class="h-line h-line--6 h-size-h h-right" />
        <div class="h-line h-line--7 h-size-h h-right" />
        <div class="h-line h-line--8 h-size-h h-right" />
        <div class="v-line v-line--1 l-hide" />
        <div class="v-line v-line--2 l-hide" />
        <div class="v-line v-line--3 l-hide" />
        <div class="v-line v-line--4 l-hide" />
        <div class="v-line v-line--5 l-hide" />
        <div class="v-line v-line--6 l-hide" />
        <div class="v-line v-line--7 l-hide" />
        <div class="v-line v-line--8 l-hide" />
        <div class="v-line v-line--9 l-hide" />
      </div>
    );
  }

  renderCloudy() {
    return (
      <div class="icon icon--cloudy">
        <div class={'circle circle--m'} />
        <div class="h-line h-line--1" />
        <div class="h-line h-line--2" />
        <div class="h-line h-line--3" />
        <div class="h-line h-line--4" />
        <div class="h-line h-line--5" />
        <div class="h-line h-line--6" />
        <div class="h-line h-line--7" />
        <div class="h-line h-line--8" />

        <div class="v-line v-line--1 l-hide" />
        <div class="v-line v-line--2 l-hide" />
        <div class="v-line v-line--3 l-hide" />
        <div class="v-line v-line--4 l-hide" />
        <div class="v-line v-line--5 l-hide" />
        <div class="v-line v-line--6 l-hide" />
        <div class="v-line v-line--7 l-hide" />
        <div class="v-line v-line--8 l-hide" />
        <div class="v-line v-line--9 l-hide" />
      </div>
    );
  }

  renderFog() {
    return (
      <div class="icon icon--fog hide">
        <div class="circle circle--night circle-m circle--almost-hidden" />

        <div class="h-line h-line--1" />
        <div class="h-line h-line--2" />
        <div class="h-line h-line--3" />
        <div class="h-line h-line--4" />
        <div class="h-line h-line--5" />
        <div class="h-line h-line--6" />
        <div class="h-line h-line--7" />
        <div class="h-line h-line--8" />

        <div class="v-line v-line--1 l-hide" />
        <div class="v-line v-line--2 l-hide" />
        <div class="v-line v-line--3 l-hide" />
        <div class="v-line v-line--4 l-hide" />
        <div class="v-line v-line--5 l-hide" />
        <div class="v-line v-line--6 l-hide" />
        <div class="v-line v-line--7 l-hide" />
        <div class="v-line v-line--8 l-hide" />
        <div class="v-line v-line--9 l-hide" />
      </div>
    );
  }

  renderRain() {
    return (
      <div class="icon icon--rain">
        <div class="circle circle--m" />

        <div class="h-line h-line--1" />
        <div class="h-line h-line--2 h-size-h" />
        <div class="h-line h-line--3 " />
        <div class="h-line h-line--4 h-size-h" />
        <div class="h-line h-line--5 l-hide" />
        <div class="h-line h-line--6 l-hide" />
        <div class="h-line h-line--7 l-hide" />
        <div class="h-line h-line--8 l-hide" />

        <div class="v-line v-line--1 l-below v-top l-below" />
        <div class="v-line v-line--2 v-size-h v-top l-below" />
        <div class="v-line v-line--3 v-top l-below" />
        <div class="v-line v-line--4 v-size-h v-top l-below" />
        <div class="v-line v-line--5 v-top" />
        <div class="v-line v-line--6 v-size-h v-top" />
        <div class="v-line v-line--7 v-top" />
        <div class="v-line v-line--8 v-size-h v-top" />
        <div class="v-line v-line--9 v-top" />
      </div>
    );
  }

  renderWind() {
    return (
      <div class="icon icon--wind">
        <div class="circle l-hide" />

        <div class="h-line h-line--1 h-size-h h-right" />
        <div class="h-line h-line--2 h-size-h" />
        <div class="h-line h-line--3" />
        <div class="h-line h-line--4 h-size-h h-left" />
        <div class="h-line h-line--5 h-size-h h-left" />
        <div class="h-line h-line--6" />
        <div class="h-line h-line--7 h-size-h" />
        <div class="h-line h-line--8 h-size-h h-left" />

        <div class="v-line v-line--1 l-hide" />
        <div class="v-line v-line--2 l-hide" />
        <div class="v-line v-line--3 l-hide" />
        <div class="v-line v-line--4 l-hide" />
        <div class="v-line v-line--5 l-hide" />
        <div class="v-line v-line--6 l-hide" />
        <div class="v-line v-line--7 l-hide" />
        <div class="v-line v-line--8 l-hide" />
        <div class="v-line v-line--9 l-hide" />
      </div>
    );
  }

  renderSnow() {
    return (
      <div class="icon icon--snow">
        <div class="circle l-hide" />

        <div class="h-line h-line--1" />
        <div class="h-line h-line--2" />
        <div class="h-line h-line--3" />
        <div class="h-line h-line--4" />
        <div class="h-line h-line--5 l-hide" />
        <div class="h-line h-line--6 l-hide" />
        <div class="h-line h-line--7 l-hide" />
        <div class="h-line h-line--8 l-hide" />

        <div class="v-line v-line--1 v-size-dot v-top" />
        <div class="v-line v-line--2 v-size-dot" />
        <div class="v-line v-line--3 v-size-dot v-bottom" />
        <div class="v-line v-line--4 v-size-dot" />
        <div class="v-line v-line--5 v-size-dot v-top" />
        <div class="v-line v-line--6 v-size-dot" />
        <div class="v-line v-line--7 v-size-dot v-bottom" />
        <div class="v-line v-line--8 v-size-dot" />
        <div class="v-line v-line--9 v-size-dot v-top" />
      </div>
    );
  }

  renderSleet() {
    return (
      <div class="icon icon--snow">
        <div class="circle l-hide" />

        <div class="h-line h-line--1" />
        <div class="h-line h-line--2" />
        <div class="h-line h-line--3" />
        <div class="h-line h-line--4" />
        <div class="h-line h-line--5 l-hide" />
        <div class="h-line h-line--6 l-hide" />
        <div class="h-line h-line--7 l-hide" />
        <div class="h-line h-line--8 l-hide" />

        <div class="v-line v-line--1 " />
        <div class="v-line v-line--2 v-size-dot v-bottom" />
        <div class="v-line v-line--3" />
        <div class="v-line v-line--4 v-size-dot" />
        <div class="v-line v-line--5" />
        <div class="v-line v-line--6 v-size-dot v-bottom" />
        <div class="v-line v-line--7" />
        <div class="v-line v-line--8 v-size-dot" />
        <div class="v-line v-line--9" />
      </div>
    );
  }

  renderLoading() {
    return (
      <div class="icon icon--loading">
        <div class="circle circle-s" />
        <div class="h-line h-line--4 h-size-h h-left" />
        <div class="h-line h-line--5 h-size-h h-right" />
      </div>
    );
  }

  render(props) {
    switch (props.name) {
      case 'clear-day':
        return this.renderClear('day');

      case 'clear-night':
        return this.renderClear('night');

      case 'partly-cloudy-day':
        return this.renderPartlyCloudy('day');

      case 'partly-cloudy-night':
        return this.renderPartlyCloudy('night');

      case 'cloudy':
        return this.renderCloudy();

      case 'fog':
        return this.renderFog();

      case 'rain':
        return this.renderRain();

      case 'wind':
        return this.renderWind();

      case 'snow':
        return this.renderSnow();

      case 'sleet':
        return this.renderSleet();

      default:
        return this.renderLoading();

    }
  }
}

export default Icon;
