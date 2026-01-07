import { useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, Save, X } from 'lucide-react';
import type { TestCase } from '@/api/testcaseApi';

interface TestCaseInputData {
    inputJson: string | null;
    expectedJson: string | null;
    isVisible: boolean;
    maxPoints: number;
}

interface TestCaseManagerProps {
    testCases: (TestCase | (TestCaseInputData & { id: string }))[];
    onChange: (testCases: (TestCase | (TestCaseInputData & { id: string }))[]) => void;
    disabled?: boolean;
}

export function TestCaseManager({ testCases, onChange, disabled = false }: TestCaseManagerProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<TestCaseInputData>({
        inputJson: '',
        expectedJson: '',
        isVisible: true,
        maxPoints: 10,
    });

    const handleAdd = () => {
        const newTestCase: TestCaseInputData & { id: string } = {
            id: `temp-${Date.now()}`,
            inputJson: formData.inputJson?.trim() || null,
            expectedJson: formData.expectedJson?.trim() || null,
            isVisible: formData.isVisible,
            maxPoints: formData.maxPoints,
        };
        onChange([...testCases, newTestCase]);
        resetForm();
    };

    const handleUpdate = (id: string) => {
        const updated = testCases.map(tc =>
            tc.id === id
                ? {
                    ...tc,
                    inputJson: formData.inputJson?.trim() || null,
                    expectedJson: formData.expectedJson?.trim() || null,
                    isVisible: formData.isVisible,
                    maxPoints: formData.maxPoints,
                }
                : tc
        );
        onChange(updated);
        setEditingId(null);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this test case?')) return;
        onChange(testCases.filter(tc => tc.id !== id));
    };

    const startEdit = (testCase: TestCase | (TestCaseInputData & { id: string })) => {
        setEditingId(testCase.id);
        setFormData({
            inputJson: testCase.inputJson || '',
            expectedJson: testCase.expectedJson || '',
            isVisible: testCase.isVisible,
            maxPoints: testCase.maxPoints,
        });
        setShowAddForm(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            inputJson: '',
            expectedJson: '',
            isVisible: true,
            maxPoints: 10,
        });
        setShowAddForm(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <label className="block font-sans font-medium text-foreground mb-1">
                        Test Cases
                    </label>
                    <p className="text-sm text-muted-foreground">
                        Define input and expected output for automated testing
                    </p>
                </div>
                {!disabled && (
                    <button
                        type="button"
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-info/20 hover:bg-info/30 text-info rounded-lg transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Test Case
                    </button>
                )}
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="p-4 bg-background border border-muted rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-sans font-medium text-foreground mb-1">
                                Input (JSON)
                            </label>
                            <textarea
                                value={formData.inputJson || ''}
                                onChange={(e) => setFormData({ ...formData, inputJson: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 bg-card border border-muted rounded-lg font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-info resize-none"
                                placeholder='{"s": "racecar"}'
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-foreground mb-1">
                                Expected Output (JSON)
                            </label>
                            <textarea
                                value={formData.expectedJson || ''}
                                onChange={(e) => setFormData({ ...formData, expectedJson: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 bg-card border border-muted rounded-lg font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-info resize-none"
                                placeholder='{"result": true}'
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-sans font-medium text-foreground mb-1">
                                Max Points
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.maxPoints}
                                onChange={(e) => setFormData({ ...formData, maxPoints: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-card border border-muted rounded-lg font-sans text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-info"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isVisible}
                                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                    className="w-4 h-4 rounded border-muted text-info focus:ring-2 focus:ring-info"
                                />
                                <span className="text-sm font-sans text-foreground">Visible to students</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="flex-1 px-3 py-1.5 bg-info/20 hover:bg-info/30 text-info rounded-lg font-sans text-sm transition-colors"
                        >
                            Add Test Case
                        </button>
                    </div>
                </div>
            )}

            {/* Test Cases List */}
            {testCases.length === 0 ? (
                <div className="text-center py-8 bg-background/50 border border-muted rounded-lg">
                    <p className="text-sm text-muted-foreground font-sans">
                        No test cases yet. Add some to enable automated testing.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {testCases.map((testCase, index) => (
                        <div
                            key={testCase.id}
                            className="p-4 bg-background border border-muted rounded-lg"
                        >
                            {editingId === testCase.id ? (
                                // Edit Mode
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-sans font-medium text-foreground">
                                            Editing Test Case #{index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="p-1 hover:bg-muted rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">
                                                Input (JSON)
                                            </label>
                                            <textarea
                                                value={formData.inputJson || ''}
                                                onChange={(e) => setFormData({ ...formData, inputJson: e.target.value })}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-card border border-muted rounded-lg font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-info resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">
                                                Expected Output (JSON)
                                            </label>
                                            <textarea
                                                value={formData.expectedJson || ''}
                                                onChange={(e) => setFormData({ ...formData, expectedJson: e.target.value })}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-card border border-muted rounded-lg font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-info resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">
                                                Max Points
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.maxPoints}
                                                onChange={(e) => setFormData({ ...formData, maxPoints: Number(e.target.value) })}
                                                className="w-full px-3 py-2 bg-card border border-muted rounded-lg font-sans text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-info"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isVisible}
                                                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                                    className="w-4 h-4 rounded border-muted text-info focus:ring-2 focus:ring-info"
                                                />
                                                <span className="text-sm font-sans text-foreground">Visible</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="flex-1 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdate(testCase.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-info/20 hover:bg-info/30 text-info rounded-lg font-sans text-sm transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-sans font-medium text-foreground">
                                                Test Case #{index + 1}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-sans font-medium ${testCase.isVisible
                                                ? 'bg-success/20 text-success'
                                                : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {testCase.isVisible ? (
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        Visible
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <EyeOff className="w-3 h-3" />
                                                        Hidden
                                                    </span>
                                                )}
                                            </span>
                                            <span className="px-2 py-0.5 bg-info/20 text-info rounded-full text-xs font-sans font-medium">
                                                {testCase.maxPoints} pts
                                            </span>
                                        </div>
                                        {!disabled && (
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(testCase)}
                                                    className="p-1.5 hover:bg-muted rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4 text-info" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(testCase.id)}
                                                    className="p-1.5 hover:bg-muted rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-error" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-sans font-medium text-muted-foreground mb-1">Input:</p>
                                            <pre className="px-3 py-2 bg-card border border-muted rounded-lg font-mono text-xs text-foreground overflow-x-auto">
                                                {testCase.inputJson || '(empty)'}
                                            </pre>
                                        </div>
                                        <div>
                                            <p className="text-xs font-sans font-medium text-muted-foreground mb-1">Expected:</p>
                                            <pre className="px-3 py-2 bg-card border border-muted rounded-lg font-mono text-xs text-foreground overflow-x-auto">
                                                {testCase.expectedJson || '(empty)'}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}