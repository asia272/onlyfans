import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
    return (
        <LogoutLink className="flex w-full items-center gap-2 cursor-pointer text-red-600 hover:text-red-700">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
        </LogoutLink>
    );
};

export default LogoutButton;