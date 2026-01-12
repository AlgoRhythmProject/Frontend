import type {GraphAlgorithm} from "@/types/visualizations/Graph.ts";

export const dijkstraAlgorithm: GraphAlgorithm = {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    description: "Finds shortest path using greedy approach with priority queue",
    run: async (nodes, edges, startId, endId, onStep) => {
        const distances = new Map<string, number>();
        const previous = new Map<string, string | null>();
        const unvisited = new Set<string>();

        nodes.forEach(n => {
            distances.set(n.id, n.id === startId ? 0 : Infinity);
            previous.set(n.id, null);
            unvisited.add(n.id);
        });

        while (unvisited.size > 0) {
            let currentId: string | null = null;
            let minDist = Infinity;

            unvisited.forEach(nodeId => {
                const d = distances.get(nodeId)!;
                if (d < minDist) {
                    minDist = d;
                    currentId = nodeId;
                }
            });

            if (currentId === null || minDist === Infinity) break;

            const currentLabel = nodes.find(n => n.id === currentId)?.label;
            await onStep({
                nodeId: currentId,
                action: 'current',
                distance: minDist,
                message: `🔍 Checking node ${currentLabel} (dist: ${minDist})`
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
                    distance: minDist,
                    message: `✅ Found shortest path! Distance: ${minDist}`
                });
                return { path, finalDistance: minDist };
            }

            unvisited.delete(currentId);

            const neighbors = edges.filter(e => e.from === currentId || e.to === currentId);

            for (const edge of neighbors) {
                const neighborId = edge.from === currentId ? edge.to : edge.from;
                if (!unvisited.has(neighborId)) continue;

                const alt = distances.get(currentId!)! + edge.weight;

                if (alt < distances.get(neighborId)!) {
                    distances.set(neighborId, alt);
                    previous.set(neighborId, currentId!);

                    const neighborLabel = nodes.find(n => n.id === neighborId)?.label;
                    await onStep({
                        nodeId: neighborId,
                        action: 'update',
                        distance: alt,
                        message: `   ✨ Improved distance to ${neighborLabel}: ${alt}`
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