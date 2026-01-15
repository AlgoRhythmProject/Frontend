import React, { useEffect, useRef, useCallback } from 'react';
import type { Node, Edge } from "@/types/visualizations/Graph";
import type { VisualState } from "@/hooks/useAlgorithmRunner";

interface GraphCanvasProps {
    nodes: (Node & { isStart?: boolean; isEnd?: boolean })[];
    edges: Edge[];
    selectedNodeId: string | null;
    mode: string;
    edgePreview: { from: string | null, mousePos: { x: number, y: number } };
    visualState: VisualState;

    // Events
    onNodeClick: (node: Node) => void;
    onEdgeClick: (edge: Edge) => void;
    onNodeMouseDown: (node: Node) => void;
    onNodeMouseUp: (node: Node) => void;
    onCanvasClick: (x: number, y: number) => void;
    onMouseMove: (x: number, y: number) => void;
}

const NODE_RADIUS = 30;

export const GraphCanvas = ({
                                nodes, edges, visualState,
                                selectedNodeId, mode, edgePreview,
                                onNodeClick, onEdgeClick, onNodeMouseDown, onNodeMouseUp, onCanvasClick, onMouseMove,
                            }: GraphCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const getCoords = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const getNodeAt = (x: number, y: number) => nodes.find(n => Math.hypot(n.x - x, n.y - y) < NODE_RADIUS);

    const getEdgeAt = (x: number, y: number) => {
        const THRESHOLD = 2;

        return edges.find(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return false;

            const dist = distToSegment({ x, y }, fromNode, toNode);

            return dist < THRESHOLD;
        });
    };

    const distToSegment = (p: {x: number, y: number}, a: {x: number, y: number}, b: {x: number, y: number}) => {
        const l2 = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
        if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);

        let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
        t = Math.max(0, Math.min(1, t));

        return Math.hypot(
            p.x - (a.x + t * (b.x - a.x)),
            p.y - (a.y + t * (b.y - a.y))
        );
    };

    // --- Drawing Logic ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (nodes.length === 0) {
            ctx.fillStyle = '#475569';
            ctx.font = '16px Inter, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Click to add nodes...', canvas.width / 2, canvas.height / 2);
            return;
        }

        edges.forEach(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;

            const isBiDirectional = edges.some(e => e.from === edge.to && e.to === edge.from);

            const edgeKey = `${edge.from}-${edge.to}`;
            const dynamicColor = visualState.edgeColors[edgeKey];
            const baseColor = dynamicColor || '#858181';
            const lineWidth = dynamicColor ? 4 : 2;

            drawArrow(
                ctx,
                fromNode.x, fromNode.y,
                toNode.x, toNode.y,
                baseColor,
                lineWidth,
                false,
                isBiDirectional
            );

            drawEdgeLabel(ctx, fromNode, toNode, edge, isBiDirectional);
        });

        if (mode === 'addEdge' && edgePreview.from) {
            const fromNode = nodes.find(n => n.id === edgePreview.from);
            if (fromNode) {
                drawArrow(ctx, fromNode.x, fromNode.y, edgePreview.mousePos.x, edgePreview.mousePos.y, '#fbbf24', 2, true);
            }
        }

        nodes.forEach(node => {

            let fillColor = '#6366f1'; // Default Indigo
            let strokeColor = 'rgba(255,255,255,0.2)';
            let glowColor = null;

            if (visualState.nodeColors[node.id]) {
                fillColor = visualState.nodeColors[node.id];
                glowColor = visualState.nodeColors[node.id];
                strokeColor = '#ffffff';
            } else if (node.isStart) {
                fillColor = '#10b981'; // Emerald
                glowColor = '#10b981';
            } else if (node.isEnd) {
                fillColor = '#ef4444'; // Red
            }

            if (selectedNodeId === node.id) {
                strokeColor = '#9e80a1';
            }

            // Glow Effect
            if (glowColor || selectedNodeId === node.id) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = glowColor || '#9e80a1';
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);

            // Gradient dla efektu 3D
            const grad = ctx.createRadialGradient(node.x - 8, node.y - 8, 4, node.x, node.y, NODE_RADIUS);
            grad.addColorStop(0, lightenColor(fillColor, 40));
            grad.addColorStop(1, fillColor);

            ctx.fillStyle = grad;
            ctx.fill();

            ctx.lineWidth = (selectedNodeId === node.id || visualState.nodeColors[node.id]) ? 3 : 2;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();

            ctx.shadowBlur = 0;

            // Label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);
        });

    }, [nodes, edges, visualState, selectedNodeId, mode, edgePreview]);

    const drawArrow = (
        ctx: CanvasRenderingContext2D,
        x1: number, y1: number,
        x2: number, y2: number,
        color: string,
        width: number,
        dashed = false,
        isCurved = false
    ) => {
        const headLength = 12;
        const angle = Math.atan2(y2 - y1, x2 - x1);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if (dashed) ctx.setLineDash([5, 5]); else ctx.setLineDash([]);

        if (isCurved) {
            const cpX = (x1 + x2) / 2 + Math.cos(angle + Math.PI / 2) * 30;
            const cpY = (y1 + y2) / 2 + Math.sin(angle + Math.PI / 2) * 30;

            const arrowAngle = Math.atan2(y2 - cpY, x2 - cpX);
            const startX = x1 + NODE_RADIUS * Math.cos(Math.atan2(cpY - y1, cpX - x1));
            const endX = x2 - NODE_RADIUS * Math.cos(arrowAngle);
            const endY = y2 - NODE_RADIUS * Math.sin(arrowAngle);

            ctx.moveTo(startX, y1 + NODE_RADIUS * Math.sin(Math.atan2(cpY - y1, cpX - x1)));
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            ctx.stroke();

            // Grot strzałki
            drawHead(ctx, endX, endY, arrowAngle, headLength, color);
        } else {
            const startX = x1 + NODE_RADIUS * Math.cos(angle);
            const startY = y1 + NODE_RADIUS * Math.sin(angle);
            const endX = x2 - NODE_RADIUS * Math.cos(angle);
            const endY = y2 - NODE_RADIUS * Math.sin(angle);

            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            drawHead(ctx, endX, endY, angle, headLength, color);
        }
        ctx.setLineDash([]);
    };

    const drawHead = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, len: number, color: string) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - len * Math.cos(angle - Math.PI / 6), y - len * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x - len * Math.cos(angle + Math.PI / 6), y - len * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = color;
        ctx.fill();
    };


    const lightenColor = (hex: string, percent: number) => {
        const num = Number.parseInt(hex.replace("#",""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255 ) * 0x100 + ( B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const drawEdgeLabel = (ctx: CanvasRenderingContext2D, from: any, to: any, edge: any, isCurved: boolean) => {
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        let midX = (from.x + to.x) / 2;
        let midY = (from.y + to.y) / 2;

        if (isCurved) {
            midX += Math.cos(angle + Math.PI / 2) * 22;
            midY += Math.sin(angle + Math.PI / 2) * 22;
        }

        const edgeKey = `${edge.from}-${edge.to}`;
        const labelText = visualState.edgeLabels[edgeKey] || edge.weight.toString();
        const isActiveLabel = !!visualState.edgeLabels[edgeKey];

        ctx.font = '20px Inter, monospace';
        const padding = 10;

        ctx.fillStyle = isActiveLabel ? '#0a0a0a' : '#000000';
        ctx.fillRect(midX - 0 / 2 - padding / 2, midY - 20, 2 * padding, 30);

        ctx.fillStyle = isActiveLabel ? '#ffffff' : '#b5c2d5';
        ctx.fillText(labelText, midX, midY);
        ctx.fillStyle = isActiveLabel ? '#00ffff' : '#ff00ff';
    };

    useEffect(() => {
        draw();
    }, [draw]);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                canvasRef.current.width = containerRef.current.offsetWidth;
                canvasRef.current.height = containerRef.current.offsetHeight;
                draw();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    return (
        <div ref={containerRef} className="w-full h-full bg-background">
            <canvas
                ref={canvasRef}
                className="block cursor-crosshair touch-none"
                onMouseDown={(e) => {
                    const { x, y } = getCoords(e);
                    const node = getNodeAt(x, y);
                    if (node) onNodeMouseDown(node);
                }}

                onMouseUp={(e) => {
                    const { x, y } = getCoords(e);
                    const node = getNodeAt(x, y);
                    if (node) onNodeMouseUp(node);
                    else onNodeMouseUp(node as any);
                }}

                onMouseMove={(e) => {
                    const { x, y } = getCoords(e);
                    onMouseMove(x, y);
                }}
                onClick={(e) => {
                    const { x, y } = getCoords(e);

                    const node = getNodeAt(x, y);
                    if (node) {
                        onNodeClick(node);
                    }

                    const edge = getEdgeAt(x, y);
                    if (edge) {
                        onEdgeClick(edge);
                    }
                    else {
                        onCanvasClick(x, y);
                    }
                }}
            />
        </div>
    );
};