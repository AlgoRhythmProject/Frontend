export const ToolbarButton = ({ active, onClick, icon, label, disabled }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, disabled: boolean }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
            active
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
        }`}
    >
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
);