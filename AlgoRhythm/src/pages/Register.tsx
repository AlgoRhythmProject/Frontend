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
import { authApi } from "../api/auth/authApi";
import { validateName, validateEmail, validatePassword, sanitizeInput } from "@/utils/validationUtils";
import { ApiError } from "@/api/auth/types";

export function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate first name
        const firstNameValidation = validateName(firstName, "First name");
        if (!firstNameValidation.isValid) {
            setError(firstNameValidation.error!);
            return;
        }

        // Validate last name
        const lastNameValidation = validateName(lastName, "Last name");
        if (!lastNameValidation.isValid) {
            setError(lastNameValidation.error!);
            return;
        }

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error!);
            return;
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.error!);
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            // Sanitize inputs before sending to backend
            const sanitizedData = {
                firstName: sanitizeInput(firstName),
                lastName: sanitizeInput(lastName),
                email: email.trim().toLowerCase(),
                password: password
            };

            await authApi.register(sanitizedData);

            // Registration successful - redirect to verification page
            navigate(`/verify-email?email=${encodeURIComponent(sanitizedData.email)}`);
        } catch (err: any) {
            if (err instanceof ApiError) {
                switch (err.code) {
                    case 'EMAIL_EXISTS':
                        setError("An account with this email already exists.");
                        break;
                    case 'VALIDATION_ERROR':
                        setError(err.message);
                        break;
                    case 'REGISTRATION_FAILED':
                        setError(err.message);
                        break;
                    default:
                        setError(err.message || "Registration failed. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Registration failed:", err);
        } finally {
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
                refresh
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-background/80 backdrop-blur-xl border border-muted rounded-2xl p-8 shadow-2xl">
                    <AuthenticationHeader
                        title="Create Account"
                        subtitle="Start learning algorithms today"
                    />
                    <form onSubmit={handleRegister} className="space-y-5">
                        <AuthenticationInput
                            label="First Name"
                            type="text"
                            icon={<User />}
                            value={firstName}
                            onChange={setFirstName}
                            placeholder="John"
                            delay={0.4}
                        />
                        <AuthenticationInput
                            label="Last Name"
                            type="text"
                            icon={<User />}
                            value={lastName}
                            onChange={setLastName}
                            placeholder="Doe"
                            delay={0.5}
                        />
                        <AuthenticationInput
                            label="Email"
                            type="email"
                            icon={<Mail />}
                            value={email}
                            onChange={setEmail}
                            placeholder="your@email.com"
                            delay={0.6}
                        />
                        <AuthenticationInput
                            label="Password"
                            type="password"
                            icon={<Lock />}
                            value={password}
                            onChange={setPassword}
                            placeholder="Min 8 characters"
                            delay={0.7}
                        />
                        <AuthenticationInput
                            label="Confirm Password"
                            type="password"
                            icon={<Lock />}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Repeat password"
                            delay={0.8}
                        />
                        <div className="h-1" />
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-error text-sm"
                            >
                                {error}
                            </motion.p>
                        )}
                        <AuthenticationButton text="Register" isLoading={isLoading} />
                    </form>
                    <AuthenticationFooter
                        promptText="Already have an account?"
                        linkText="Log in"
                        onLinkClick={() => navigate("/login")}
                    />
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6 text-center"
                >
                    <p className="font-sans text-[#6b6b6b] text-sm">
                        Your place to learn algorithms and data structures
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}