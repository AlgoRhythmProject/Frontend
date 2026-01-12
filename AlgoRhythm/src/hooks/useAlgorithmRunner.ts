import { useState, useRef, useCallback, useEffect } from 'react';
import type {Node, Edge, GraphAlgorithm, AlgorithmStep} from "@/types/visualizations/Graph";

export const useAlgorithmRunner = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [log, setLog] = useState('Ready to start');
    const [markedEdges, setMarkedEdges] = useState<{ from: string, to: string }[]>([]);
    const [path, setPath] = useState<string[]>([]);

    // Refs for instant access in async loop
    const isPausedRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    // Pauza Loop
    const waitIfPaused = useCallback(async () => {
        while (isPausedRef.current) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }, []);

    const sleep = useCallback(async (ms: number) => {
        await waitIfPaused();
        return new Promise(resolve => setTimeout(resolve, ms));
    }, [waitIfPaused]);

    const run = async (
        algorithm: GraphAlgorithm,
        nodes: Node[],
        edges: Edge[],
        startNode: string,
        endNode: string,
        updateNodesFn: (step: AlgorithmStep) => void
    ) => {
        if (isRunning) return;

        setIsRunning(true);
        setIsPaused(false);
        setPath([]);
        setMarkedEdges([]);
        setLog(`Running ${algorithm.name}...`);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const onStep = async (step: AlgorithmStep) => {
            if (controller.signal.aborted) throw new DOMException("Aborted", "AbortError");
            await waitIfPaused();

            setLog(step.message);
            if (step.highlightedEdges) setMarkedEdges(step.highlightedEdges);

            // Delegate node updates back to the data layer via callback
            updateNodesFn(step);

            const delay = step.action === 'update' ? 500 : 800;
            await sleep(delay);
        };

        try {
            const result = await algorithm.run(nodes, edges, startNode, endNode, onStep, controller.signal);

            if (result.path.length > 0) setPath(result.path);
            else if (result.finalDistance === -Infinity) setLog('⚠️ Negative cycle detected!');
            else setLog('Algorithm finished (check visualization).');

        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error(error);
                setLog('❌ Error running algorithm');
            } else {
                setLog('⏹️ Algorithm stopped.');
            }
        } finally {
            setIsRunning(false);
            abortControllerRef.current = null;
        }
    };

    const togglePause = () => setIsPaused(!isPaused);

    const stop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsPaused(false);
        }
    };

    return {
        isRunning,
        isPaused,
        log,
        setLog,
        markedEdges,
        path,
        run,
        togglePause,
        stop
    };
};