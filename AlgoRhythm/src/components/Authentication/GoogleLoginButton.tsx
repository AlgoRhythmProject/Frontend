import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface GoogleLoginButtonProps {
    onSuccess: (credential: string) => void;
    onError?: (error: any) => void;
    text?: "signin_with" | "signup_with" | "continue_with" | "signin" | "signup";
    isDark?: boolean;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

export function GoogleLoginButton({
    onSuccess,
    onError,
    text = "signin_with",
    isDark = false
}: GoogleLoginButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client?hl=en";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google && buttonRef.current) {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

                if (!clientId) {
                    console.error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');
                    onError?.(new Error('Google Client ID is not configured'));
                    return;
                }

                console.log('Initializing Google Sign-In with Client ID:', clientId);

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    locale: 'en',
                });

                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: isDark ? "filled_black" : "outline",
                    size: "large",
                    width: buttonRef.current.offsetWidth,
                    text: text,
                    shape: "rectangular",
                    logo_alignment: "left",
                    locale: "en_US",
                });
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [isDark]);

    const handleCredentialResponse = (response: any) => {
        if (response.credential) {
            onSuccess(response.credential);
        } else {
            onError?.(new Error("No credential received"));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="w-full"
        >
            <div ref={buttonRef} className="w-full flex justify-center" />
        </motion.div>
    );
}