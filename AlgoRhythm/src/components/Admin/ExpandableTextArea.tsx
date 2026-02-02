import { Maximize2, X } from 'lucide-react';
import { useState } from 'react';

interface ExpandableTextareaProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    rows?: number;
    className?: string;
    isCode?: boolean;
    helperText?: string;
}

export function ExpandableTextarea({
    value,
    onChange,
    label,
    placeholder,
    rows = 8,
    className = '',
    isCode = false,
    helperText
}: ExpandableTextareaProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block font-sans font-medium text-foreground">
                        {label}
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="cursor-pointer flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Maximize2 className="w-3 h-3" />
                        Expand
                    </button>
                </div>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    className={`w-full px-4 py-2 bg-background border border-muted rounded-lg ${isCode ? 'font-mono' : 'font-sans'
                        } text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y ${className}`}
                    placeholder={placeholder}
                />
                {helperText && (
                    <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isExpanded && (
                <div className="fixed inset-0 bg-background z-[100] flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-muted">
                        <h3 className="font-sans font-medium text-lg">{label}</h3>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-hidden">
                        <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className={`w-full h-full px-4 py-2 bg-card border border-muted rounded-lg ${isCode ? 'font-mono' : 'font-sans'
                                } text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
                            placeholder={placeholder}
                            autoFocus
                        />
                    </div>
                    <div className="p-4 border-t border-muted flex justify-end">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="cursor-pointer px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-lg font-sans font-medium transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}