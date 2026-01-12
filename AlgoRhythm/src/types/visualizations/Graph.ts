// types/visualizations/Graph.ts
export interface Node {
    id: string;
    x: number;
    y: number;
    label: string;
    distance: number;
    visited: boolean;
    current: boolean;
    isStart: boolean;
    isEnd: boolean;
    extraLabel?: string;
}

export interface Edge {
    from: string;
    to: string;
    weight: number;
}

// Ten typ definiuje, co algorytm może "powiedzieć" wizualizatorowi
export interface AlgorithmStep {
    nodeId?: string;
    action: 'visit' | 'current' | 'found' | 'update' | 'highlight-edge';
    distance?: number;
    message: string;
    highlightedEdges?: { from: string; to: string }[]; // Krawędzie do podświetlenia (np. MST)
    customNodeLabel?: string; // Np. przypisany kolor
}

// Kontrakt dla każdego algorytmu
export interface GraphAlgorithm {
    id: string; // unikalny klucz, np. 'dijkstra'
    name: string; // wyświetlana nazwa, np. "Dijkstra's Algorithm"
    description: string;
    run: (
        nodes: Node[],
        edges: Edge[],
        startId: string,
        endId: string,
        onStep: (step: AlgorithmStep) => Promise<void>
    ) => Promise<{ path: string[]; finalDistance: number }>;
}