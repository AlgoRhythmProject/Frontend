import type {GraphAlgorithm, Edge, Node} from "@/types/visualizations/Graph.ts";

export const primsAlgorithm: GraphAlgorithm = {
    id: 'prim',
    name: "Prim's MST",
    description: "Constructs a Minimum Spanning Tree by always choosing the cheapest edge from the tree to an unvisited node.",
    run: async (nodes: Node[], edges: Edge[], startId: string, _endId: string, onStep) => {
        const mstEdges: { from: string, to: string }[] = [];
        const visitedIds = new Set<string>();

        // Startujemy od wybranego węzła
        visitedIds.add(startId);

        await onStep({
            nodeId: startId,
            action: 'visit',
            message: 'Starting Prim\'s algorithm',
            distance: 0
        });

        // MST ma N-1 krawędzi (gdzie N to liczba węzłów)
        while (visitedIds.size < nodes.length) {
            let minEdge: Edge | null = null;
            let minWeight = Infinity;

            // Znajdź najtańszą krawędź wychodzącą z odwiedzonych do nieodwiedzonych
            for (const edge of edges) {
                const isFromVisited = visitedIds.has(edge.from);
                const isToVisited = visitedIds.has(edge.to);

                // Krawędź musi łączyć odwiedzony z nieodwiedzonym (XOR)
                if (isFromVisited !== isToVisited) {
                    // Wizualizacja: Algorytm "patrzy" na tę krawędź
                    await onStep({
                        action: 'current', // używamy 'current' by nie zmieniać kolorów węzłów na stałe
                        message: `Checking edge weight ${edge.weight}`,
                        highlightedEdges: [...mstEdges, { from: edge.from, to: edge.to }]
                    });

                    if (edge.weight < minWeight) {
                        minWeight = edge.weight;
                        minEdge = edge;
                    }
                }
            }

            if (minEdge) {
                const nextNodeId = visitedIds.has(minEdge.from) ? minEdge.to : minEdge.from;
                visitedIds.add(nextNodeId);
                mstEdges.push({ from: minEdge.from, to: minEdge.to });

                await onStep({
                    nodeId: nextNodeId,
                    action: 'visit',
                    message: `Added edge to ${nextNodeId} (cost: ${minWeight})`,
                    highlightedEdges: [...mstEdges] // Utrwalamy krawędź w wizualizacji
                });
            } else {
                // Graf niespójny
                break;
            }
        }

        return { path: [], finalDistance: 0 }; // MST nie zwraca ścieżki
    }
};