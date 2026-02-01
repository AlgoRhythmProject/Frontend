import { useState, useEffect } from 'react';
import type { Edge, Node } from "@/types/visualizations/Graph";
import { useSignalR } from "@/hooks/useSignalR.ts";
import { config } from "@/config/global.ts";

export interface VisualState {
    nodeColors: Record<string, string>;
    edgeColors: Record<string, string>;
    edgeLabels: Record<string, string>;
    logs: string[];
}

export const useAlgorithmRunner = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [visualState, setVisualState] = useState<VisualState>({
        nodeColors: {},
        edgeColors: {},
        edgeLabels: {},
        logs: []
    });

    const { connection: visualizerConn } = useSignalR(config.visualizerUrl);
    const sessionId = visualizerConn?.connectionId;


    useEffect(() => {
        if (!visualizerConn) return;

        visualizerConn.on("UpdateNodeColor", (nodeId: string, color: string) => {
            setVisualState(prev => ({
                ...prev,
                nodeColors: { ...prev.nodeColors, [nodeId]: color }
            }));
        });

        visualizerConn.on("UpdateEdgeColor", (from: string, to: string, color: string) => {
            setVisualState(prev => ({
                ...prev,
                edgeColors: { ...prev.edgeColors, [`${from}-${to}`]: color }
            }));
        });

        visualizerConn.on("UpdateEdgeLabel", (from: string, to: string, label: string) => {
            setVisualState(prev => ({
                ...prev,
                edgeLabels: { ...prev.edgeLabels, [`${from}-${to}`]: label }
            }));
        });

        visualizerConn.on("AddLog", (message: string) => {
            setVisualState(prev => ({
                ...prev,
                logs: [message, ...prev.logs].slice(0, 8)
            }));
        });

        visualizerConn.on("ExecutionFinished", () => {
            setIsRunning(false);
            setIsPaused(false);
        });

        visualizerConn.on("ExecutionError", (error: string) => {
            setVisualState(prev => ({
                ...prev,
                logs: [...prev.logs, `Error: ${error}`]
            }));
            setIsRunning(false);
        });

        return () => {
            visualizerConn.off("UpdateNodeColor");
            visualizerConn.off("UpdateEdgeColor");
            visualizerConn.off("UpdateEdgeLabel");
            visualizerConn.off("AddLog");
            visualizerConn.off("ExecutionFinished");
            visualizerConn.off("ExecutionError");
        };
    }, [visualizerConn]);


    const run = async (code: string, nodes: Node[], edges: Edge[], startId: string | null, endId: string | null) => {
        if (!visualizerConn || isRunning) return;

        setVisualState({ nodeColors: {}, edgeColors: {}, edgeLabels: {}, logs: ['> Sending code to server...'] });
        setIsRunning(true);
        setIsPaused(false);

        console.log(code);

        try {
            await visualizerConn.invoke("StartAlgorithm",
                sessionId,
                code,
                nodes.map(n => ({ id: n.id, label: n.label })),
                edges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
                nodes.find(n => n.id === startId),
                nodes.find(n => n.id === endId),
            );
        } catch (err) {
            console.error("Failed to start algorithm:", err);
            setIsRunning(false);
        }
    };

    const togglePause = async () => {
        if (!visualizerConn || !isRunning) return;

        const newPauseState = !isPaused;
        setIsPaused(newPauseState);

        try {
            await visualizerConn.invoke(newPauseState ? "PauseAlgorithm" : "ResumeAlgorithm", sessionId);
            setIsPaused(newPauseState);
        } catch (err) {
            console.error("Failed to toggle pause:", err);
        }
    };

    const stop = async () => {
        if (!visualizerConn || !isRunning) return;

        try {
            await visualizerConn.invoke("StopAlgorithm", sessionId);
            setIsRunning(false);
            setIsPaused(false);
        } catch (err) {
            console.error("Failed to stop algorithm:", err);
        }
    };

    const reset = () => {
        setVisualState({ nodeColors: {}, edgeColors: {}, edgeLabels: {}, logs: [] });
    }

    return {
        visualState,
        isRunning,
        isPaused,
        run,
        togglePause,
        stop,
        reset
    };
};