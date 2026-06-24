import { createContext, useContext, useEffect, useLayoutEffect, useState, type PropsWithChildren } from "react";
import type { User, CandidateUser, InterviewerUser } from "../types"; 
import api from "../libs/axois";

type Profile = CandidateUser | InterviewerUser;

type AuthContextType = {
    authToken: string | null;
    currentUser: User | null;
    profile: Profile | null; 
    isAuthenticated: boolean;
    isLoading: boolean;
    loginContextSync: (token: string, user: User, profileData?: any) => void;
    handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: PropsWithChildren) {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function bootstrapSession() {
            try {
                // 1. Refresh session and secure the access token first
                const refreshResponse = await api.post("/api/v1/auth/refresh");
                const newAccessToken = refreshResponse.data.access_token;
                setAuthToken(newAccessToken);

                // 2. Extract and decode payload IMMEDIATELY.
                const tokenPayload = JSON.parse(atob(newAccessToken.split(".")[1]));
                
                // Build our base user tracking profile (assumes onboarding is incomplete initially)
                const userContext = {
                    id: String(tokenPayload.id),
                    email: tokenPayload.email,
                    role: tokenPayload.role,
                    hasCompletedOnboarding: false 
                };

                try {
                    // 3. Attempt to fetch the actual profile configuration map records
                    const profileResponse = await api.post("/api/v1/auth/me", {}, {
                        headers: { Authorization: `Bearer ${newAccessToken}` }
                    });

                    // Profile query passed -> Parse name metrics and split records cleanly
                    const rawName = profileResponse.data.name || "";
                    const nameParts = rawName.trim().split(/\s+/);
                    
                    setProfile({
                        ...profileResponse.data,
                        firstname: nameParts[0] || "",
                        lastname: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
                        image: profileResponse.data.profile_image_url || null
                    });

                    // Upgrade onboarding flag state to true since record check was valid
                    userContext.hasCompletedOnboarding = true;
                    setCurrentUser(userContext);

                } catch (profileError: any) {
                    // 4. Intercept the onboarding pending status safely
                    if (profileError.response?.status === 403) {
                        console.warn("🔒 Onboarding pending. User authenticated with partial context layout profile.");
                        
                        setProfile(null);
                        setCurrentUser(userContext); // Retains verified token info but flags hasCompletedOnboarding: false
                        return; 
                    }
                    
                    // Bubble other internal errors up to the primary fallback catch loop
                    throw profileError;
                }

            } catch (authError: any) {
                // 5. Hard session validation failure block (stale tokens / missing cookies)
                setAuthToken(null);
                setCurrentUser(null);
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        }
        bootstrapSession();
    }, []);

    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config) => {
            if (authToken && !config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }
            return config;
        });
        return () => api.interceptors.request.eject(authInterceptor);
    }, [authToken]);

    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (originalRequest.url?.includes("/api/v1/auth/refresh")) return Promise.reject(error);
                if (originalRequest.url?.includes("/api/v1/auth/me") && error.response?.status === 403) return Promise.reject(error);

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const response = await api.post("/api/v1/auth/refresh");
                        const newAccessToken = response.data.access_token;
                        setAuthToken(newAccessToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        setAuthToken(null);
                        setCurrentUser(null);
                        setProfile(null);
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => api.interceptors.response.eject(refreshInterceptor);
    }, [authToken]);

    function loginContextSync(token: string, user: User, profileData: any = null) {
        setAuthToken(token);
        setCurrentUser(user);

        if (profileData && "name" in profileData) {
            const nameParts = (profileData.name || "").trim().split(/\s+/);
            setProfile({
                ...profileData,
                firstname: nameParts[0] || "",
                lastname: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
                image: profileData.profile_image_url || null
            });
        } else {
            setProfile(profileData);
        }
    }

    async function handleLogout() {
        try { await api.post("/api/v1/auth/logout"); } catch {}
        setAuthToken(null);
        setCurrentUser(null);
        setProfile(null);
    }

    return (
        <AuthContext.Provider value={{
            authToken,
            currentUser,
            profile,
            isAuthenticated: !!currentUser,
            isLoading,
            loginContextSync,
            handleLogout,
        }}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)!;
}