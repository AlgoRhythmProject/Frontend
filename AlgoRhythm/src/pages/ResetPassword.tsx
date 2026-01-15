import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Key, ArrowLeft } from "lucide-react";
import { AuthenticationInput } from "../components/Authentication/AuthenticationInput";
import { AuthenticationHeader } from "../components/Authentication/AuthenticationHeader";
import { AuthenticationBackground } from "../components/Authentication/AuthenticationBackground";
import { AuthenticationButton } from "../components/Authentication/AuthenticationButton";
import { authApi, ApiError } from "../api/authApi";
import { Particles } from "@/components/ui/shadcn-io/particles";

export function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!searchParams.get("email")) {
            navigate("/forgot-password");
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }
        if (!code) {
            setError("Please enter the verification code");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await authApi.resetPassword({
                email,
                code,
                newPassword
            });
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err: any) {
            if (err instanceof ApiError) {
                switch (err.code) {
                    case 'USER_NOT_FOUND':
                        setError("User with this email does not exist.");
                        break;
                    case 'INVALID_CODE':
                        setError("The verification code is invalid or has expired.");
                        break;
                    case 'VALIDATION_ERROR':
                        setError(err.message);
                        break;
                    default:
                        setError(err.message || "Failed to reset password. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Reset password failed:", err);
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
                                <Lock className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="font-sans font-bold text-2xl text-foreground mb-2">
                                Password Reset Successful!
                            </h2>
                            <p className="font-sans text-muted-foreground mb-6">
                                Your password has been reset successfully. You can now login with your new password.
                            </p>
                            <p className="font-sans text-sm text-[#6b6b6b]">
                                Redirecting to login...
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
                            onClick={() => navigate("/forgot-password")}
                            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-sans text-sm">Back</span>
                        </button>

                        <AuthenticationHeader
                            title="Reset Password"
                            subtitle="Enter the code from your email and your new password"
                        />

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AuthenticationInput
                                label="Email"
                                type="email"
                                icon={<Mail />}
                                value={email}
                                onChange={setEmail}
                                placeholder="your@email.com"
                                delay={0.3}
                            />

                            <AuthenticationInput
                                label="Verification Code"
                                type="text"
                                icon={<Key />}
                                value={code}
                                onChange={setCode}
                                placeholder="Enter 6-digit code"
                                delay={0.4}
                            />

                            <AuthenticationInput
                                label="New Password"
                                type="password"
                                icon={<Lock />}
                                value={newPassword}
                                onChange={setNewPassword}
                                placeholder="••••••••"
                                delay={0.5}
                            />

                            <AuthenticationInput
                                label="Confirm Password"
                                type="password"
                                icon={<Lock />}
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                placeholder="••••••••"
                                delay={0.6}
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
                                text={isLoading ? "Resetting..." : "Reset Password"}
                            />
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-6 text-center"
                        >
                            <p className="font-sans text-[#6b6b6b] text-sm">
                                Didn't receive a code?{" "}
                                <button
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Resend
                                </button>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}