import { NavLink } from "react-router";
import Logo from "./Logo";
const Brand = () => {
    return (
        <NavLink to="/">
            <div className="flex items-center">
                <Logo/>
                <span className="text-2xl font-bold pl-3 font-satoshi">Amplify</span>
            </div>
        </NavLink>
    )
}

export default Brand;