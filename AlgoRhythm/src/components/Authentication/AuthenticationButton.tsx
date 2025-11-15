import { motion } from "framer-motion";

interface AuthenticationButtonProps {
    isLoading: boolean;
    text?: string;
    delay?: number;
}

export function AuthenticationButton({
    isLoading,
    text = "Submit",
    delay = 0.6,
}: Readonly<AuthenticationButtonProps>) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-primary to-[#8b5cf6] text-foreground py-3 rounded-lg font-sans font-medium hover:from-[#7952e5] hover:to-[#9c6cf7] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {text}...
                </span>
            ) : (
                <span className="flex items-center justify-center gap-2">{text}</span>
            )}
        </motion.button>
    );
}
