import { h } from 'preact';
import Icon from '../icon';
import { DAYS_OF_WEEK } from '../../utils/date';
import './style.scss';


export default function( {data, summary}) {

  const days = data.map((item, index) => {
    const date = new Date(item.time * 1000);
    let day = DAYS_OF_WEEK[date.getDay()];
    if (index === 0) {
      day = 'Today';
    } else if (index === 1) {
      day = 'Tomorrow';
    }

    return (
      <div class="Daily__item">
        <div class="Daily__left">
          <div class="Daily__day">{day}</div>
          <div class="Daily__summary">{item.summary}</div>
        </div>
        <div class="Daily__icon">
          <Icon name={item.icon} />
        </div>
        <div class="Daily__temp">
          { Math.round(item.temperatureMax)}&deg;<br />
          { Math.round(item.temperatureMin)}&deg;
        </div>
      </div>
    );
  });

  return (
    <div class="Daily content">
      <div class="Today__summary" style={{ marginBottom: 25 }}>{summary}</div>
      {days}
    </div>
  );
}
