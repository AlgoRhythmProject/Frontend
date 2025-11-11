import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthenticationBackground } from "../components/Authentication/AuthenticationBackground";
import { AuthenticationButton } from "../components/Authentication/AuthenticationButton";
import { AuthenticationHeader } from "../components/Authentication/AuthenticationHeader";
import { AuthenticationFooter } from "../components/Authentication/AuthenticationFooter";
import { Particles } from "../components/ui/shadcn-io/particles";
import { authApi } from "../api/authApi";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "../components/ui/input-otp"
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { login } from "../store/userSlice";


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
    const [error, setError] = useState("");

    const handleVerify = async (enteredCode: string) => {
        setIsLoading(true);
        setError("");

        try {
            var user = await authApi.verifyEmail(email, enteredCode);
            dispatch(login(user));
            localStorage.setItem("isAuthenticated", "true");
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Invalid or expired verification code.");
            setCode("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (value: string) => {
        setCode(value);
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
                    /> <div className="mb-4">
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
                        <p className="text-error text-sm text-center font-sans">{error}</p>
                    )}

                    <AuthenticationButton isLoading={isLoading} text="Verify" />
                    <AuthenticationFooter
                        promptText="Already verified?"
                        linkText="Log in"
                        onLinkClick={() => navigate("/login")}
                    />
                </div>
            </motion.div >
        </div >
    );
}
