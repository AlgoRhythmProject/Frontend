import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { AuthenticationInput } from "../components/Login/AuthenticationInput";
import { AuthenticationHeader } from "../components/Login/AuthenticationHeader";
import { AuthenticationBackground } from "../components/Login/AuthenticationBackground";
import { AuthenticationButton } from "../components/Login/AuthenticationButton";
import { AuthenticationFooter } from "../components/Login/AuthenticationFooter";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { login } from "../store/userSlice";

export function Register() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Tutaj możesz wywołać API rejestracji
        setTimeout(() => {
            const newUser = {
                id: Math.random().toString(36).substring(2, 9),
                firstName,
                lastName,
                email,
                createdAt: new Date().toISOString(),
                isDeleted: false,
            };

            dispatch(login(newUser));
            localStorage.setItem("isAuthenticated", "true");
            navigate("/");
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <AuthenticationBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-background/80 backdrop-blur-xl border border-muted rounded-2xl p-8 shadow-2xl">
                    <AuthenticationHeader title="Create Account" subtitle="Start learning algorithms today" />          <form onSubmit={handleRegister} className="space-y-5">
                        <AuthenticationInput label="First Name" type="text" icon={<User />} value={firstName} onChange={setFirstName} delay={0.4} />
                        <AuthenticationInput label="Last Name" type="text" icon={<User />} value={lastName} onChange={setLastName} delay={0.5} />
                        <AuthenticationInput label="Email" type="email" icon={<Mail />} value={email} onChange={setEmail} delay={0.6} />
                        <AuthenticationInput label="Password" type="password" icon={<Lock />} value={password} onChange={setPassword} delay={0.7} />
                        <AuthenticationInput label="Confirm Password" type="password" icon={<Lock />} value={confirmPassword} onChange={setConfirmPassword} delay={0.8} />
                        <AuthenticationButton text="Register" isLoading={isLoading} />
                    </form>
                    <AuthenticationFooter
                        promptText="Already have an account?"
                        linkText="Log in"
                        onLinkClick={() => navigate("/login")}
                    />

                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 text-center">
                    <p className="font-sans text-[#6b6b6b] text-sm">
                        Your place to learn algorithms and data structures
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
