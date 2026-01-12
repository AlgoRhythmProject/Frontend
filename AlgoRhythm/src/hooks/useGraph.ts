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

    const addEdge = useCallback((from: string, to: string, weight: number) => {
        if (from === to) return false; // Brak pętli własnych

        setEdges(prev => {
            const exists = prev.some(e =>
                (e.from === from && e.to === to) || (e.from === to && e.to === from)
            );
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
        const numNodes = 6;
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        // 1. Generuj węzły w bezpiecznych odległościach
        for (let i = 0; i < numNodes; i++) {
            newNodes.push({
                id: Math.random().toString(36).substr(2, 9),
                x: 100 + Math.random() * (width - 200),
                y: 100 + Math.random() * (height - 200),
                label: String.fromCharCode(65 + i),
                distance: Infinity,
                visited: false,
                current: false,
                isStart: i === 0,
                isEnd: i === numNodes - 1
            });
        }

        // 2. Generuj losowe krawędzie (upewniając się, że graf jest spójny)
        newNodes.forEach((node, idx) => {
            if (idx > 0) {
                // Połącz z przynajmniej jednym poprzednim węzłem
                const prevIdx = Math.floor(Math.random() * idx);
                newEdges.push({
                    from: node.id,
                    to: newNodes[prevIdx].id,
                    weight: Math.floor(Math.random() * 9) + 1
                });
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, []);

    return {
        nodes,
        edges,
        setNodes,
        addNode,
        removeNode,
        addEdge,
        moveNode,
        resetGraphState,
        updateNode,
        generateRandomGraph
    };
};