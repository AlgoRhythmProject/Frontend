import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { config } from "@/config/global";

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
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const customButtonRef = useRef<HTMLButtonElement>(null);
    const scriptLoadedRef = useRef(false);

    const handleCredentialResponse = useCallback((response: any) => {
        if (response.credential) {
            onSuccess(response.credential);
        } else {
            onError?.(new Error("No credential received"));
        }
    }, [onSuccess, onError]);

    useEffect(() => {
        const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');

        if (existingScript && window.google) {
            scriptLoadedRef.current = true;
            initializeGoogleButton();
            return;
        }

        if (scriptLoadedRef.current) return;

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            scriptLoadedRef.current = true;
            initializeGoogleButton();
        };

        script.onerror = () => {
            console.error("Failed to load Google script");
            onError?.(new Error("Failed to load Google Sign-In"));
        };

        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (scriptLoadedRef.current) {
            initializeGoogleButton();
        }
    }, [isDark, text, handleCredentialResponse]);

    const initializeGoogleButton = () => {
        if (window.google && googleButtonRef.current) {
            const clientId = config.googleClientId;

            if (!clientId) {
                console.error('VITE_GOOGLE_CLIENT_ID is not defined');
                onError?.(new Error('Google Client ID is not configured'));
                return;
            }

            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                googleButtonRef.current.innerHTML = '';

                window.google.accounts.id.renderButton(googleButtonRef.current, {
                    theme: isDark ? "filled_black" : "outline",
                    size: "large",
                    width: 400,
                    text: text,
                    shape: "rectangular",
                    logo_alignment: "left",
                    locale: "en",
                });

                // Znajdź prawdziwy przycisk Google i podepnij kliknięcie
                setTimeout(() => {
                    const realGoogleButton = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
                    if (realGoogleButton && customButtonRef.current) {
                        customButtonRef.current.onclick = () => {
                            realGoogleButton.click();
                        };
                    }
                }, 100);
            } catch (error) {
                console.error("Error initializing Google button:", error);
                onError?.(error);
            }
        }
    };

    const getButtonText = () => {
        switch (text) {
            case "signup_with":
                return "Sign up with Google";
            case "continue_with":
                return "Continue with Google";
            case "signin":
                return "Sign in";
            case "signup":
                return "Sign up";
            default:
                return "Sign in with Google";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="w-full relative"
        >
            <div
                ref={googleButtonRef}
                className="absolute opacity-0 pointer-events-none"
                style={{ position: 'absolute', left: '-9999px' }}
            />

            <button
                ref={customButtonRef}
                className={`
                    w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
                    font-medium text-sm transition-all duration-200 cursor-pointer
                    bg-background text-foreground-muted hover:bg-card
                    shadow-sm hover:shadow-md
                `}
                type="button"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4" />
                    <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853" />
                    <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05" />
                    <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335" />
                </svg>
                <span>{getButtonText()}</span>
            </button>
        </motion.div>
    );
}