import { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { useGraph } from '@/hooks/useGraph';
import { useAlgorithmRunner } from '@/hooks/useAlgorithmRunner';
import { GraphCanvas } from '@/components/Visualizations/GraphCanvas';
import { Toolbar } from '@/components/Visualizations/Toolbar'; // Zakładam, że wydzielisz Toolbar
import type { GraphAlgorithm, AlgorithmStep } from "@/types/visualizations/Graph";

interface GraphVisualizerProps {
    availableAlgorithms: GraphAlgorithm[];
    defaultAlgorithmId?: string;
}

type Mode = 'select' | 'addEdge' | 'move' | 'delete';

const GraphVisualizer = ({ availableAlgorithms, defaultAlgorithmId }: GraphVisualizerProps) => {
    // 1. Hooks
    const graph = useGraph();
    const runner = useAlgorithmRunner();

    // 2. Local UI State
    const [mode, setMode] = useState<Mode>('select');
    const [selectedAlgoId, setSelectedAlgoId] = useState(defaultAlgorithmId || availableAlgorithms[0]?.id);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [startNodeId, setStartNodeId] = useState<string | null>(null);
    const [endNodeId, setEndNodeId] = useState<string | null>(null);

    const [edgeFromId, setEdgeFromId] = useState<string | null>(null);
    const [edgeWeight, setEdgeWeight] = useState('1');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

    const currentAlgorithm = useMemo(() =>
            availableAlgorithms.find(a => a.id === selectedAlgoId) || availableAlgorithms[0],
        [selectedAlgoId]);

    // 3. Handlers
    const handleNodeClick = (node: any) => {
        if (runner.isRunning) return;

        if (mode === 'delete') {
            graph.removeNode(node.id);
            if (startNodeId === node.id) setStartNodeId(null);
            if (endNodeId === node.id) setEndNodeId(null);
            return;
        }

        if (mode === 'addEdge') {
            if (!edgeFromId) {
                setEdgeFromId(node.id);
                runner.setLog(`Select target node for edge from ${node.label}`);
            } else {
                if (graph.addEdge(edgeFromId, node.id, parseInt(edgeWeight) || 1)) {
                    runner.setLog(`Edge added`);
                } else {
                    runner.setLog(`Cannot add edge (loop or duplicate)`);
                }
                setEdgeFromId(null);
            }
            return;
        }

        setSelectedNodeId(node.id);
        runner.setLog(`Selected: ${node.label}`);
    };

    const handleCanvasClick = (x: number, y: number) => {
        if (runner.isRunning) return;
        if (mode === 'select') {
            const newNode = graph.addNode(x, y);
            setSelectedNodeId(newNode.id);
            runner.setLog(`Added Node ${newNode.label}`);
        }
    };

    const handleRun = async () => {
        if (!startNodeId || !endNodeId) {
            runner.setLog("Set Start and End nodes first!");
            return;
        }

        // Reset wizualny grafu przed startem
        graph.resetGraphState();
        graph.updateNode(startNodeId, { distance: 0 });

        // Definiujemy jak algorytm ma aktualizować stan grafu
        const handleStepUpdate = (step: AlgorithmStep) => {
            if (step.nodeId) {
                graph.updateNode(step.nodeId, {
                    current: step.action === 'current',
                    visited: step.action === 'visit' || undefined, // undefined nie nadpisze istniejącego true
                    distance: step.distance,
                    extraLabel: step.customNodeLabel
                });
            }
        };

        await runner.run(currentAlgorithm, graph.nodes, graph.edges, startNodeId, endNodeId, handleStepUpdate);
    };

    // 4. Render
    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
            {/* --- Header (prostszy) --- */}
            <header className="flex justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
                <h1 className="text-xl font-bold">AlgoRhythm<span className="text-indigo-400">Visualizations</span></h1>

                <div className="flex gap-2">
                    {/* Przyciski algorytmów */}
                    {availableAlgorithms.map(algo => (
                        <button
                            key={algo.id}
                            onClick={() => setSelectedAlgoId(algo.id)}
                            className={`px-3 py-1 rounded ${selectedAlgoId === algo.id ? 'bg-indigo-600' : 'bg-slate-800'}`}
                        >
                            {algo.name}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    {runner.isRunning && (
                        <button onClick={() => window.location.reload()} className="p-2 bg-rose-600 rounded">
                            <RotateCcw size={18} />
                        </button>
                    )}
                    <button
                        onClick={runner.isRunning ? runner.togglePause : handleRun}
                        className="px-6 py-2 bg-emerald-600 rounded font-bold"
                    >
                        {runner.isRunning ? (runner.isPaused ? "Resume" : "Pause") : "Run"}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <Toolbar
                    mode={mode}
                    setMode={setMode}
                    selectedNodeId={selectedNodeId}
                    onSetStart={() => {
                        if (selectedNodeId) {
                            setStartNodeId(selectedNodeId);
                            graph.updateNode(selectedNodeId, {isStart: true, isEnd: false});
                            // Reset poprzedniego startu w useGraph
                            graph.nodes.forEach(n => {
                                if (n.id !== selectedNodeId && n.isStart) {
                                    graph.updateNode(n.id, {isStart: false});
                                }
                            });
                        }
                    }}
                    onSetEnd={() => {
                        if (selectedNodeId) {
                            setEndNodeId(selectedNodeId);
                            graph.updateNode(selectedNodeId, {isEnd: true, isStart: false});
                            // Reset poprzedniego końca
                            graph.nodes.forEach(n => {
                                if (n.id !== selectedNodeId && n.isEnd) {
                                    graph.updateNode(n.id, {isEnd: false});
                                }
                            });
                        }
                    }}
                    edgeWeight={edgeWeight}
                    setEdgeWeight={setEdgeWeight}
                    isRunning={runner.isRunning}
                    onRandomGraph={() => graph.generateRandomGraph(10, 10) }
                />

                {/* --- Main Canvas --- */}
                <main className="relative flex-1 bg-slate-950 overflow-hidden">
                    <GraphCanvas
                        nodes={graph.nodes}
                        edges={graph.edges}
                        path={runner.path}
                        markedEdges={runner.markedEdges}
                        selectedNodeId={selectedNodeId}
                        mode={mode}
                        edgePreview={{from: edgeFromId, mousePos}}

                        onNodeClick={handleNodeClick}
                        onCanvasClick={handleCanvasClick}
                        onNodeMouseDown={(n) => !runner.isRunning && mode === 'move' && setDraggingNodeId(n.id)}
                        onNodeMouseUp={() => setDraggingNodeId(null)}
                        onMouseMove={(x, y) => {
                            setMousePos({x, y});
                            if (draggingNodeId) graph.moveNode(draggingNodeId, x, y);
                        }}
                    />

                    {/* Log Overlay */}
                    <div
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 px-6 py-3 rounded-full border border-slate-700">
                        {runner.log}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GraphVisualizer;