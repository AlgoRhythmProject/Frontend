import type {GraphAlgorithm} from "./Graph";

export const coloringAlgorithm: GraphAlgorithm = {
    id: 'coloring',
    name: 'Greedy Coloring',
    description: 'Assigns the smallest available color index to each node so no neighbors share the same color.',
    run: async (nodes, edges, startId, _endId, onStep) => {
        // Sortujemy węzły, żeby algorytm był deterministyczny (np. po ID lub etykiecie)
        // Możemy też zacząć od startId, a potem resztę
        const sortedNodes = [
            nodes.find(n => n.id === startId)!,
            ...nodes.filter(n => n.id !== startId)
        ].filter(Boolean);

        const nodeColors: Record<string, number> = {};

        for (const node of sortedNodes) {

            await onStep({
                nodeId: node.id,
                action: 'current',
                message: `Selecting color for ${node.label}...`
            });

            // Znajdź sąsiadów
            const neighbors = edges
                .filter(e => e.from === node.id || e.to === node.id)
                .map(e => e.from === node.id ? e.to : e.from);

            // Sprawdź kolory sąsiadów
            const usedColors = new Set<number>();
            for (const neighborId of neighbors) {
                if (nodeColors[neighborId] !== undefined) {
                    usedColors.add(nodeColors[neighborId]);
                }
            }

            // Znajdź pierwszy wolny kolor (start od 1)
            let color = 1;
            while (usedColors.has(color)) {
                color++;
            }

            nodeColors[node.id] = color;

            await onStep({
                nodeId: node.id,
                action: 'visit', // Oznaczamy jako "odwiedzony/pokolorowany"
                message: `Assigned Color ${color} to ${node.label}`,
                customNodeLabel: `Color: ${color}` // <--- Wykorzystujemy nowe pole
            });
        }

        return { path: [], finalDistance: 0 };
    }
};