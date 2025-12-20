import { motion } from "framer-motion";

export function Pagination({ totalPages, currentPage, onChange }: any) {
    if (totalPages <= 1) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
            <div className="text-muted-foreground">Page <span className="text-primary">{currentPage}</span> of {totalPages}</div>

            <div className="flex gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-card border border-muted rounded-lg disabled:opacity-30 hover:border-primary"
                >
                    Previous
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-card border border-muted rounded-lg disabled:opacity-30 hover:border-primary"
                >
                    Next
                </motion.button>
            </div>
        </motion.div>
    );
}