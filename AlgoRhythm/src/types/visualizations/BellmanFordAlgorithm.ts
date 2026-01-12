import type {GraphAlgorithm} from "@/types/visualizations/Graph.ts";

export const bellmanFordAlgorithm: GraphAlgorithm = {
    id: 'bellman-ford',
    name: "Bellman-Ford Algorithm",
    description: "Finds shortest path, handles negative weights, detects negative cycles",
    run: async (nodes, edges, startId, endId, onStep) => {
        const distances = new Map<string, number>();
        const previous = new Map<string, string | null>();

        nodes.forEach(n => {
            distances.set(n.id, n.id === startId ? 0 : Infinity);
            previous.set(n.id, null);
        });

        // Relax edges V-1 times
        for (let i = 0; i < nodes.length - 1; i++) {
            await onStep({
                nodeId: startId,
                action: 'current',
                message: `🔄 Iteration ${i + 1}/${nodes.length - 1}`
            });

            let updated = false;

            for (const edge of edges) {
                const fromDist = distances.get(edge.from)!;
                const toDist = distances.get(edge.to)!;

                // Check both directions (undirected)
                if (fromDist + edge.weight < toDist) {
                    distances.set(edge.to, fromDist + edge.weight);
                    previous.set(edge.to, edge.from);
                    updated = true;

                    const toLabel = nodes.find(n => n.id === edge.to)?.label;
                    await onStep({
                        nodeId: edge.to,
                        action: 'update',
                        distance: fromDist + edge.weight,
                        message: `   ✨ Updated ${toLabel}: ${fromDist + edge.weight}`
                    });
                }

                if (toDist + edge.weight < fromDist) {
                    distances.set(edge.from, toDist + edge.weight);
                    previous.set(edge.from, edge.to);
                    updated = true;

                    const fromLabel = nodes.find(n => n.id === edge.from)?.label;
                    await onStep({
                        nodeId: edge.from,
                        action: 'update',
                        distance: toDist + edge.weight,
                        message: `   ✨ Updated ${fromLabel}: ${toDist + edge.weight}`
                    });
                }
            }

            if (!updated) {
                await onStep({
                    nodeId: startId,
                    action: 'visit',
                    message: `✓ No updates in iteration ${i + 1}, converged early`
                });
                break;
            }
        }

        // Check for negative cycles
        for (const edge of edges) {
            const fromDist = distances.get(edge.from)!;
            const toDist = distances.get(edge.to)!;

            if (fromDist + edge.weight < toDist || toDist + edge.weight < fromDist) {
                await onStep({
                    nodeId: edge.from,
                    action: 'current',
                    message: `⚠️ Negative cycle detected!`
                });
                return { path: [], finalDistance: -Infinity };
            }
        }

        const finalDist = distances.get(endId)!;
        if (finalDist === Infinity) {
            return { path: [], finalDistance: Infinity };
        }

        const path: string[] = [];
        let temp: string | null = endId;
        while (temp) {
            path.unshift(temp);
            temp = previous.get(temp) || null;
        }

        await onStep({
            nodeId: endId,
            action: 'found',
            distance: finalDist,
            message: `✅ Shortest path found! Distance: ${finalDist}`
        });

        return { path, finalDistance: finalDist };
    }
};