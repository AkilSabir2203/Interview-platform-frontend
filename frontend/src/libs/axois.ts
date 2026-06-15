import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Your Django URL
    withCredentials: true,            // CRITICAL: Allows Django session cookies to be saved in the browser
});

// Automatically attach Django's CSRF token if it exists in the browser cookies
axiosInstance.interceptors.request.use(function (config) {
    const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
    if (match) {
        config.headers['X-CSRFToken'] = match[2];
    }
    return config;
});

export default axiosInstance;