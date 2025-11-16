import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { authApi } from "../api/authApi";

export function ProfileDropdown() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.user.user);

    const initials = user
        ? `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase()
        : "G";

    const handleLogout = async () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userEmail");
        await authApi.logout();
        navigate("/login");
    };

    const goToProfile = () => {
        navigate("/profile");
        setOpen(false);
    };

    const goToSettings = () => {
        navigate("/profile/edit");
        setOpen(false);
    };

    // click outside to close
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- Avatar Button --- */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center  cursor-pointer ">
                <User className="w-5 h-5 text-foreground" />
            </button >

            {/* --- Dropdown Panel --- */}
            {
                open && (
                    <div className="absolute right-0 mt-2 w-72 bg-card border border-muted rounded-xl shadow-lg p-3 z-50">

                        {/* Header */}
                        <div className="flex items-center gap-3 p-2 border-b border-muted mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary text-foreground font-bold flex items-center justify-center">
                                {initials}
                            </div>
                            <div>
                                <p className="font-sans font-medium text-foreground">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="font-sans text-muted-foreground text-sm truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* Menu options */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={goToProfile}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors font-sans"
                            >
                                Profile
                            </button>

                            <button
                                onClick={goToSettings}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer  font-sans flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4 text-primary" />
                                Settings
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-error/20 transition-colors cursor-pointer  font-sans flex items-center gap-2 text-error"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
