import './style.scss';
import {h, Component} from 'preact';

class Sky extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sky">
          <div className="sky__sun"></div>
          <div className="sky__level sky__level--1"></div>
          <div className="sky__level sky__level--2"></div>
          <div className="sky__level sky__level--3"></div>
          <div className="sky__level sky__level--4"></div>
          <div className="sky__level sky__level--5"></div>
      </div>
    );
  }
}

export default Sky;
