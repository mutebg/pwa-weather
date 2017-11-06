// import { h } from 'preact';
import './style.scss';

export default function({ message }) {
	if (message) {
		return <div class="Alert">{message}</div>;
	}
	return null;
}
