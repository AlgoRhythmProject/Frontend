import {Move, Link as LinkIcon, Trash2, MousePointer2, Flag, Target, RotateCcw} from 'lucide-react';
import { ToolbarButton } from "./ToolbarButton";

interface ToolbarProps {
    mode: 'select' | 'addEdge' | 'move' | 'delete';
    setMode: (mode: 'select' | 'addEdge' | 'move' | 'delete') => void;
    selectedNodeId: string | null;
    onSetStart: () => void;
    onSetEnd: () => void;
    edgeWeight: string;
    setEdgeWeight: (weight: string) => void;
    isRunning: boolean;
    onRandomGraph: any;
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
        <aside className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 overflow-y-auto">
            {/* Sekcja 1: Tryby Manipulacji */}
            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Editor Tools</h3>
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
                        label="Delete"
                    />
                </div>
            </section>

            {/* Sekcja 2: Konfiguracja Krawędzi */}
            {mode === 'addEdge' && (
                <section
                    className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">New Edge Weight</label>
                    <input
                        type="number"
                        min="1"
                        value={edgeWeight}
                        onChange={(e) => setEdgeWeight(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                </section>
            )}

            {/* Sekcja 3: Akcje na wybranym węźle */}
            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Node Operations</h3>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onSetStart}
                        disabled={!selectedNodeId || isRunning}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-600/30 rounded-xl transition-all font-semibold disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        <Flag size={18} />
                        Set as Start
                    </button>
                    <button
                        onClick={onSetEnd}
                        disabled={!selectedNodeId || isRunning}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/30 rounded-xl transition-all font-semibold disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        <Target size={18} />
                        Set as End
                    </button>
                </div>
                {!selectedNodeId && (
                    <p className="text-[11px] text-slate-600 mt-3 text-center italic">
                        Select a node on the canvas to see actions
                    </p>
                )}
            </section>

            {/* Sekcja 4: Legenda / Status */}
            <section className="mt-auto">
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3">Quick Guide</h4>
                    <ul className="text-[11px] text-slate-400 space-y-2">
                        <li className="flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                            Blue nodes are source points.
                        </li>
                        <li className="flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1" />
                            Red nodes are target points.
                        </li>
                        <li className="flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1" />
                            Drag nodes in 'Move' mode to layout.
                        </li>
                    </ul>
                </div>
            </section>
        </aside>
    );
};