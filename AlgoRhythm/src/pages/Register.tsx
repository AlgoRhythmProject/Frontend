import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { AuthenticationInput } from "../components/Authentication/AuthenticationInput";
import { AuthenticationHeader } from "../components/Authentication/AuthenticationHeader";
import { AuthenticationBackground } from "../components/Authentication/AuthenticationBackground";
import { AuthenticationButton } from "../components/Authentication/AuthenticationButton";
import { AuthenticationFooter } from "../components/Authentication/AuthenticationFooter";
import { Particles } from "../components/ui/shadcn-io/particles";
import { authApi } from "../api/authApi";

export function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        var response = await authApi.register({ email, password, firstName, lastName });
        if (response) {
            navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        }
        else {
            alert("Registration failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <AuthenticationBackground />
            <Particles
                className="absolute inset-0"
                quantity={100}
                ease={80}
                color="#ffffff"
                refresh />

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
                        <div className="h-1" />
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
