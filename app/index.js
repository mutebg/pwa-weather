import './scss/reset.scss';
import './scss/index.scss';
import { h, render } from 'preact';
import Router from 'preact-router';
import Home from './components/home';
import Settings from './components/settings';


const Main = () => (
  <Router>
    <Home path="/" />
    <Settings path="/settings" />
  </Router>
);

render(<Main />, document.body);

require('./manifest.json');
