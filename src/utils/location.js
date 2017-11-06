import { get } from './api';

export function getCurrentPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			position => {
				resolve(position.coords);
			},
			() => {
				get('geolocation')
					.then(data => {
						resolve(data);
					})
					.catch(err1 => {
						reject(err1);
					});
			}
		);
	});
}
