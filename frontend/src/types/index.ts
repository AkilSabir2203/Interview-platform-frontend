export interface CandidateUser {
    id: number;              // Django usually uses integers for IDs
    email: string;
    role: string;
    firstname: string | null;
    lastname: string | null;
    phone: string | null;
    image?: string | null;   
    createdAt: string;      
    updatedAt: string;       
}

export interface InterviewerUser {
    id: number;             
    email: string;
    role: string;
    firstname: string | null;
    lastname: string | null;
    company: string | null;
    position: string | null;
    phone: string | null;
    image?: string | null;
    rating: 1 | 2 | 3 | 4 | 5 | null;  
    skills: [];
    createdAt: string;      
    updatedAt: string;       
}

export type User = { 
    id: string,
    email: string,
    role: string,
    hasCompletedOnboarding: boolean
};