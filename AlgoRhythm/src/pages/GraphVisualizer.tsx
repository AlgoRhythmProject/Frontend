import { useEffect, useState } from 'react';
import { Panel, Group } from "react-resizable-panels";
import { CodeEditor } from "@/components/CodeEditor";
import { Play, Code2, Eraser, RefreshCcw, X } from 'lucide-react';
import { useGraph } from '@/hooks/useGraph';
import { useAlgorithmRunner } from '@/hooks/useAlgorithmRunner';
import { GraphCanvas } from '@/components/Visualizations/GraphCanvas';
import { Toolbar } from '@/components/Visualizations/Toolbar';
import { useGraphTour } from "@/hooks/useGraphVisualizerTour";

const DEFAULT_CODE = `using System.Threading.Tasks;
using System.Collections.Generic;
using Graph;
/*
    API:
    public interface IGraph
    {
        Node? StartNode { get; }
        Node? EndNode { get; }
        Task SetNodeColor(string nodeId, string color);
        Task HighlightEdge(string fromId, string toId, string color);
        Task SetEdgeLabel(string fromId, string toId, string label);
        Task Log(string message);
        Task Sleep(int ms);
        List<Node> GetNeighbors(string nodeId);
    }
    
   public class Edge
   {
        public string From { get; set; } 
        public string To { get; set; }
        public double Weight { get; set; } 
   }
   
    public class Node
    {
        public string Id { get; set; } 
        public string Label { get; set; } 
    }
    
    Keep entry class and method names! (public class Solution { public async Task Solve(IGraph graph); } } 
    
*/
public class Solution
{
    public async Task Solve(IGraph graph)
    {
        await graph.Log("Starting BFS traversal");
        
        var startId = graph.StartNode.Id;
        if (string.IsNullOrEmpty(startId))
        {
            await graph.Log("No start node selected!");
            return;
        }
        
        var queue = new Queue<Node>();
        var visited = new HashSet<string>();
        
        queue.Enqueue(graph.StartNode);
        visited.Add(startId);
        await graph.SetNodeColor(startId, "#10b981"); 
        
        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            await graph.Log($"Visiting node: {current.Label}");
            await graph.SetNodeColor(current.Id, "#fbbf24"); 
            await graph.Sleep(1000);
            
            var neighbors = await graph.GetNeighbors(current.Id);
            foreach (var neighbor in neighbors)
            {
                if (!visited.Contains(neighbor.Id))
                {
                    visited.Add(neighbor.Id);
                    queue.Enqueue(neighbor);
                    await graph.HighlightEdge(current.Id, neighbor.Id, "#22c55e");
                    await graph.Sleep(500);
                    await graph.SetNodeColor(neighbor.Id, "#3b82f6"); 
                }
            }

            await graph.Sleep(500);
            await graph.SetNodeColor(current.Label, "#6366f1"); 
        }
        
        await graph.Log("BFS completed!");
    }
}
`;

export const GraphVisualizer = () => {
    const { startTour } = useGraphTour();

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            startTour();
            localStorage.setItem('hasSeenTour', 'true');
        }
    }, []);

    // Hooks
    const graph = useGraph();
    const runner = useAlgorithmRunner();

    // Editor state
    const [userCode, setUserCode] = useState(DEFAULT_CODE);

    // UI mode state
    const [mode, setMode] = useState<'select' | 'addEdge' | 'move' | 'delete' | 'deleteEdge'>('select');

    // Node selection state
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [startNodeId, setStartNodeId] = useState<string | null>(null);
    const [endNodeId, setEndNodeId] = useState<string | null>(null);

    // Edge creation state
    const [edgeFromId, setEdgeFromId] = useState<string | null>(null);
    const [edgeWeight, setEdgeWeight] = useState('1');

    // Mouse interaction state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

    // Event handlers
    const handleNodeClick = (node: any) => {
        if (runner.isRunning) return;

        // Delete mode
        if (mode === 'delete') {
            graph.removeNode(node.id);
            if (startNodeId === node.id) setStartNodeId(null);
            if (endNodeId === node.id) setEndNodeId(null);
            return;
        }

        // Add edge mode
        if (mode === 'addEdge') {
            if (edgeFromId) {
                graph.addEdge(edgeFromId, node.id, Number.parseInt(edgeWeight) || 1);
                setEdgeFromId(null);
            } else {
                setEdgeFromId(node.id);
            }
            return;
        }

        // Select mode
        setSelectedNodeId(node.id);
    };

    const handleEdgeClick = (edge: any) => {
        if (runner.isRunning) return;

        // Delete mode
        if (mode === 'deleteEdge') {
            graph.removeEdge(edge.from, edge.to);
        }
    };

    const handleCanvasClick = (x: number, y: number) => {
        if (!runner.isRunning && mode === 'select') {
            graph.addNode(x, y);
        }
    };

    const handleMouseMove = (x: number, y: number) => {
        setMousePos({ x, y });
        if (draggingNodeId) {
            graph.moveNode(draggingNodeId, x, y);
        }
    };

    const handleRunCode = () => {
        if (!runner.isRunning) {
            runner.run(userCode, graph.nodes, graph.edges, startNodeId, endNodeId);
        }
    };

    const handleResetCode = () => {
        setUserCode(DEFAULT_CODE);
    };

    const clear = () => {
        graph.clear();
        setSelectedNodeId(null);
        setStartNodeId(null);
        setEndNodeId(null);
        setDraggingNodeId(null);
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
            {/* Left sidebar - Tools */}
            <div className="border-r border-border z-10 bg-card" id="toolbar">
                <Toolbar
                    mode={mode}
                    setMode={setMode}
                    selectedNodeId={selectedNodeId}
                    onSetStart={() => selectedNodeId && setStartNodeId(selectedNodeId)}
                    onSetEnd={() => selectedNodeId && setEndNodeId(selectedNodeId)}
                    edgeWeight={edgeWeight}
                    setEdgeWeight={setEdgeWeight}
                    isRunning={runner.isRunning}
                    onRandomGraph={() => graph.generateRandomGraph(800, 600)}
                />
            </div>

            {/* Center + Right - Resizable panels */}
            <Group orientation="horizontal" className="flex-1">
                {/* Visualization panel */}
                <Panel defaultSize={66} minSize={30} className="bg-background relative" id="canvas">
                    <main className="h-full relative flex flex-col">
                        {/* Info bar */}
                        <div
                            className="h-14 border-b border-border bg-muted/30 flex items-center justify-start p-4 gap-4">
                            <div
                                className="bg-card/90 backdrop-blur px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-muted-foreground shadow-soft">
                                Vertex count: <span className="text-foreground font-bold">{graph.nodes.length}</span>
                            </div>
                            {startNodeId && (
                                <button
                                    onClick={() => setStartNodeId(null)}
                                    className="bg--background hover:bg-primary/20 backdrop-blur px-3 py-1.5 rounded-lg
                                        border border-primary text-xs font-mono text-primary hover:primary-hover
                                        shadow-soft animate-in fade-in flex items-center">
                                    Start: <span className="text-bold text-primary-light">
                                        {graph.nodes.find(n => n.id === startNodeId)?.label}</span>
                                    <X size={16} className="pt-0.5 pl-1 ml-1" />
                                </button>
                            )}
                            {endNodeId && (
                                <button
                                    onClick={() => setEndNodeId(null)}
                                    className="bg--background hover:bg-primary/20 backdrop-blur px-3 py-1.5 rounded-lg
                                        border border-primary text-xs font-mono text-primary hover:primary-hover
                                        shadow-soft animate-in fade-in flex items-center">
                                    End: <span className="text-bold text-primary-light">
                                        {graph.nodes.find(n => n.id === endNodeId)?.label}</span>
                                    <X size={16} className="pt-0.5 pl-1 ml-1" />
                                </button>
                            )}

                            <button
                                onClick={() => runner.reset()}
                                className="p-2 ml-auto bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-lg text-xs flex items-center gap-2 transition-all opacity-70 hover:opacity-100 shadow-sm"
                                title="Reset graph to original state">
                                <RefreshCcw size={14} /> Reset
                            </button>
                            <button
                                onClick={clear}
                                className="p-2 bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-lg text-xs flex items-center gap-2 transition-all opacity-70 hover:opacity-100 shadow-sm"
                                title="Clear canvas">
                                <Eraser size={14} /> Clear
                            </button>
                        </div>

                        {/* Graph canvas */}
                        <GraphCanvas
                            nodes={graph.nodes.map(n => ({
                                ...n,
                                isStart: n.id === startNodeId,
                                isEnd: n.id === endNodeId
                            }))}
                            edges={graph.edges}
                            visualState={runner.visualState}
                            mode={mode}
                            selectedNodeId={selectedNodeId}
                            edgePreview={{ from: edgeFromId, mousePos }}
                            onNodeClick={handleNodeClick}
                            onEdgeClick={handleEdgeClick}
                            onCanvasClick={handleCanvasClick}
                            onNodeMouseDown={(n) => !runner.isRunning && mode === 'move' && setDraggingNodeId(n.id)}
                            onNodeMouseUp={() => setDraggingNodeId(null)}
                            onMouseMove={handleMouseMove}
                        />

                        {/* Logs panel */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl pointer-events-none" id="logs">
                            <div className="bg-card/90 backdrop-blur border border-border p-4 rounded-2xl shadow-soft pointer-events-auto flex flex-col-reverse gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                                {runner.visualState.logs.length === 0 ? (
                                    <span className="text-muted-foreground text-xs text-center py-2">
                                        Ready to run... logs will appear here.
                                    </span>
                                ) : (
                                    runner.visualState.logs.map((log, i) => (
                                        <div
                                            key={i}
                                            className="text-[11px] font-mono text-foreground border-l-2 border-primary pl-2"
                                        >
                                            {log}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </main>
                </Panel>

                {/* Code editor panel */}
                <Panel defaultSize={34} minSize={20} className="bg-card border-l border-border" id="editor">
                    <aside className="h-full flex flex-col shadow-soft">
                        {/* Header */}
                        <header className="h-14 border-b border-border bg-muted/30 flex items-center justify-between px-4">
                            <div className="flex items-center gap-2 text-primary font-bold select-none">
                                <Code2 size={18} />
                                <span className="text-sm tracking-wide">ALGORITHM SCRIPT</span>
                            </div>

                            {/* Control buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    id="run-code"
                                    onClick={handleRunCode}
                                    disabled={runner.isRunning}
                                    className={`
                                        flex items-center gap-2 px-6 py-1.5 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg 
                                        ${runner.isRunning
                                            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70 shadow-none'
                                            : 'bg-success hover:brightness-110 text-white shadow-success/20'
                                        }
                                    `}
                                >
                                    <Play size={14} fill="currentColor" />
                                    {runner.isRunning ? 'Running...' : 'Run Code'}
                                </button>
                            </div>
                        </header>

                        {/* Editor */}
                        <div className="flex-1 relative bg-card">
                            <CodeEditor
                                value={userCode}
                                onChange={(value) => setUserCode(value || "")}
                                language="csharp"
                            />

                            {/* Reset button */}
                            <button
                                onClick={handleResetCode}
                                className="absolute bottom-4 right-6 p-2 bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-lg text-xs flex items-center gap-2 transition-all opacity-70 hover:opacity-100 shadow-sm"
                                title="Reset Code to original state"
                            >
                                <Eraser size={14} /> Reset code
                            </button>
                        </div>
                    </aside>
                </Panel>
            </Group>
        </div>
    );
};