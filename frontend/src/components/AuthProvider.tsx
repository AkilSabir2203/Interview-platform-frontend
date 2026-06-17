import { createContext, useContext, useEffect, useLayoutEffect, useState, type PropsWithChildren } from "react";
import type { User } from "../types"
import api from "../libs/axois"

type AuthContext =  {
    authToken: string | null;
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loginContextSync: (token: string, user: User) => void;
    handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;  

export default function AuthProvider({children}: AuthProviderProps) {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
    async function bootstrapSession() {
        try {
            const refreshResponse = await api.post("/api/v1/auth/refresh");
            const newAccessToken = refreshResponse.data.access_token;
            setAuthToken(newAccessToken);
            
            // Because /me now returns 200 OK even if onboarding isn't done, 
            // we don't need the messy 403 catch block anymore!
            const profileResponse = await api.post("/api/v1/auth/me", {}, {
                headers: { Authorization: `Bearer ${newAccessToken}` }
            });
            
            setCurrentUser(profileResponse.data);
            
        } catch (error) {
            console.error("Session bootstrapping failed:", error);
            setAuthToken(null);
            setCurrentUser(null);
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

                if (originalRequest.url?.includes("/api/v1/auth/refresh")) {
                    return Promise.reject(error);
                }

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
                        console.warn("🔄 Silent refresh token expired or invalid. Session cleared.")
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => api.interceptors.response.eject(refreshInterceptor);
    }, [authToken]);


    function loginContextSync(token: string, user: User) {
        setAuthToken(token);
        setCurrentUser(user);
    }

    async function handleLogout() {
        try {
            await api.post("/api/v1/auth/logout");
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            setAuthToken(null);
            setCurrentUser(null);
        }
    }

        return (
        <AuthContext.Provider value={{
            authToken,
            currentUser,
            isAuthenticated: !!currentUser,
            isLoading,
            loginContextSync,
            handleLogout,
        }}>{children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used inside of an AuthProvider");
    }
    return context;
}

