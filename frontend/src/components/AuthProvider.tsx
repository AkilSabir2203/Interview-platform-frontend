// import { createContext, useContext, useEffect, useLayoutEffect, useState, type PropsWithChildren } from "react";
// import type { User } from "../types"
// import api from "../libs/axois"

// type AuthContext =  {
//     authToken: string | null;
//     currentUser: User | null;
//     isAuthenticated: boolean;
//     isLoading: boolean;
//     loginContextSync: (token: string, user: User) => void;
//     handleLogout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContext | undefined>(undefined);

// type AuthProviderProps = PropsWithChildren;  

// export default function AuthProvider({children}: AuthProviderProps) {
//     const [authToken, setAuthToken] = useState<string | null>(null);
//     const [currentUser, setCurrentUser] = useState<User | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);

// useEffect(() => {
//     async function bootstrapSession() {
//         try {
//             const refreshResponse = await api.post("/api/v1/auth/refresh");
//             const newAccessToken = refreshResponse.data.access_token;
//             setAuthToken(newAccessToken);
            
//             // Because /me now returns 200 OK even if onboarding isn't done, 
//             // we don't need the messy 403 catch block anymore!
//             const profileResponse = await api.post("/api/v1/auth/me", {}, {
//                 headers: { Authorization: `Bearer ${newAccessToken}` }
//             });
            
//             setCurrentUser(profileResponse.data);
            
//         } catch (error) {
//             console.error("Session bootstrapping failed:", error);
//             setAuthToken(null);
//             setCurrentUser(null);
//         } finally {
//             setIsLoading(false);
//         }
//     }
//     bootstrapSession();
// }, []);

//     useLayoutEffect(() => {
//         const authInterceptor = api.interceptors.request.use((config) => {
//             if (authToken && !config.headers.Authorization) {
//                 config.headers.Authorization = `Bearer ${authToken}`;
//             }
//             return config;
//         });
//         return () => api.interceptors.request.eject(authInterceptor);
//     }, [authToken]);

//     useLayoutEffect(() => {
//         const refreshInterceptor = api.interceptors.response.use(
//             (response) => response,
//             async (error) => {
//                 const originalRequest = error.config;

//                 if (originalRequest.url?.includes("/api/v1/auth/refresh")) {
//                     return Promise.reject(error);
//                 }

//                 if (error.response?.status === 401 && !originalRequest._retry) {
//                     originalRequest._retry = true;
//                     try {
//                         const response = await api.post("/api/v1/auth/refresh");
//                         const newAccessToken = response.data.access_token;

//                         setAuthToken(newAccessToken);
//                         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        
//                         return api(originalRequest);
//                     } catch (refreshError) {
//                         setAuthToken(null);
//                         setCurrentUser(null);
//                         console.warn("🔄 Silent refresh token expired or invalid. Session cleared.")
//                         return Promise.reject(refreshError);
//                     }
//                 }
//                 return Promise.reject(error);
//             }
//         );
//         return () => api.interceptors.response.eject(refreshInterceptor);
//     }, [authToken]);


//     function loginContextSync(token: string, user: User) {
//         setAuthToken(token);
//         setCurrentUser(user);
//     }

//     async function handleLogout() {
//         try {
//             await api.post("/api/v1/auth/logout");
//         } catch (err) {
//             console.error("Logout request failed:", err);
//         } finally {
//             setAuthToken(null);
//             setCurrentUser(null);
//         }
//     }

//         return (
//         <AuthContext.Provider value={{
//             authToken,
//             currentUser,
//             isAuthenticated: !!currentUser,
//             isLoading,
//             loginContextSync,
//             handleLogout,
//         }}>{children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error("useAuth must be used inside of an AuthProvider");
//     }
//     return context;
// }

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
    loginContextSync: (token: string, user: User, profileData?: any) => void; // Changed type to any for parsing
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
                const refreshResponse = await api.post("/api/v1/auth/refresh");
                const newAccessToken = refreshResponse.data.access_token;
                setAuthToken(newAccessToken);

                const tokenPayload = JSON.parse(atob(newAccessToken.split(".")[1]));

                const profileResponse = await api.post("/api/v1/auth/me", {}, {
                    headers: { Authorization: `Bearer ${newAccessToken}` }
                });

                // ==========================================
                // ⚡ PLACE 1: SPLIT AND MAP DATA ON INITIAL REFRESH/BOOT
                // ==========================================
                const rawName = profileResponse.data.name || "";
                const nameParts = rawName.trim().split(/\s+/);
                const parsedFirstname = nameParts[0] || "";
                const parsedLastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

                setProfile({
                    ...profileResponse.data,
                    firstname: parsedFirstname, // Lowercase matches your type file fields
                    lastname: parsedLastname,
                    image: profileResponse.data.profile_image_url || null
                });
                // ==========================================

                setCurrentUser({
                    id: String(tokenPayload.id),
                    email: tokenPayload.email,
                    role: tokenPayload.role,
                    hasCompletedOnboarding: true
                });

            } catch (error: any) {
                if (error.response?.status === 403) {
                    console.warn("🔒 Onboarding pending for current user context session.");
                    const tokenStr = error.config?.headers?.Authorization?.split(" ")[1];
                    if (tokenStr) {
                        const tokenPayload = JSON.parse(atob(tokenStr.split(".")[1]));
                        setCurrentUser({
                            id: String(tokenPayload.id),
                            email: tokenPayload.email,
                            role: tokenPayload.role,
                            hasCompletedOnboarding: false 
                        });
                        setProfile(null);
                        return;
                    }
                }
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

    // ==========================================
    // ⚡ PLACE 2: SPLIT AND MAP DATA ON MANUAL CREDENTIALS LOGIN
    // ==========================================
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
    // ==========================================

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