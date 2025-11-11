import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { AuthenticationInput } from "../components/Authentication/AuthenticationInput";
import { AuthenticationHeader } from "../components/Authentication/AuthenticationHeader";
import { AuthenticationBackground } from "../components/Authentication/AuthenticationBackground";
import { AuthenticationButton } from "../components/Authentication/AuthenticationButton";
import { AuthenticationFooter } from "../components/Authentication/AuthenticationFooter";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { login } from '../store/userSlice';
import { Particles } from "../components/ui/shadcn-io/particles";

export function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const userFromBackend = {
        id: '123',
        email,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        isDeleted: false,
      };

      dispatch(login(userFromBackend));
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AuthenticationBackground />
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        refresh />

      {/* Login card */}
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
              <AuthenticationInput label="Email" type="email" icon={<Mail />} value={email} onChange={setEmail} placeholder="your@email.com" delay={0.4} />
              <AuthenticationInput label="Password" type="password" icon={<Lock />} value={password} onChange={setPassword} placeholder="••••••••" delay={0.5} />
              <div className="h-1" />
              <AuthenticationButton isLoading={isLoading} text="Login" />
            </form>
            <AuthenticationFooter
              promptText="Don’t have an account?"
              linkText="Sign up"
              onLinkClick={() => navigate("/register")}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 text-center">
              <p className="font-sans text-[#6b6b6b] text-sm">
                Your place to learn algorithms and data structures
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>

  );
}
