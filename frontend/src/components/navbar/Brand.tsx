import { NavLink } from "react-router";
import Logo from "./Logo";

interface BrandProps {
    disableLink?: boolean;
}

const Brand = ({ disableLink }: BrandProps) => {
    // 1. Extract the visual part so we don't duplicate code
    const brandContent = (
        <div className="flex items-center">
            <Logo/>
            <span className="text-2xl font-bold pl-3 font-satoshi">Amplify</span>
        </div>
    );

    // 2. If onboarding, return just the visuals without the link wrapper
    if (disableLink) {
        return brandContent;
    }

    // 3. Otherwise, wrap it in the normal NavLink
    return (
        <NavLink to="/">
            {brandContent}
        </NavLink>
    );
}

export default Brand;