import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "../store";
import { logout as logoutAction } from "../store/userSlice";
import { authApi } from "../api/authApi";

export function AdminProfileDropdown() {
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.user.user);

    const initials = user
        ? `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase()
        : "A";

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userEmail");

            dispatch(logoutAction());
            setOpen(false);
            navigate("/login");
            setIsLoggingOut(false);
        }
    };

    const goToSettings = () => {
        navigate("/profile/edit");
        setOpen(false);
    };

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
            {/* Avatar Button */}
            <motion.button
                onClick={() => setOpen((prev) => !prev)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            >
                <User className="w-5 h-5 text-primary-foreground" />
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute right-0 mt-2 w-64 bg-card border border-muted rounded-xl shadow-lg p-3 z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-2 border-b border-muted mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-sans font-medium text-foreground">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="font-sans text-xs text-primary font-medium">
                                    Administrator
                                </p>
                            </div>
                        </div>

                        {/* Menu options */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={goToSettings}
                                disabled={isLoggingOut}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer font-sans flex items-center gap-2 disabled:opacity-50"
                            >
                                <Settings className="w-4 h-4 text-foreground" />
                                <span className="text-foreground">Settings</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-error/20 transition-colors cursor-pointer font-sans flex items-center gap-2 text-error disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}