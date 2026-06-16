import axios from "axios";

const api = axios.create({
    // 💡 CHANGE THIS from 127.0.0.1 to localhost so it matches your browser address bar!
    baseURL: "http://localhost:8000", 
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
    if (match) {
        config.headers['X-CSRFToken'] = match[2];
    }
    return config;
});

export default api;