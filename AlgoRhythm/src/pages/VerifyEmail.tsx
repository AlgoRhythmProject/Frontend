import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthenticationBackground } from "../components/Authentication/AuthenticationBackground";
import { AuthenticationButton } from "../components/Authentication/AuthenticationButton";
import { AuthenticationHeader } from "../components/Authentication/AuthenticationHeader";
import { AuthenticationFooter } from "../components/Authentication/AuthenticationFooter";
import { Particles } from "../components/ui/shadcn-io/particles";
import { authApi } from "../api/auth/authApi";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "../components/ui/input-otp"
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { login } from "../store/userSlice";
import { ApiError } from "@/api/auth/types";


export function VerifyEmail() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const email = params.get("email") || "";

    useEffect(() => {
        if (!email) {
            navigate("/register", { replace: true });
        }
    }, [email, navigate]);

    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    // Cooldown timer for resend button
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);
    const handleVerify = async (enteredCode: string) => {
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const user = await authApi.verifyEmail(email, enteredCode);

            if (user.token) {
                localStorage.setItem("token", user.token);
            }

            dispatch(login(user));
            localStorage.setItem("isAuthenticated", "true");

            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
        } catch (err) {
            if (err instanceof ApiError) {
                switch (err.code) {
                    case 'USER_NOT_FOUND':
                        setError("User not found. Please register again.");
                        break;
                    case 'INVALID_CODE':
                        setError("Invalid or expired verification code.");
                        break;
                    default:
                        setError(err.message || "Verification failed. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Verification failed:", err);
            setCode("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        setError("");
        setSuccessMessage("");

        try {
            await authApi.resendVerificationCode(email);
            setSuccessMessage("Verification code has been resent. Check your email.");
            setResendCooldown(60); // 60 second cooldown
        } catch (err) {
            if (err instanceof ApiError) {
                switch (err.code) {
                    case 'USER_NOT_FOUND':
                        setError("User not found. Please register again.");
                        break;
                    case 'EMAIL_ALREADY_VERIFIED':
                        setError("This email is already verified. Please log in.");
                        setTimeout(() => navigate("/login"), 2000);
                        break;
                    case 'TOO_MANY_REQUESTS':
                        setError(err.message || "Too many requests. Please wait before trying again.");
                        setResendCooldown(60);
                        break;
                    default:
                        setError(err.message || "Failed to resend code. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Resend failed:", err);
        } finally {
            setIsResending(false);
        }
    };

    const handleChange = (value: string) => {
        setCode(value);
        setError("");
        setSuccessMessage("");
        if (value.length === 6) {
            handleVerify(value);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
                        title="Verify Your Email"
                        subtitle={`We sent a code to ${email}`}
                    />

                    <div className="mb-4">
                        <InputOTP
                            maxLength={6}
                            value={code}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full"
                        >
                            <InputOTPGroup className="flex justify-between w-full">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <InputOTPSlot
                                        key={i}
                                        index={i}
                                        className="flex-1 h-16 text-2xl rounded-lg border-2 border-muted bg-background/80 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all mx-1"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {error && (
                        <p className="text-error text-sm text-center font-sans mb-4">{error}</p>
                    )}

                    {successMessage && (
                        <p className="text-green-500 text-sm text-center font-sans mb-4">{successMessage}</p>
                    )}

                    <AuthenticationButton isLoading={isLoading} text="Verify" />

                    {/* Resend code button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-center"
                    >
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending || resendCooldown > 0}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? (
                                "Sending..."
                            ) : resendCooldown > 0 ? (
                                `Resend code in ${resendCooldown}s`
                            ) : (
                                "Didn't receive a code? Resend"
                            )}
                        </button>
                    </motion.div>

                    <AuthenticationFooter
                        promptText="Already verified?"
                        linkText="Log in"
                        onLinkClick={() => navigate("/login")}
                    />
                </div>
            </motion.div>
        </div>
    );
}