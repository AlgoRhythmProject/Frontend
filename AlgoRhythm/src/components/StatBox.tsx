import React from "react";
import clsx from "clsx";

interface StatBoxProps {
    color?: "primary" | "info" | "success" | "warning" | "danger";
    children: React.ReactNode;
}

export const StatBox: React.FC<StatBoxProps> = ({ color = "primary", children }) => {
    return (
        <div
            className={clsx(
                "rounded-xl px-4 py-2 border font-sans font-medium",
                `bg-${color}/20 border-${color} text-${color}`
            )}
        >
            <p>{children}</p>
        </div>
    );
};
