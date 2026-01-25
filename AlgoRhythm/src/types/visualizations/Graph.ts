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