import './style.scss';
import {h, Component} from 'preact';
// import todayIcon from '../../assets/today.svg';
// import listIcon from '../../assets/list.svg';
// import settingsIcon from '../../assets/settings.svg';
// import timeIcon from '../../assets/time.svg';


class Sky extends Component {
  constructor(props) {
    super(props);

    this.items = [
      {
        link: '/',
        label: 'Today',
        icon: (
          <svg class="Navigation__icon" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        )
      },
      {
        link: '/hourly',
        label: '48 Hours',
        icon: (
          <svg class="Navigation__icon" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        )
      },
      {
        link: '/daily',
        label: 'Week',
        icon: (
          <svg class="Navigation__icon" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        )
      },
      {
        link: '/settings',
        label: 'Settings',
        icon: (
          <svg class="Navigation__icon" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
          </svg>
        )
      }
    ]
  }

  render(props) {

    let navItems = this.items.map( item => {
      return (
        <a class={'Navigation__item ' + ( props.currentURL == item.link ? 'Navigation__item--selected' : null )} href={item.link}>
          {item.icon}
          <span class="Navigation__label">{item.label}</span>
        </a>
      );
    });


    return (
      <div class="Navigation">{navItems}</div>
    );
  }
}

export default Sky;
