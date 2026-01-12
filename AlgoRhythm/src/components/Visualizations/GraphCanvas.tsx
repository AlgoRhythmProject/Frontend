import { useEffect, useRef, useCallback } from 'react';
import type {Node, Edge} from "@/types/visualizations/Graph";

interface GraphCanvasProps {
    nodes: Node[];
    edges: Edge[];
    path: string[];
    markedEdges: { from: string, to: string }[];
    selectedNodeId: string | null;
    mode: string;
    edgePreview: { from: string | null, mousePos: { x: number, y: number } };

    // Events
    onNodeClick: (node: Node) => void;
    onNodeMouseDown: (node: Node) => void;
    onNodeMouseUp: () => void;
    onCanvasClick: (x: number, y: number) => void;
    onMouseMove: (x: number, y: number) => void;
}

export const GraphCanvas = ({
                                nodes, edges, path, markedEdges, selectedNodeId, mode, edgePreview,
                                onNodeClick, onNodeMouseDown, onNodeMouseUp, onCanvasClick, onMouseMove
                            }: GraphCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getCoords = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const getNodeAt = (x: number, y: number) => nodes.find(n => Math.hypot(n.x - x, n.y - y) < 35);

    // --- Drawing Logic ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Tło - Głęboki granat z gradientem
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (nodes.length === 0) {
            ctx.fillStyle = '#475569';
            ctx.font = '18px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Click anywhere to add your first node', canvas.width / 2, canvas.height / 2);
            return;
        }

        // 2. Krawędzie (Edges)
        edges.forEach(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;

            const isMarked = markedEdges.some(e =>
                (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
            );

            const isInPath = path.length > 0 &&
                path.some((_, i) =>
                    i < path.length - 1 &&
                    ((path[i] === edge.from && path[i + 1] === edge.to) ||
                        (path[i] === edge.to && path[i + 1] === edge.from))
                );

            const grd = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);

            if (isInPath) {
                grd.addColorStop(0, '#10b981'); grd.addColorStop(1, '#34d399');
                ctx.lineWidth = 5;
            } else if (isMarked) {
                grd.addColorStop(0, '#f59e0b'); grd.addColorStop(1, '#fbbf24');
                ctx.lineWidth = 4;
            } else {
                grd.addColorStop(0, '#475569'); grd.addColorStop(1, '#64748b');
                ctx.lineWidth = 3;
            }

            ctx.strokeStyle = grd;
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();

            // Wagi krawędzi (Oryginalne kółeczka)
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            ctx.beginPath();
            ctx.arc(midX, midY, 18, 0, Math.PI * 2);
            ctx.fillStyle = isInPath ? '#10b981' : isMarked ? '#f59e0b' : '#334155';
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(edge.weight.toString(), midX, midY);
        });

        // 3. Linia pomocnicza (Preview)
        if (mode === 'addEdge' && edgePreview.from) {
            const fromNode = nodes.find(n => n.id === edgePreview.from);
            if (fromNode) {
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(edgePreview.mousePos.x, edgePreview.mousePos.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // 4. Węzły (Nodes)
        nodes.forEach(node => {
            const isSelected = selectedNodeId === node.id;

            // Przywrócenie efektu ShadowBlur (Glow)
            if (node.current || node.isStart || node.isEnd || isSelected) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 45, 0, Math.PI * 2);
                ctx.shadowBlur = 30;
                ctx.shadowColor = node.isStart ? '#3b82f6' :
                    node.isEnd ? '#ef4444' :
                        node.current ? '#f59e0b' : '#8b5cf6';
                ctx.fillStyle = node.isStart ? 'rgba(59, 130, 246, 0.2)' :
                    node.isEnd ? 'rgba(239, 68, 68, 0.2)' :
                        node.current ? 'rgba(245, 158, 11, 0.2)' : 'rgba(139, 92, 246, 0.2)';
                ctx.fill();
                ctx.shadowBlur = 0; // Reset poświaty dla reszty rysowania
            }

            // Body węzła - oryginalne żywe gradienty
            const nodeGradient = ctx.createRadialGradient(node.x - 10, node.y - 10, 5, node.x, node.y, 35);
            if (node.isStart) {
                nodeGradient.addColorStop(0, '#60a5fa'); nodeGradient.addColorStop(1, '#3b82f6');
            } else if (node.isEnd) {
                nodeGradient.addColorStop(0, '#f87171'); nodeGradient.addColorStop(1, '#ef4444');
            } else if (node.current) {
                nodeGradient.addColorStop(0, '#fbbf24'); nodeGradient.addColorStop(1, '#f59e0b');
            } else if (node.visited) {
                nodeGradient.addColorStop(0, '#a78bfa'); nodeGradient.addColorStop(1, '#8b5cf6');
            } else {
                nodeGradient.addColorStop(0, '#8b5cf6'); nodeGradient.addColorStop(1, '#6366f1');
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
            ctx.fillStyle = nodeGradient;
            ctx.fill();

            // Border
            ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.stroke();

            // Label i ExtraLabels
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 16px Inter, sans-serif';

            // Wyśrodkowanie tekstu zależnie od obecności etykiet dolnych
            const hasBottomLabel = node.extraLabel || (node.distance !== Infinity && node.distance >= 0);
            ctx.fillText(node.label, node.x, node.y - (hasBottomLabel ? 5 : -6));

            if (node.extraLabel) {
                ctx.font = '11px Inter, sans-serif';
                ctx.fillStyle = '#fbbf24';
                ctx.fillText(node.extraLabel, node.x, node.y + 14);
            } else if (node.distance !== Infinity && node.distance >= 0) {
                ctx.font = '11px Inter, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`d: ${node.distance}`, node.x, node.y + 14);
            }
        });
    }, [nodes, edges, path, markedEdges, selectedNodeId, mode, edgePreview]);
    useEffect(() => {
        draw();
    }, [draw]);

    // Resize Handler
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight;
                draw();
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={(e) => {
                const { x, y } = getCoords(e);
                const node = getNodeAt(x, y);
                if (node) onNodeMouseDown(node);
            }}
            onMouseUp={onNodeMouseUp}
            onMouseMove={(e) => {
                const { x, y } = getCoords(e);
                onMouseMove(x, y);
            }}
            onClick={(e) => {
                const { x, y } = getCoords(e);
                const node = getNodeAt(x, y);
                if (node) onNodeClick(node);
                else onCanvasClick(x, y);
            }}
        />
    );
};