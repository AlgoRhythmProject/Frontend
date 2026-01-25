import { useState, useCallback } from 'react';
import type {Node, Edge} from "@/types/visualizations/Graph";

export const useGraph = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const addNode = useCallback((x: number, y: number) => {
        const newNode: Node = {
            id: Math.random().toString(36).substr(2, 9),
            x, y,
            label: String.fromCharCode(65 + nodes.length), // A, B, C...
            distance: Infinity,
            visited: false,
            current: false,
            isStart: false,
            isEnd: false
        };
        setNodes(prev => [...prev, newNode]);
        return newNode;
    }, [nodes.length]);

    const removeNode = useCallback((nodeId: string) => {
        setNodes(prev => prev.filter(n => n.id !== nodeId));
        setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    }, []);

    const removeEdge = useCallback((from: string, to: string) => {
        setEdges(prev => prev.filter(e => e.from !== from && e.to !== to));
    }, []);

    const addEdge = useCallback((from: string, to: string, weight: number, isDirected: boolean = true) => {
        if (from === to) return false;

        setEdges(prev => {
            const exists = prev.some(e => {
                if (isDirected) {
                    return e.from === from && e.to === to;
                } else {
                    return (e.from === from && e.to === to) || (e.from === to && e.to === from);
                }
            });

            if (exists) return prev;
            return [...prev, { from, to, weight }];
        });
        return true;
    }, []);

    const moveNode = useCallback((id: string, x: number, y: number) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
    }, []);

    const resetGraphState = useCallback(() => {
        setNodes(prev => prev.map(n => ({
            ...n,
            distance: Infinity,
            visited: false,
            current: false,
            extraLabel: undefined
        })));
    }, []);

    const updateNode = useCallback((id: string, updates: Partial<Node>) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    }, []);

    const generateRandomGraph = useCallback((width: number, height: number) => {
        const numNodes = Math.floor(Math.random() * 4) + 6;
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;

        for (let i = 0; i < numNodes; i++) {
            const angle = (i / numNodes) * Math.PI * 2;
            const jitter = 0.2;
            const x = centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * radius * jitter;
            const y = centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * radius * jitter;

            newNodes.push({
                id: Math.random().toString(36).substr(2, 9),
                x, y,
                label: String.fromCharCode(65 + i),
                distance: Infinity,
                visited: false,
                current: false,
                isStart: i === 0,
                isEnd: i === numNodes - 1
            });
        }

        const shuffled = [...newNodes].sort(() => Math.random() - 0.5);
        for (let i = 1; i < shuffled.length; i++) {
            const from = shuffled[i].id;
            const to = shuffled[i - 1].id;
            newEdges.push({
                from,
                to,
                weight: Math.floor(Math.random() * 9) + 1
            });
        }

        const edgeProbability = 0.25;
        for (let i = 0; i < newNodes.length; i++) {
            for (let j = i + 1; j < newNodes.length; j++) {
                const exists = newEdges.some(e =>
                    (e.from === newNodes[i].id && e.to === newNodes[j].id) ||
                    (e.from === newNodes[j].id && e.to === newNodes[i].id)
                );

                if (!exists && Math.random() < edgeProbability) {
                    newEdges.push({
                        from: newNodes[i].id,
                        to: newNodes[j].id,
                        weight: Math.floor(Math.random() * 9) + 1
                    });
                }
            }
        }

        setNodes(newNodes);
        setEdges(newEdges);
    }, []);

    const clear = useCallback(() => {
        setNodes([]);
        setEdges([]);
    }, []);

    return {
        nodes,
        edges,
        setNodes,
        addNode,
        removeNode,
        removeEdge,
        addEdge,
        moveNode,
        resetGraphState,
        updateNode,
        generateRandomGraph,
        clear
    };
};