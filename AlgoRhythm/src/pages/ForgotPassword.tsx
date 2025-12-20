import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthenticationInput } from "../components/Authentication/AuthenticationInput";
import { AuthenticationHeader } from "../components/Authentication/AuthenticationHeader";
import { AuthenticationBackground } from "../components/Authentication/AuthenticationBackground";
import { AuthenticationButton } from "../components/Authentication/AuthenticationButton";
import { authApi, ApiError } from "../api/authApi";
import { Particles } from "@/components/ui/shadcn-io/particles";

export function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSuccess(true);
            // Po 3 sekundach przekieruj do reset-password
            setTimeout(() => {
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 3000);
        } catch (err: any) {
            if (err instanceof ApiError) {
                switch (err.code) {
                    case 'EMAIL_NOT_VERIFIED':
                        setError("Please verify your email address first.");
                        break;
                    case 'TOO_MANY_REQUESTS':
                        setError("Too many attempts. Please try again later.");
                        break;
                    default:
                        setError(err.message || "Failed to send reset code. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Forgot password failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                <AuthenticationBackground />
                <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" refresh />
                <div className="z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 w-full max-w-md"
                    >
                        <div className="bg-background/80 backdrop-blur-xl z-20 border border-muted rounded-2xl p-8 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="font-sans font-bold text-2xl text-foreground mb-2">
                                Check Your Email
                            </h2>
                            <p className="font-sans text-muted-foreground mb-6">
                                If an account exists with <strong>{email}</strong>, we've sent a password reset code to that address.
                            </p>
                            <p className="font-sans text-sm text-secondary-foreground">
                                Redirecting to reset page...
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <AuthenticationBackground />
            <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" refresh />
            <div className="z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="bg-background/80 backdrop-blur-xl z-20 border border-muted rounded-2xl p-8 shadow-2xl">
                        <button
                            onClick={() => navigate("/login")}
                            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-sans text-sm">Back to Login</span>
                        </button>

                        <AuthenticationHeader
                            title="Forgot Password?"
                            subtitle="Enter your email to receive a reset code"
                        />

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AuthenticationInput
                                label="Email"
                                type="email"
                                icon={<Mail />}
                                value={email}
                                onChange={setEmail}
                                placeholder="your@email.com"
                                delay={0.4}
                            />

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-error text-sm"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <AuthenticationButton
                                isLoading={isLoading}
                                text={isLoading ? "Sending..." : "Send Reset Code"}
                            />
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6 text-center"
                        >
                            <p className="font-sans text-secondary-foreground text-sm">
                                Remember your password?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Login
                                </button>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}