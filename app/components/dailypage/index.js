import './style.scss';
import {h, Component} from 'preact';

class Daily extends Component {
  constructor(props) {
    super(props);
  }

  render(props) {

    let {data, summary} = props;

    return (
      <div class="Daily">
        <div class="Today__summary" style={{marginBottom: 25}}>{summary}</div>
      </div>
    );
  }
}

export default Daily;
