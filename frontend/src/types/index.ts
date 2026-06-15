export interface SafeUser {
    id: number;              // Django usually uses integers for IDs
    email: string;
    firstname: string | null;
    lastname: string | null;
    image?: string | null;   // Optional, if you have user avatars
    emailVerified?: string | null;
    createdAt: string;       // Sent as an ISO string from Django
    updatedAt: string;       // Sent as an ISO string from Django
}