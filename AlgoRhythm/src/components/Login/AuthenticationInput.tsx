import React from "react";
import { motion } from "framer-motion";

interface LoginInputProps {
    label: string;
    type: string;
    icon: React.ReactNode;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    delay?: number;
}

export function AuthenticationInput({ label, type, icon, value, onChange, placeholder, delay = 0 }: LoginInputProps) {
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
            <label className="block font-sans text-foreground mb-2 text-sm">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground">{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required
                    className="w-full bg-card border border-muted rounded-lg px-12 py-3 text-foreground placeholder-[#6b6b6b] font-sans outline-none focus:border-primary transition-colors"
                />
            </div>
        </motion.div>
    );
}
