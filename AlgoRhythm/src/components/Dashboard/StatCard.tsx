// components/Dashboard/StatCard.tsx
import type { JSX } from 'react';

interface StatCardProps {
    icon: JSX.Element;
    bg: string;
    label: string;
    value: number | string;
    sub: string;
    color?: string;
    delay?: number;
}

export function StatCard({ icon, bg, label, value, sub, color = 'text-foreground' }: StatCardProps) {
    return (
        <div
            className="bg-card border border-muted rounded-2xl p-6"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 ${bg} rounded-lg`}>{icon}</div>
                <p className="font-sans text-muted-foreground">{label}</p>
            </div>
            <p className="font-sans font-medium text-foreground text-3xl">{value}</p>
            <p className={`font-sans ${color} text-sm`}>{sub}</p>
        </div>
    );
}
