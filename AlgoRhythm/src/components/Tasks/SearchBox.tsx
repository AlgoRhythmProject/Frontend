import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function SearchBox({ value, onChange }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
        >
            <div className="box-border flex items-center px-4 py-3 relative rounded-xl bg-transparent">
                <div aria-hidden="true" className="absolute border border-muted inset-0 pointer-events-none rounded-xl" />
                <input
                    type="text"
                    placeholder="Search tasks by name..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-transparent border-none outline-none text-foreground placeholder-secondary-foreground flex-1"
                />
                <Search className="w-5 h-5 text-muted-foreground" />
            </div>
        </motion.div>
    );
}