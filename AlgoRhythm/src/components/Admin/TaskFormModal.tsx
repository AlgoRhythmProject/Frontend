import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Lightbulb } from 'lucide-react';
import { taskApi } from '@/api/task/taskApi';
import { hintApi } from '@/api/hint/hintApi';
import type { HintInputDto } from '@/api/hint/types';
import { tagApi } from '@/api/tag/tagApi';
import type { TaskInputDto } from '@/api/task/types';
import { testCaseApi } from '@/api/testcase/testcaseApi';
import type { CreateTestCaseDto } from '@/api/testcase/types';
import type { Hint } from '@/types/Hint';
import type { Tag } from '@/types/Tag';
import type { Task } from '@/types/Task';
import { TagManager } from './TagManager';
import { TestCaseManager } from './TestCaseManager';
import type { TestCase } from '@/types/TestCase';
import { ExpandableTextarea } from './ExpandableTextArea';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    task?: Task | null;
}

export function TaskFormModal({ isOpen, onClose, onSuccess, task }: TaskFormModalProps) {
    const [formData, setFormData] = useState<TaskInputDto>({
        title: '',
        description: '',
        difficulty: 1,
        taskType: 0,
        isPublished: false,
        templateCode: '',
        optionsJson: '',
        correctAnswer: '',
        tagIds: [],
        hintIds: []
    });

    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [hints, setHints] = useState<Hint[]>([]);
    const [testCases, setTestCases] = useState<(TestCase | (Omit<TestCase, 'programmingTaskItemId'> & { id: string }))[]>([]);
    const [newHintContent, setNewHintContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showHintForm, setShowHintForm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadTags();
        }
    }, [isOpen]);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                difficulty: task.difficulty,
                taskType: task.taskType || 0,
                isPublished: task.isPublished,
                templateCode: task.templateCode || '',
                optionsJson: task.optionsJson || '',
                correctAnswer: task.correctAnswer || '',
                tagIds: task.tagIds || [],
                hintIds: task.hintIds || []
            });

            if (task.tagIds && task.tagIds.length > 0) {
                loadSelectedTags(task.tagIds);
            } else {
                setSelectedTags([]);
            }

            if (task.id) {
                loadTaskHints(task.id);
                if (task.taskType === 0) {
                    loadTestCases(task.id);
                }
            } else {
                setHints([]);
                setTestCases([]);
            }
        } else {
            setFormData({
                title: '',
                description: '',
                difficulty: 1,
                taskType: 0,
                isPublished: false,
                templateCode: '',
                optionsJson: '',
                correctAnswer: '',
                tagIds: [],
                hintIds: []
            });
            setSelectedTags([]);
            setHints([]);
            setTestCases([]);
        }
    }, [task]);

    const loadTags = async () => {
        try {
            const tags = await tagApi.getAll();
            setAllTags(tags);
        } catch (error) {
            console.error('Failed to load tags:', error);
        }
    };

    const loadSelectedTags = async (tagIds: string[]) => {
        try {
            const tags = await Promise.all(
                tagIds.map(id => tagApi.getById(id).catch(() => null))
            );
            setSelectedTags(tags.filter((t): t is Tag => t !== null));
        } catch (error) {
            console.error('Failed to load selected tags:', error);
        }
    };

    const loadTaskHints = async (taskId: string) => {
        try {
            const taskHints = await hintApi.getByTaskId(taskId);
            setHints(taskHints);
        } catch (error) {
            console.error('Failed to load task hints:', error);
        }
    };

    const loadTestCases = async (taskId: string) => {
        try {
            const cases = await testCaseApi.getByTaskId(taskId);
            setTestCases(cases);
        } catch (error) {
            console.error('Failed to load test cases:', error);
        }
    };

    const handleAddTag = async (tag: Tag) => {
        if (task?.id) {
            try {
                await taskApi.addTag(task.id, tag.id);
                const currentTagIds = formData.tagIds || [];
                setFormData({ ...formData, tagIds: [...currentTagIds, tag.id] });
                setSelectedTags([...selectedTags, tag]);
            } catch (error) {
                console.error('Failed to add tag:', error);
                alert('Failed to add tag');
            }
        } else {
            const currentTagIds = formData.tagIds || [];
            setFormData({ ...formData, tagIds: [...currentTagIds, tag.id] });
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleRemoveTag = async (tagId: string) => {
        if (task?.id) {
            try {
                await taskApi.removeTag(task.id, tagId);
                const currentTagIds = formData.tagIds || [];
                setFormData({ ...formData, tagIds: currentTagIds.filter(id => id !== tagId) });
                setSelectedTags(selectedTags.filter(t => t.id !== tagId));
            } catch (error) {
                console.error('Failed to remove tag:', error);
                alert('Failed to remove tag');
            }
        } else {
            const currentTagIds = formData.tagIds || [];
            setFormData({ ...formData, tagIds: currentTagIds.filter(id => id !== tagId) });
            setSelectedTags(selectedTags.filter(t => t.id !== tagId));
        }
    };

    const handleAddHint = async () => {
        if (!newHintContent.trim()) return;

        if (task?.id) {
            try {
                const hintDto: HintInputDto = {
                    taskItemId: task.id,
                    content: newHintContent,
                    order: hints.length
                };
                const createdHint = await hintApi.create(hintDto);
                await taskApi.addHint(task.id, createdHint.id);
                await loadTaskHints(task.id);
                setNewHintContent('');
                setShowHintForm(false);
            } catch (error: any) {
                console.error('Failed to add hint:', error);
                alert(`Failed to add hint: ${error.response?.data?.message || error.message}`);
            }
        } else {
            const newHint: Hint = {
                id: `temp-${Date.now()}`,
                taskId: '',
                content: newHintContent,
                order: hints.length,
            };
            setHints([...hints, newHint]);
            setNewHintContent('');
            setShowHintForm(false);
        }
    };

    const handleRemoveHint = async (hintId: string) => {
        if (task?.id && !hintId.startsWith('temp-')) {
            try {
                await taskApi.removeHint(task.id, hintId);
                await loadTaskHints(task.id);
            } catch (error) {
                console.error('Failed to remove hint:', error);
                alert('Failed to remove hint');
            }
        } else {
            setHints(hints.filter(h => h.id !== hintId));
        }
    };
    const handleTagCreated = (newTag: Tag) => {
        setAllTags(prev => [...prev, newTag]);
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (task) {
                await taskApi.update(task.id, formData);

                if (formData.taskType === 0) {
                    const existingTestCases = await testCaseApi.getByTaskId(task.id);
                    const existingIds = new Set(existingTestCases.map(tc => tc.id));

                    for (const existing of existingTestCases) {
                        if (!testCases.find(tc => tc.id === existing.id)) {
                            await testCaseApi.delete(existing.id);
                        }
                    }

                    for (const testCase of testCases) {
                        if (testCase.id.startsWith('temp-')) {
                            const dto: CreateTestCaseDto = {
                                programmingTaskItemId: task.id,
                                inputJson: testCase.inputJson || null,
                                expectedJson: testCase.expectedJson || null,
                                isVisible: testCase.isVisible,
                                maxPoints: testCase.maxPoints,
                                timeoutMs: testCase.timeoutMs,
                            };
                            await testCaseApi.create(dto);
                        } else if (existingIds.has(testCase.id)) {
                            await testCaseApi.update(testCase.id, {
                                inputJson: testCase.inputJson || null,
                                expectedJson: testCase.expectedJson || null,
                                isVisible: testCase.isVisible,
                                maxPoints: testCase.maxPoints,
                                timeoutMs: testCase.timeoutMs,
                            });
                        }
                    }
                }
            } else {
                const createdTask = await taskApi.create(formData);

                if (hints.length > 0) {
                    for (const hint of hints) {
                        const hintDto: HintInputDto = {
                            taskItemId: createdTask.id,
                            content: hint.content,
                            order: hint.order
                        };
                        const createdHint = await hintApi.create(hintDto);
                        await taskApi.addHint(createdTask.id, createdHint.id);
                    }
                }

                if (formData.taskType === 0 && testCases.length > 0) {
                    for (const testCase of testCases) {
                        const dto: CreateTestCaseDto = {
                            programmingTaskItemId: createdTask.id,
                            inputJson: testCase.inputJson || null,
                            expectedJson: testCase.expectedJson || null,
                            isVisible: testCase.isVisible,
                            maxPoints: testCase.maxPoints,
                            timeoutMs: testCase.timeoutMs,
                        };
                        await testCaseApi.create(dto);
                    }
                }
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const selectedTagIds = selectedTags.map(t => t.id);
    const availableTags = allTags.filter(tag => !selectedTagIds.includes(tag.id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-muted flex items-center justify-between sticky top-0 bg-card z-10">
                    <h2 className="font-sans font-medium text-foreground text-xl">
                        {task ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-error/10 border border-error rounded-lg p-4">
                            <p className="text-error font-sans">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block font-sans font-medium text-foreground mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <ExpandableTextarea
                            value={formData.description || ''}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            label="Description"
                            placeholder="<p>Enter HTML content here...</p>"
                            rows={8}
                            helperText="You can use HTML tags like <h1>, <p>, <strong>, <em>, <ul>, <ol>, etc."
                        />

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-sans font-medium text-foreground mb-2">
                                Task Type *
                            </label>
                            <select
                                value={formData.taskType}
                                onChange={(e) => setFormData({ ...formData, taskType: Number(e.target.value) === 0 ? 0 : 1 })}
                                className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value={0}>Programming</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-sans font-medium text-foreground mb-2">
                                Difficulty *
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) as 0 | 1 | 2 })}
                                className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value={0}>Easy</option>
                                <option value={1}>Medium</option>
                                <option value={2}>Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <TagManager
                        selectedTags={selectedTags}
                        availableTags={availableTags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                        onTagCreated={handleTagCreated}
                        disabled={loading}
                    />

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block font-sans font-medium text-foreground">
                                Hints
                            </label>
                            <button
                                onClick={() => setShowHintForm(!showHintForm)}
                                className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-warning/20 hover:bg-warning/30 text-warning rounded-lg transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Hint
                            </button>
                        </div>

                        {showHintForm && (
                            <div className="mb-3 p-4 bg-background border border-muted rounded-lg">
                                <label className="block font-sans text-sm font-medium text-foreground mb-2">
                                    Hint Content
                                </label>
                                <textarea
                                    value={newHintContent}
                                    onChange={(e) => setNewHintContent(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-card border border-muted rounded-lg font-sans text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-warning resize-none mb-3"
                                    placeholder="Enter hint text..."
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowHintForm(false);
                                            setNewHintContent('');
                                        }}
                                        className="cursor-pointer flex-1 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddHint}
                                        disabled={!newHintContent.trim()}
                                        className="cursor-pointer  flex-1 px-3 py-1.5 bg-warning/20 hover:bg-warning/30 text-warning rounded-lg font-sans text-sm transition-colors disabled:opacity-50"
                                    >
                                        Add Hint
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {hints.length === 0 ? (
                                <p className="text-sm text-muted-foreground font-sans">No hints added yet</p>
                            ) : (
                                hints.map((hint, index) => (
                                    <div
                                        key={hint.id}
                                        className="flex items-start gap-3 bg-warning/10 border border-warning/30 p-3 rounded-lg"
                                    >
                                        <Lightbulb className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground font-sans mb-1">Hint {index + 1}</p>
                                            <p className="font-sans text-sm text-foreground">{hint.content}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveHint(hint.id)}
                                            className="p-1 hover:bg-warning/20 rounded transition-colors shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4 text-error" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {formData.taskType === 0 && (
                        <>
                            <div>
                                <ExpandableTextarea
                                    value={formData.templateCode ?? ""}
                                    onChange={(value) => setFormData({ ...formData, templateCode: value })}
                                    label="Template Code"
                                    placeholder="public class Solution { }"
                                    rows={8}
                                    isCode={true}
                                />
                            </div>

                            <TestCaseManager
                                testCases={testCases}
                                onChange={setTestCases}
                                disabled={loading}
                            />
                        </>
                    )}

                    {formData.taskType === 1 && (
                        <>
                            <div>
                                <label className="block font-sans font-medium text-foreground mb-2">
                                    Options (JSON)
                                </label>
                                <textarea
                                    value={formData.optionsJson}
                                    onChange={(e) => setFormData({ ...formData, optionsJson: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    placeholder='["Option A", "Option B", "Option C"]'
                                />
                            </div>

                            <div>
                                <label className="block font-sans font-medium text-foreground mb-2">
                                    Correct Answer
                                </label>
                                <input
                                    type="text"
                                    value={formData.correctAnswer}
                                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-muted rounded-lg font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter correct answer"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublished"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="w-4 h-4 rounded border-muted text-primary focus:ring-2 focus:ring-primary"
                        />
                        <label htmlFor="isPublished" className="font-sans text-foreground cursor-pointer">
                            Publish task immediately
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="cursor-pointer flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-sans font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="cursor-pointer flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-lg font-sans font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}