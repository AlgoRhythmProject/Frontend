import type {GraphAlgorithm} from "@/types/visualizations/Graph.ts";

export const dfsAlgorithm: GraphAlgorithm = {
    id: 'dfs',
    name: "Depth-First Search (DFS)",
    description: "Explores graph deeply before backtracking, uses stack",
    run: async (nodes, edges, startId, endId, onStep) => {
        const stack: string[] = [startId];
        const visited = new Set<string>();
        const previous = new Map<string, string | null>();
        const depths = new Map<string, number>();

        nodes.forEach(n => {
            depths.set(n.id, n.id === startId ? 0 : Infinity);
            previous.set(n.id, null);
        });

        while (stack.length > 0) {
            const currentId = stack.pop()!;

            if (visited.has(currentId)) continue;

            visited.add(currentId);
            const currentLabel = nodes.find(n => n.id === currentId)?.label;
            const currentDepth = depths.get(currentId)!;

            await onStep({
                nodeId: currentId,
                action: 'current',
                distance: currentDepth,
                message: `🔍 Exploring node ${currentLabel} (depth: ${currentDepth})`
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
                    distance: currentDepth,
                    message: `✅ Found path! Depth: ${currentDepth}`
                });
                return { path, finalDistance: currentDepth };
            }

            const neighbors = edges.filter(e => e.from === currentId || e.to === currentId);

            for (const edge of neighbors) {
                const neighborId = edge.from === currentId ? edge.to : edge.from;

                if (!visited.has(neighborId)) {
                    stack.push(neighborId);
                    if (!previous.has(neighborId) || previous.get(neighborId) === null) {
                        previous.set(neighborId, currentId);
                        depths.set(neighborId, currentDepth + 1);
                    }

                    const neighborLabel = nodes.find(n => n.id === neighborId)?.label;
                    await onStep({
                        nodeId: neighborId,
                        action: 'update',
                        distance: currentDepth + 1,
                        message: `   ➕ Added ${neighborLabel} to stack`
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