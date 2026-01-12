import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Plus, Search, Info } from 'lucide-react';

// --- TYPY ---
interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    x: number;
    y: number;
    visited?: boolean;
    current?: boolean;
    found?: boolean;
}

// --- LOGIKA BST ---
const calculatePositions = (
    node: TreeNode | null,
    x: number,
    y: number,
    level: number,
    offset: number
): TreeNode | null => {
    if (!node) return null;

    node.x = x;
    node.y = y;

    if (node.left) calculatePositions(node.left, x - offset, y + 80, level + 1, offset / 1.8);
    if (node.right) calculatePositions(node.right, x + offset, y + 80, level + 1, offset / 1.8);

    return node;
};

const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) {
        return { id: Math.random().toString(36), value, left: null, right: null, x: 0, y: 0 };
    }
    if (value < node.value) node.left = insertNode(node.left, value);
    else if (value > node.value) node.right = insertNode(node.right, value);
    return node;
};

const BSTVisualizer = () => {
    const [root, setRoot] = useState<TreeNode | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [log, setLog] = useState('Add nodes to start visualizing');
    const [showInfo, setShowInfo] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // --- RYSOWANIE ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Gradient tło
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!root) {
            // Empty state
            ctx.fillStyle = '#475569';
            ctx.font = '18px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Add numbers to build your BST', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Przeliczamy pozycje (środek ekranu jako start)
        calculatePositions(root, canvas.width / 2, 80, 1, canvas.width / 4);

        const renderTree = (n: TreeNode) => {
            // 1. Rysowanie krawędzi z gradientem
            if (n.left) {
                const grd = ctx.createLinearGradient(n.x, n.y, n.left.x, n.left.y);
                grd.addColorStop(0, '#6366f1');
                grd.addColorStop(1, '#8b5cf6');
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(n.left.x, n.left.y);
                ctx.stroke();
                renderTree(n.left);
            }
            if (n.right) {
                const grd = ctx.createLinearGradient(n.x, n.y, n.right.x, n.right.y);
                grd.addColorStop(0, '#6366f1');
                grd.addColorStop(1, '#8b5cf6');
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(n.right.x, n.right.y);
                ctx.stroke();
                renderTree(n.right);
            }

            // 2. Zewnętrzny blask
            if (n.current || n.found) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, 35, 0, Math.PI * 2);
                ctx.shadowBlur = 30;
                ctx.shadowColor = n.found ? '#10b981' : '#f59e0b';
                ctx.fillStyle = n.found ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // 3. Rysowanie węzła z gradientem
            const nodeGradient = ctx.createRadialGradient(n.x - 8, n.y - 8, 5, n.x, n.y, 28);

            if (n.found) {
                nodeGradient.addColorStop(0, '#34d399');
                nodeGradient.addColorStop(1, '#10b981');
            } else if (n.current) {
                nodeGradient.addColorStop(0, '#fbbf24');
                nodeGradient.addColorStop(1, '#f59e0b');
            } else if (n.visited) {
                nodeGradient.addColorStop(0, '#818cf8');
                nodeGradient.addColorStop(1, '#6366f1');
            } else {
                nodeGradient.addColorStop(0, '#8b5cf6');
                nodeGradient.addColorStop(1, '#6366f1');
            }

            ctx.beginPath();
            ctx.arc(n.x, n.y, 28, 0, Math.PI * 2);
            ctx.fillStyle = nodeGradient;
            ctx.fill();

            // 4. Obwódka z białym świeceniem
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 5. Tekst z cieniem
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n.value.toString(), n.x, n.y);
            ctx.shadowBlur = 0;
        };

        renderTree(root);
    }, [root]);

    useEffect(() => {
        draw();
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                draw();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    // --- AKCJE ---
    const handleAdd = () => {
        const val = parseInt(inputValue);
        if (!isNaN(val)) {
            const newTree = insertNode(root ? { ...root } : null, val);
            setRoot({ ...newTree });
            setInputValue('');
            setLog(`✓ Added node: ${val}`);
        }
    };

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const search = async (node: TreeNode | null, target: number): Promise<boolean> => {
        if (!node) {
            setLog(`✗ Value ${target} not found in tree`);
            return false;
        }

        node.current = true;
        setLog(`→ Checking node: ${node.value}`);
        setRoot({ ...root! });
        await sleep(700);

        if (node.value === target) {
            node.current = false;
            node.found = true;
            setLog(`✓ Found ${target}! 🎉`);
            setRoot({ ...root! });
            return true;
        }

        node.current = false;
        node.visited = true;

        if (target < node.value) {
            setLog(`← ${target} < ${node.value} (going left)`);
            setRoot({ ...root! });
            await sleep(500);
            return await search(node.left, target);
        } else {
            setLog(`→ ${target} > ${node.value} (going right)`);
            setRoot({ ...root! });
            await sleep(500);
            return await search(node.right, target);
        }
    };

    const startSearch = async () => {
        const val = parseInt(searchValue);
        if (isNaN(val) || !root || isSearching) return;

        setIsSearching(true);
        const reset = (n: TreeNode | null) => {
            if(n) { n.visited=false; n.found=false; n.current=false; reset(n.left); reset(n.right); }
        };
        reset(root);

        await search(root, val);
        setIsSearching(false);
    };

    const handleReset = () => {
        setRoot(null);
        setLog('Add nodes to start visualizing');
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            draw();
        }
    }, [draw]);

    return (
        <div className="flex flex-col w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary to-purple-600 p-6 shadow-2xl">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Binary Search Tree Visualizer</h1>
                            <p className="text-white/80 text-sm">Interactive data structure exploration</p>
                        </div>
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Info className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {showInfo && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 text-white text-sm">
                            <p className="mb-2">🔵 <strong>Default Node</strong> - Not yet visited</p>
                            <p className="mb-2">🟣 <strong>Visited Node</strong> - Already checked</p>
                            <p className="mb-2">🟡 <strong>Current Node</strong> - Currently examining</p>
                            <p>🟢 <strong>Found Node</strong> - Target value located!</p>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex flex-wrap gap-3">
                        <div className="flex gap-2 flex-1 min-w-[200px]">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Enter value"
                                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 outline-none"
                                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>

                        <div className="flex gap-2 flex-1 min-w-[200px]">
                            <input
                                type="number"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                placeholder="Search value"
                                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-400 outline-none"
                                onKeyDown={e => e.key === 'Enter' && startSearch()}
                                disabled={isSearching}
                            />
                            <button
                                onClick={startSearch}
                                disabled={isSearching || !root}
                                className="bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-sm disabled:bg-slate-700/50 text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:cursor-not-allowed"
                            >
                                {isSearching ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        Search
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={handleReset}
                            className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Visualization Area */}
            <div className="relative flex-1 overflow-hidden">
                {/* Status Log */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium">
                        {log}
                    </div>
                </div>

                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ cursor: 'default' }}
                />

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600"></div>
                            <span className="text-white font-medium">Default</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600"></div>
                            <span className="text-white font-medium">Visited</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
                            <span className="text-white font-medium">Current</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                            <span className="text-white font-medium">Found</span>
                        </div>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl max-w-xs">
                    <h3 className="text-white font-bold mb-2 text-sm">Quick Tips</h3>
                    <ul className="text-slate-300 text-xs space-y-1">
                        <li>• Add numbers to build your tree</li>
                        <li>• Smaller values go left</li>
                        <li>• Larger values go right</li>
                        <li>• Search to see the algorithm in action</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BSTVisualizer;
export { BSTVisualizer };