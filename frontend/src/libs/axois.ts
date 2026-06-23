// import axios from "axios";

// const api = axios.create({
//     // 💡 CHANGE THIS from 127.0.0.1 to localhost so it matches your browser address bar!
//     baseURL: "http://localhost:8000", 
//     withCredentials: true
// });

// api.interceptors.request.use((config) => {
//     const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
//     if (match) {
//         config.headers['X-CSRFToken'] = match[2];
//     }
//     return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
    // 💡 CHANGE THIS from 127.0.0.1 to localhost so it matches your browser address bar!
    baseURL: "http://localhost:8000", 
    withCredentials: true
});

// --- REQUEST INTERCEPTOR ---
// Extracts and injects the CSRF tokens directly from cookies into outbound mutations
api.interceptors.request.use((config) => {
    const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
    if (match) {
        config.headers['X-CSRFToken'] = match[2];
    }
    return config;
});

// --- RESPONSE INTERCEPTOR ---
// Manages silent session token rotation and intercepts business logic state redirections
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🛡️ THE SENIOR ENGINE FIX: BYPASS 403 ONBOARDING BLOCKS
        // If the /me endpoint throws a 403, do NOT treat it like an expired session!
        // This rejects straight to AuthProvider's catch block to route them to onboarding.
        if (error.response?.status === 403 && originalRequest.url?.includes("/me")) {
            return Promise.reject(error); 
        }

        // ❌ Safety Gate: Stop loop spirals if the refresh route itself fails
        if (originalRequest.url?.includes("/api/v1/auth/refresh")) {
            return Promise.reject(error);
        }

        // 🔄 STANDARD 401 TOKEN EXPIRED ROTATION FLOW
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Request a fresh short-lived access token via HTTP-Only cookie verification
                const response = await axios.post("http://localhost:8000/api/v1/auth/refresh", {}, { withCredentials: true });
                const newAccessToken = response.data.access_token;

                // Apply the new token to headers and retry the original failed operation payload
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                console.warn("🔄 Silent refresh session has expired or is invalid. Redirecting to login context.");
                // Clean teardown routing interface kick out
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;