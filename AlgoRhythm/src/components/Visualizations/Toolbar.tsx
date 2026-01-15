import {Move, Link as LinkIcon, Trash2, MousePointer2, Flag, Target, Scissors, Shuffle} from 'lucide-react';
import { ToolbarButton } from "./ToolbarButton";

type EditorMode = 'select' | 'addEdge' | 'move' | 'delete' | 'deleteEdge';

interface ToolbarProps {
    mode:EditorMode;
    setMode: (mode: EditorMode) => void;
    selectedNodeId: string | null;
    onSetStart: () => void;
    onSetEnd: () => void;
    edgeWeight: string;
    setEdgeWeight: (weight: string) => void;
    isRunning: boolean;
    onRandomGraph: () => void;
}

export const Toolbar = ({
                            mode,
                            setMode,
                            selectedNodeId,
                            onSetStart,
                            onSetEnd,
                            edgeWeight,
                            setEdgeWeight,
                            isRunning,
                            onRandomGraph,
                        }: ToolbarProps) => {
    return (
        <aside className="w-80 bg-background border-r border-border p-6 flex flex-col gap-8 overflow-y-auto h-full transition-colors duration-300">
            {/* Editor Tools */}
            <section>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Editor Tools
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <ToolbarButton
                        active={mode === 'select'}
                        onClick={() => setMode('select')}
                        disabled={isRunning}
                        icon={<MousePointer2 size={18}/>}
                        label="Add Nodes"
                    />
                    <ToolbarButton
                        active={mode === 'addEdge'}
                        onClick={() => setMode('addEdge')}
                        disabled={isRunning}
                        icon={<LinkIcon size={18}/>}
                        label="Add Edges"
                    />
                    <ToolbarButton
                        active={mode === 'move'}
                        onClick={() => setMode('move')}
                        disabled={isRunning}
                        icon={<Move size={18}/>}
                        label="Move"
                    />
                    <ToolbarButton
                        active={mode === 'delete'}
                        onClick={() => setMode('delete')}
                        disabled={isRunning}
                        icon={<Trash2 size={18}/>}
                        label="Delete vertex"
                    />
                    <ToolbarButton
                        active={mode === 'deleteEdge'}
                        onClick={() => setMode('deleteEdge')}
                        icon={<Scissors size={18}/>}
                        disabled={isRunning}
                        label="Delete edge"
                    />
                    <ToolbarButton
                        active={false}
                        onClick={onRandomGraph}
                        icon={<Shuffle size={18}/>}
                        disabled={isRunning}
                        label="Random graph"
                    />
                </div>
            </section>

            {/* Edge Weight Input */}
            {mode === 'addEdge' && (
                <section
                    className="bg-card p-4 rounded-xl border border-border shadow-soft animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">
                        New Edge Weight
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={edgeWeight}
                        onChange={(e) => setEdgeWeight(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary transition-all outline-none"
                    />
                </section>
            )}

            {/* Node Operations */}
            <section>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Node Operations
                </h3>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onSetStart}
                        disabled={!selectedNodeId || isRunning}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-info/10 hover:bg-info text-info hover:text-white border border-info/30 rounded-xl transition-all font-semibold disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        <Flag size={18} />
                        Set as Start
                    </button>
                    <button
                        onClick={onSetEnd}
                        disabled={!selectedNodeId || isRunning}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-error/10 hover:bg-error text-error hover:text-white border border-error/30 rounded-xl transition-all font-semibold disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        <Target size={18} />
                        Set as End
                    </button>
                </div>
                {!selectedNodeId && (
                    <p className="text-[11px] text-muted-foreground mt-3 text-center italic">
                        Select a node on the canvas to see actions
                    </p>
                )}
            </section>

            {/* Legend / Status */}
            <section className="mt-auto">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 shadow-soft">
                    <h4 className="text-xs font-bold text-primary uppercase mb-3">Quick Guide</h4>
                    <ul className="text-[11px] text-muted-foreground space-y-2">
                        <li className="flex gap-2 items-start">
                            <span className="w-2 h-2 rounded-full bg-info mt-1 shrink-0" />
                            <span>Blue nodes are source points.</span>
                        </li>
                        <li className="flex gap-2 items-start">
                            <span className="w-2 h-2 rounded-full bg-error mt-1 shrink-0" />
                            <span>Red nodes are target points.</span>
                        </li>
                        <li className="flex gap-2 items-start">
                            <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                            <span>Drag nodes in 'Move' mode to layout.</span>
                        </li>
                    </ul>
                </div>
            </section>
        </aside>
    );
};