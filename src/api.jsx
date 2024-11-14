import axios from 'axios';

class Api {
    constructor() {
        this.baseUrl = 'http://localhost:5000'; // Your backend URL
    }

    getUrl(endpoint) {
        return `${this.baseUrl}${endpoint}`;
    }
}

export default new Api();
