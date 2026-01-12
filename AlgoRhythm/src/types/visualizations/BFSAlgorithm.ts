import type {GraphAlgorithm} from "@/types/visualizations/Graph.ts";


export const bfsAlgorithm: GraphAlgorithm = {
    id: 'bfs',
    name: "Breadth-First Search (BFS)",
    description: "Explores graph level by level, finds shortest path in unweighted graphs",
    run: async (nodes, edges, startId, endId, onStep) => {
        const queue: string[] = [startId];
        const visited = new Set<string>([startId]);
        const previous = new Map<string, string | null>();
        const distances = new Map<string, number>();

        nodes.forEach(n => {
            distances.set(n.id, n.id === startId ? 0 : Infinity);
            previous.set(n.id, null);
        });

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const currentLabel = nodes.find(n => n.id === currentId)?.label;
            const currentDist = distances.get(currentId)!;

            await onStep({
                nodeId: currentId,
                action: 'current',
                distance: currentDist,
                message: `🔍 Exploring node ${currentLabel} (level: ${currentDist})`
            });

            if (currentId === endId) {
                const path: string[] = [];
                let temp: string | null = endId;
                while (temp) {
                    path.unshift(temp);
                    temp = previous.get(temp) || null;
                }
                await onStep({
                    nodeId: currentId,
                    action: 'found',
                    distance: currentDist,
                    message: `✅ Found path! Steps: ${currentDist}`
                });
                return { path, finalDistance: currentDist };
            }

            const neighbors = edges.filter(e => e.from === currentId || e.to === currentId);

            for (const edge of neighbors) {
                const neighborId = edge.from === currentId ? edge.to : edge.from;

                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    queue.push(neighborId);
                    previous.set(neighborId, currentId);
                    distances.set(neighborId, currentDist + 1);

                    const neighborLabel = nodes.find(n => n.id === neighborId)?.label;
                    await onStep({
                        nodeId: neighborId,
                        action: 'update',
                        distance: currentDist + 1,
                        message: `   ➕ Added ${neighborLabel} to queue`
                    });
                }
            }

            await onStep({
                nodeId: currentId,
                action: 'visit',
                message: `✓ Visited ${currentLabel}`
            });
        }

        return { path: [], finalDistance: Infinity };
    }
};