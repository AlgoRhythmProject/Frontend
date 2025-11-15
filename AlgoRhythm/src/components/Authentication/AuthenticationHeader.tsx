import { motion } from "framer-motion";

interface LoginHeaderProps {
    title?: string;
    subtitle?: string;
    delayTitle?: number;
    delaySubtitle?: number;
}

export function AuthenticationHeader({
    title = "AlgoRhythm",
    subtitle = "Master data structures and algorithms",
    delayTitle = 0.2,
    delaySubtitle = 0.3,
}: Readonly<LoginHeaderProps>) {
    return (
        <div className="text-center mb-8">
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delayTitle }}
                className="font-sans font-bold text-4xl text-foreground mb-2"
                style={{ fontVariationSettings: "'wdth' 100" }}
            >
                {title}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delaySubtitle }}
                className="font-sans text-muted-foreground"
            >
                {subtitle}
            </motion.p>
        </div>
    );
}
