import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { AuthenticationInput } from "../components/Authentication/AuthenticationInput";
import { AuthenticationHeader } from "../components/Authentication/AuthenticationHeader";
import { AuthenticationBackground } from "../components/Authentication/AuthenticationBackground";
import { AuthenticationButton } from "../components/Authentication/AuthenticationButton";
import { AuthenticationFooter } from "../components/Authentication/AuthenticationFooter";
import { GoogleLoginButton } from "../components/Authentication/GoogleLoginButton";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { login } from "../store/userSlice";
import { authApi } from "../api/auth/authApi";
import { adminApi } from "../api/admin/adminApi";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { useTheme } from "@/hooks/themeContext";
import { ApiError } from "@/api/auth/types";

export function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

  const handleLoginSuccess = async (user: any) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", "true");

    if (user.token) {
      try {
        const tokenParts = user.token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp) {
            const expiresUtc = new Date(payload.exp * 1000).toISOString();
            localStorage.setItem("tokenExpiresAt", expiresUtc);
          }
        }
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
      }
    }

    dispatch(login(user));

    try {
      const adminStatus = await adminApi.isCurrentUserAdmin();
      localStorage.setItem("isAdmin", JSON.stringify(adminStatus.isAdmin));
      navigate(adminStatus.isAdmin ? "/admin" : "/");
    } catch (adminCheckError) {
      console.error('Failed to check admin status:', adminCheckError);
      navigate("/");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) {
      setError("Email must contain @");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      const user = await authApi.login({ email, password });
      await handleLoginSuccess(user);
    } catch (err: any) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'USER_NOT_FOUND':
            setError("Invalid email. Try again or make a new account.");
            break;
          case 'INVALID_PASSWORD':
            setError("Invalid password. Try again.");
            break;
          case 'EMAIL_NOT_VERIFIED':
            setError("Please verify your email address before logging in.");
            setTimeout(() => {
              navigate(`/verify-email?email=${encodeURIComponent(email)}`);
            }, 2000);
            break;
          default:
            setError(err.message || "Login failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await authApi.googleLogin(credential);
      await handleLoginSuccess(user);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || "Google login failed. Please try again.");
      } else {
        setError("An unexpected error occurred during Google login.");
      }
      console.error("Google login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error("Google Sign-In error:", error);
    setError("Google Sign-In was cancelled or failed.");
  };

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
            <AuthenticationHeader />
            <form onSubmit={handleLogin} className="space-y-5">
              <AuthenticationInput
                label="Email"
                type="email"
                icon={<Mail />}
                value={email}
                onChange={setEmail}
                placeholder="your@email.com"
                delay={0.4}
              />
              <AuthenticationInput
                label="Password"
                type="password"
                icon={<Lock />}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                delay={0.5}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-right"
              >
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-sans text-sm text-primary-light hover:underline"
                >
                  Forgot password?
                </button>
              </motion.div>

              {error && <p className="text-error text-sm">{error}</p>}
              <AuthenticationButton isLoading={isLoading} text="Login" />
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="relative my-6"
            />
            {/* Google Sign-In Button */}
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              isDark={isDark}
            />
            <AuthenticationFooter
              promptText="Don't have an account?"
              linkText="Sign up"
              onLinkClick={() => navigate("/register")}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="font-sans text-secondary-foreground text-sm">
                Your place to learn algorithms and data structures
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}