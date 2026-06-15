"use client";

import { AiOutlineMenu } from "react-icons/ai";
// import MenuItem from "./MenuItem";
import Avatar from "../ui/Avatar";

const UserMenu = ({
}) => {

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div  className="p-3 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition dark:border-neutral-800">
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={null} />
                    </div>
                </div>
            </div>
            {/* (
                <div className="absolute rounded-xl shadow-md w-32 bg-white overflow-hidden right-0 top-12 text-sm dark:bg-black">
                    <div className="flex flex-col cursor-pointer">
                          (
                        <>
                            <MenuItem 
                                onClick={() => {}}
                                label="Log Out"
                            />
                        </>
                        ) : ( 
                        <>
                            <MenuItem 
                                onClick={() => {}}
                                label="Login"
                            />
                            <MenuItem
                                onClick={() => {}} 
                                label="Sign Up"
                            />
                        </>
                        )
                    </div>
                </div>
            ) */}
        </div>
    )
}

export default UserMenu;