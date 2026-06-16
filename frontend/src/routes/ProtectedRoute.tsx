import { useAuth } from "../components/AuthProvider";
import type { User } from "../types";
import type { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?: User['role'][];
}

export default function ProtectedRoute({
    allowedRoles,
    children
}: ProtectedRouteProps) {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return <div className="text-9xl">Loading...</div>;
    }

    if (
        !currentUser ||
        (allowedRoles && !allowedRoles.includes(currentUser.role))
    ) {
        return <div className="text-8xl">Permission Denied</div>;
    }
 return children;
}