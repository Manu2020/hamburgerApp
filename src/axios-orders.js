import axios from 'axios';

const instance= axios.create({
	baseURL: 'https://hamburgerapp-99994.firebaseio.com/'
});

export default instance;