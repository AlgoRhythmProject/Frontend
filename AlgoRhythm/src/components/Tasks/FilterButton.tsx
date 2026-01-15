import { motion } from "framer-motion";

export function FilterButton({ active, onClick, children }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
        w-full cursor-pointer text-left px-3 py-2 rounded-lg font-sans transition-colors flex items-center justify-between
        ${active ? 'bg-primary text-on-primary' : 'text-muted-foreground hover:bg-background'}
      `}
        >
            {children}
        </motion.button>
    );
}