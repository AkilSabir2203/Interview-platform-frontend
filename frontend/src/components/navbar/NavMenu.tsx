import { NavLink } from "react-router";
import NavItem from "./NavItem";

const NavMenu = ({
}) => {

    return (
        <div className="flex flex-row min-w-84 items-center text-lg h-16">
            <NavLink to="/practice"><NavItem onClick={() => {}} label="Practice"/></NavLink> 
            <NavLink to="/experiences"><NavItem onClick={() => {}} label="Experiences"/></NavLink> 
            <NavLink to="/discussions"><NavItem onClick={() => {}} label="Discussions"/></NavLink> 
        </div>
    )
}

export default NavMenu;