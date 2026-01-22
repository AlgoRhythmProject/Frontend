export const ToolbarButton = ({ active, onClick, icon, label, disabled }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, disabled: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all text-[10px] font-medium
            ${active
            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
            : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground shadow-sm'
        }
            disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed
        `}
    >
        {icon}
        <span className="text-center leading-tight">{label}</span>
    </button>
);