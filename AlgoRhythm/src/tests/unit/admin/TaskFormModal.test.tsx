import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TaskFormModal } from '@/components/Admin/TaskFormModal';
import userEvent from '@testing-library/user-event';
import { taskApi } from '@/api/task/taskApi';
import { tagApi } from '@/api/tag/tagApi';
import { hintApi } from '@/api/hint/hintApi';
import { testCaseApi } from '@/api/testcase/testcaseApi';
import type { Task } from '@/types/Task';
import type { Tag } from '@/types/Tag';
import type { Hint } from '@/types/Hint';
import type { TestCase } from '@/types/TestCase';
import { describe, vi, expect, it } from "vitest";

// Mock API modules
vi.mock('@/api/task/taskApi');
vi.mock('@/api/tag/tagApi');
vi.mock('@/api/hint/hintApi');
vi.mock('@/api/testcase/testcaseApi');

const mockTaskApi = vi.mocked(taskApi);
const mockTagApi = vi.mocked(tagApi);
const mockHintApi = vi.mocked(hintApi);
const mockTestCaseApi = vi.mocked(testCaseApi);

describe('TaskFormModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    const mockTags: Tag[] = [
        { id: '1', name: 'JavaScript', description: 'JS tag' },
        { id: '2', name: 'React', description: 'React tag' },
        { id: '3', name: 'TypeScript', description: 'TS tag' },
    ];

    const mockHints: Hint[] = [
        { id: '1', taskId: '1', content: 'First hint', order: 0 },
        { id: '2', taskId: '1', content: 'Second hint', order: 1 },
    ];

    const mockTestCases: TestCase[] = [
        {
            id: '1', programmingTaskItemId: '1', inputJson: '{"x": 1}', expectedJson: '{"y": 2}', isVisible: true, maxPoints: 10,
            timeoutMs: null
        },
        {
            id: '2', programmingTaskItemId: '1', inputJson: '{"x": 5}', expectedJson: '{"y": 10}', isVisible: false, maxPoints: 20,
            timeoutMs: null
        },
    ];

    const mockProgrammingTask: Task = {
        id: '1',
        title: 'Test Programming Task',
        description: 'Test Description',
        difficulty: 1,
        taskType: 0,
        isPublished: true,
        isDeleted: false,
        templateCode: 'public class Solution {}',
        tagIds: ['1', '2'],
        hintIds: ['1', '2'],
        createdAt: '2024-12-30'
    };

    const mockInteractiveTask: Task = {
        id: '2',
        title: 'Test Interactive Task',
        description: 'Interactive Description',
        difficulty: 2,
        taskType: 1,
        isPublished: false,
        isDeleted: false,
        optionsJson: '["Option A", "Option B"]',
        correctAnswer: 'Option A',
        tagIds: ['3'],
        hintIds: [],
        createdAt: '2024-12-30'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockTagApi.getAll.mockResolvedValue(mockTags);
        mockTagApi.getById.mockImplementation((id) =>
            Promise.resolve(mockTags.find(t => t.id === id)!)
        );
        mockHintApi.getByTaskId.mockResolvedValue(mockHints);
        mockTestCaseApi.getByTaskId.mockResolvedValue(mockTestCases);
        window.alert = vi.fn(() => true);
        window.confirm = vi.fn(() => true);
    });

    describe('Rendering', () => {
        it('should not render when isOpen is false', () => {
            render(
                <TaskFormModal
                    isOpen={false}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            expect(screen.queryByText('Add New Task')).not.toBeInTheDocument();
        });

        it('should render create mode when no task is provided', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            expect(screen.getByText('Add New Task')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('');
            expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument();
        });

        it('should render edit mode for programming task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Edit Task')).toBeInTheDocument();
            });

            expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('Test Programming Task');
            expect(screen.getByPlaceholderText('Enter task description')).toHaveValue('Test Description');
            expect(screen.getByRole('button', { name: 'Update Task' })).toBeInTheDocument();
        });

        it('should render edit mode for interactive task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockInteractiveTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Edit Task')).toBeInTheDocument();
            });

            expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('Test Interactive Task');
            expect(screen.getByPlaceholderText('Enter correct answer')).toBeInTheDocument();
        });

        it('should load tags on open', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });
        });

        it('should load hints for existing task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(mockHintApi.getByTaskId).toHaveBeenCalledWith('1');
            });
        });

        it('should load test cases for programming task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(mockTestCaseApi.getByTaskId).toHaveBeenCalledWith('1');
            });
        });

        it('should not load test cases for interactive task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockInteractiveTask}
                />
            );

            await waitFor(() => {
                expect(mockHintApi.getByTaskId).toHaveBeenCalled();
            });

            expect(mockTestCaseApi.getByTaskId).not.toHaveBeenCalled();
        });
    });

    describe('Form interactions', () => {
        it('should update title field', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const titleInput = screen.getByPlaceholderText('Enter task title');
            await user.type(titleInput, 'New Task Title');

            expect(titleInput).toHaveValue('New Task Title');
        });

        it('should update description field', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const descInput = screen.getByPlaceholderText('Enter task description');
            await user.type(descInput, 'Task description text');

            expect(descInput).toHaveValue('Task description text');
        });

        it('should change task type', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const selects = screen.getAllByRole('combobox');
            const taskTypeSelect = selects[0];

            await user.selectOptions(taskTypeSelect, '1');

            await waitFor(() => {
                expect(taskTypeSelect).toHaveValue('1');
                expect(screen.getByPlaceholderText('Enter correct answer')).toBeInTheDocument();
            });
        });

        it('should change difficulty level', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const selects = screen.getAllByRole('combobox');
            const difficultySelect = selects[1];

            await user.selectOptions(difficultySelect, '2');

            await waitFor(() => {
                expect(difficultySelect).toHaveValue('2');
            });
        });

        it('should toggle published checkbox', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const checkbox = screen.getByRole('checkbox', { name: /publish task immediately/i });
            expect(checkbox).not.toBeChecked();

            await user.click(checkbox);
            expect(checkbox).toBeChecked();
        });

        it('should close modal on close button click', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const closeButton = screen.getAllByRole('button').find(btn =>
                btn.querySelector('svg') && btn.className.includes('hover:bg-muted')
            );

            if (closeButton) {
                await user.click(closeButton);
            }

            expect(mockOnClose).toHaveBeenCalled();
        });

        it('should close modal on cancel button click', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe('Tag management', () => {
        it('should add tag to new task', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            // Kliknij przycisk "Add Tag"
            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            // Sprawdź czy pokazał się dropdown
            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            // Wybierz istniejący tag (JavaScript - mockTags[0])
            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('JavaScript')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            // Sprawdź czy tag został dodany
            await waitFor(() => {
                expect(screen.getByText('JavaScript')).toBeInTheDocument();
            });
        });

        it('should remove tag from new task', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            // Najpierw dodaj tag
            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('JavaScript')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            await waitFor(() => {
                expect(screen.getByText('JavaScript')).toBeInTheDocument();
            });

            // Teraz usuń tag - znajdź przycisk X w tagu
            const removeButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
            );

            if (removeButtons.length > 0) {
                await user.click(removeButtons[0]);
            }

            // Sprawdź czy tag został usunięty
            await waitFor(() => {
                const tagElement = screen.queryByText('JavaScript');
                const noTagsMessage = screen.queryByText('No tags added yet');
                expect(tagElement === null || noTagsMessage !== null).toBe(true);
            });
        });

        it('should add tag to existing task via API', async () => {
            const user = userEvent.setup();
            mockTaskApi.addTag.mockResolvedValue(undefined);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            // Task już ma tagi ['1', '2'], więc dodajemy tag '3' (TypeScript)
            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            // Znajdź i kliknij TypeScript tag
            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('TypeScript')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            // Sprawdź czy API zostało wywołane
            await waitFor(() => {
                expect(mockTaskApi.addTag).toHaveBeenCalledWith('1', '3');
            });
        });

        it('should remove tag from existing task via API', async () => {
            const user = userEvent.setup();
            mockTaskApi.removeTag.mockResolvedValue(undefined);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
                expect(mockTagApi.getById).toHaveBeenCalled();
            });

            // Poczekaj aż tagi się załadują
            await waitFor(() => {
                // Task ma tagi '1' i '2' (JavaScript i React)
                const tags = screen.queryAllByRole('button').filter(btn =>
                    btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
                );
                expect(tags.length).toBeGreaterThan(0);
            });

            // Znajdź przycisk X w pierwszym tagu
            const removeButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
            );

            if (removeButtons.length > 0) {
                await user.click(removeButtons[0]);
            }

            // Sprawdź czy API zostało wywołane
            await waitFor(() => {
                expect(mockTaskApi.removeTag).toHaveBeenCalledWith('1', expect.any(String));
            });
        });

        it('should create new tag', async () => {
            const user = userEvent.setup();
            const newTag = { id: '4', name: 'New Tag', description: 'New description' };
            mockTagApi.create.mockResolvedValue(newTag);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            // Kliknij "Add Tag"
            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            // Wpisz nazwę nowego tagu
            const nameInput = screen.getByPlaceholderText('Tag name...');
            await user.type(nameInput, 'New Tag');

            // Wpisz opis
            const descInput = screen.getByPlaceholderText('Description (optional)...');
            await user.type(descInput, 'New description');

            // Kliknij "Create Tag"
            const createButton = screen.getByRole('button', { name: /create tag/i });
            await user.click(createButton);

            // Sprawdź czy API zostało wywołane
            await waitFor(() => {
                expect(mockTagApi.create).toHaveBeenCalledWith('New Tag', 'New description');
            });

            // Sprawdź czy nowy tag został dodany
            await waitFor(() => {
                expect(screen.getByText('New Tag')).toBeInTheDocument();
            });
        });
    });

    describe('Hint management', () => {
        it('should show hint form when Add Hint is clicked', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const addHintButton = screen.getByRole('button', { name: /add hint/i });
            await user.click(addHintButton);

            expect(screen.getByPlaceholderText('Enter hint text...')).toBeInTheDocument();
        });

        it('should add hint to new task', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const addHintButton = screen.getByRole('button', { name: /add hint/i });
            await user.click(addHintButton);

            const hintInput = screen.getByPlaceholderText('Enter hint text...');
            await user.type(hintInput, 'This is a helpful hint');

            // Znajdź wszystkie przyciski "Add Hint" i weź drugi (w formularzu)
            const submitHintButtons = screen.getAllByRole('button', { name: 'Add Hint' });
            await user.click(submitHintButtons[1]);

            await waitFor(() => {
                expect(screen.getByText('This is a helpful hint')).toBeInTheDocument();
            });
        });

        it('should add hint to existing task via API', async () => {
            const user = userEvent.setup();
            const newHint = { id: '3', taskId: '1', content: 'New hint', order: 2, title: '', createdAt: '2024-12-30' };
            mockHintApi.create.mockResolvedValue(newHint);
            mockTaskApi.addHint.mockResolvedValue(undefined);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('First hint')).toBeInTheDocument();
            });

            const addHintButton = screen.getByRole('button', { name: /add hint/i });
            await user.click(addHintButton);

            const hintInput = screen.getByPlaceholderText('Enter hint text...');
            await user.type(hintInput, 'New hint');

            const submitHintButtons = screen.getAllByRole('button', { name: 'Add Hint' });
            await user.click(submitHintButtons[1]);

            await waitFor(() => {
                expect(mockHintApi.create).toHaveBeenCalled();
                expect(mockTaskApi.addHint).toHaveBeenCalledWith('1', '3');
            });
        });

        it('should remove hint from new task', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            // Add a hint first
            const addHintButton = screen.getByRole('button', { name: /add hint/i });
            await user.click(addHintButton);

            const hintInput = screen.getByPlaceholderText('Enter hint text...');
            await user.type(hintInput, 'Temporary hint');

            const submitHintButtons = screen.getAllByRole('button', { name: 'Add Hint' });
            await user.click(submitHintButtons[1]);

            await waitFor(() => {
                expect(screen.getByText('Temporary hint')).toBeInTheDocument();
            });

            // Remove the hint
            const removeButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-trash-2')
            );

            if (removeButtons.length > 0) {
                await user.click(removeButtons[0]);
            }

            await waitFor(() => {
                expect(screen.queryByText('Temporary hint')).not.toBeInTheDocument();
            });
        });

        it('should remove hint from existing task via API', async () => {
            const user = userEvent.setup();
            mockTaskApi.removeHint.mockResolvedValue(undefined);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('First hint')).toBeInTheDocument();
            });

            const removeButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-trash-2')
            );

            if (removeButtons.length > 0) {
                await user.click(removeButtons[0]);
            }

            await waitFor(() => {
                expect(mockTaskApi.removeHint).toHaveBeenCalled();
            });
        });

        it('should cancel hint form', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const addHintButton = screen.getByRole('button', { name: /add hint/i });
            await user.click(addHintButton);

            expect(screen.getByPlaceholderText('Enter hint text...')).toBeInTheDocument();

            const cancelButton = screen.getAllByRole('button', { name: 'Cancel' })[0];
            await user.click(cancelButton);

            expect(screen.queryByPlaceholderText('Enter hint text...')).not.toBeInTheDocument();
        });

        it('should disable Add Hint button when content is empty', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const addHintButton = screen.getByRole('button', { name: /add hint/i });
            await user.click(addHintButton);

            const submitHintButtons = screen.getAllByRole('button', { name: 'Add Hint' });
            await user.click(submitHintButtons[1]);

            expect(submitHintButtons[1]).toBeDisabled();
        });
    });

    describe('Programming task fields', () => {
        it('should show template code field for programming task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByPlaceholderText('public class Solution { }')).toBeInTheDocument();
            });
        });

        it('should update template code', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const templateInput = screen.getByPlaceholderText('public class Solution { }');
            fireEvent.change(templateInput, { target: { value: 'public class Main {}' } });

            expect(templateInput).toHaveValue('public class Main {}');
        });

        it('should show test case manager for programming task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Edit Task')).toBeInTheDocument();
            });

            // Sprawdź czy TestCaseManager jest renderowany
            expect(screen.getByText('Test Cases')).toBeInTheDocument();
            expect(screen.getByText('Define input and expected output for automated testing')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /add test case/i })).toBeInTheDocument();
        });

        it('should add test case', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            // Kliknij "Add Test Case"
            const addTestCaseButton = screen.getByRole('button', { name: /add test case/i });
            await user.click(addTestCaseButton);

            // Sprawdź czy formularz się pojawił
            await waitFor(() => {
                expect(screen.getByPlaceholderText('{"s": "racecar"}')).toBeInTheDocument();
            });

            // Wypełnij formularz
            const inputField = screen.getByPlaceholderText('{"s": "racecar"}');
            fireEvent.change(inputField, { target: { value: '{"x": 5}' } });

            const expectedField = screen.getByPlaceholderText('{"result": true}');
            fireEvent.change(expectedField, { target: { value: '{"y": 10}' } });

            // Kliknij przycisk "Add Test Case" w formularzu (drugi przycisk z tą nazwą)
            const submitButtons = screen.getAllByRole('button', { name: /add test case/i });
            await user.click(submitButtons[1]);

            // Sprawdź czy test case został dodany
            await waitFor(() => {
                expect(screen.getByText('Test Case #1')).toBeInTheDocument();
                expect(screen.getByText('{"x": 5}')).toBeInTheDocument();
            });
        });

        it('should edit test case', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(mockTestCaseApi.getByTaskId).toHaveBeenCalled();
            });

            // Poczekaj na załadowanie test cases
            await waitFor(() => {
                expect(screen.getByText('Test Case #1')).toBeInTheDocument();
            });

            // Znajdź przycisk Edit (ikona Edit2)
            const editButtons = screen.getAllByRole('button', { name: /edit/i });
            if (editButtons.length > 0) {
                await user.click(editButtons[0]);
            }

            // Sprawdź czy tryb edycji się włączył
            await waitFor(() => {
                expect(screen.getByText(/editing test case #1/i)).toBeInTheDocument();
            });

            // Zmień wartość
            const inputFields = screen.getAllByRole('textbox');
            const inputField = inputFields.find(field =>
                field.getAttribute('placeholder') === null &&
                (field as HTMLTextAreaElement).value.includes('{')
            );

            if (inputField) {
                fireEvent.change(inputField, { target: { value: '{"x": 10}' } });
            }

            // Zapisz zmiany
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            await user.click(saveButton);

            // Sprawdź czy tryb edycji się wyłączył
            await waitFor(() => {
                expect(screen.queryByText(/editing test case #1/i)).not.toBeInTheDocument();
            });
        });

        it('should cancel test case edit', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(mockTestCaseApi.getByTaskId).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText('Test Case #1')).toBeInTheDocument();
            });

            // Włącz tryb edycji
            const editButtons = screen.getAllByRole('button', { name: /edit/i });
            if (editButtons.length > 0) {
                await user.click(editButtons[0]);
            }

            await waitFor(() => {
                expect(screen.getByText(/editing test case #1/i)).toBeInTheDocument();
            });

            // Znajdź przycisk Cancel w formularzu edycji
            const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
            const editCancelButton = cancelButtons.find(btn =>
                btn.closest('.space-y-3') !== null
            );

            if (editCancelButton) {
                await user.click(editCancelButton);
            }

            // Sprawdź czy tryb edycji został anulowany
            await waitFor(() => {
                expect(screen.queryByText(/editing test case #1/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Interactive task fields', () => {
        it('should show options and correct answer for interactive task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockInteractiveTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByPlaceholderText('["Option A", "Option B", "Option C"]')).toBeInTheDocument();
                expect(screen.getByPlaceholderText('Enter correct answer')).toBeInTheDocument();
            });
        });

        it('should update options JSON', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockInteractiveTask}
                />
            );

            const optionsInput = screen.getByPlaceholderText('["Option A", "Option B", "Option C"]');
            await user.clear(optionsInput);
            fireEvent.change(optionsInput, { target: { value: '["A", "B"]' } });

            expect(optionsInput).toHaveValue('["A", "B"]');
        });

        it('should update correct answer', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockInteractiveTask}
                />
            );

            const answerInput = screen.getByPlaceholderText('Enter correct answer');
            await user.clear(answerInput);
            await user.type(answerInput, 'Option B');

            expect(answerInput).toHaveValue('Option B');
        });

        it('should not show template code for interactive task', async () => {
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockInteractiveTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Edit Task')).toBeInTheDocument();
            });

            expect(screen.queryByPlaceholderText('public class Solution { }')).not.toBeInTheDocument();
        });
    });

    describe('Form submission', () => {
        it('should validate required title field', async () => {
            const user = userEvent.setup();
            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const submitButton = screen.getByRole('button', { name: 'Create Task' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Title is required')).toBeInTheDocument();
            });

            expect(mockTaskApi.create).not.toHaveBeenCalled();
        });

        it('should create new programming task successfully', async () => {
            const user = userEvent.setup();
            const createdTask = { ...mockProgrammingTask, id: '3' };
            mockTaskApi.create.mockResolvedValue(createdTask);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const titleInput = screen.getByPlaceholderText('Enter task title');
            await user.type(titleInput, 'New Programming Task');

            const submitButton = screen.getByRole('button', { name: 'Create Task' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockTaskApi.create).toHaveBeenCalledWith({
                    title: 'New Programming Task',
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
                expect(mockOnSuccess).toHaveBeenCalled();
                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        it('should create task with hints', async () => {
            const user = userEvent.setup();
            const createdTask = { ...mockProgrammingTask, id: '3' };
            const createdHint = { id: '10', taskId: '3', content: 'Test hint', order: 0, title: '', createdAt: '2024-12-30' };
            mockTaskApi.create.mockResolvedValue(createdTask);
            mockHintApi.create.mockResolvedValue(createdHint);
            mockTaskApi.addHint.mockResolvedValue(undefined);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const titleInput = screen.getByPlaceholderText('Enter task title');
            await user.type(titleInput, 'Task with hints');

            // Add hint
            const addHintButton = screen.getAllByRole('button', { name: /add hint/i })[0];
            await user.click(addHintButton);

            const hintInput = screen.getByPlaceholderText('Enter hint text...');
            await user.type(hintInput, 'Test hint');

            const submitHintButton = screen.getAllByRole('button', { name: 'Add Hint' })[1];
            await user.click(submitHintButton);

            const submitButton = screen.getByRole('button', { name: 'Create Task' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockTaskApi.create).toHaveBeenCalled();
                expect(mockHintApi.create).toHaveBeenCalled();
                expect(mockTaskApi.addHint).toHaveBeenCalledWith('3', '10');
            });
        });

        it('should update existing task successfully', async () => {
            const user = userEvent.setup();
            mockTaskApi.update.mockResolvedValue();
            mockTestCaseApi.getByTaskId.mockResolvedValue([]);

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    task={mockProgrammingTask}
                />
            );

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('Test Programming Task');
            });

            const titleInput = screen.getByPlaceholderText('Enter task title');
            await user.clear(titleInput);
            await user.type(titleInput, 'Updated Task');

            const submitButton = screen.getByRole('button', { name: 'Update Task' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockTaskApi.update).toHaveBeenCalledWith('1', expect.objectContaining({
                    title: 'Updated Task',
                }));
                expect(mockOnSuccess).toHaveBeenCalled();
                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        it('should display error on submission failure', async () => {
            const user = userEvent.setup();
            const errorMessage = 'Failed to create task';
            mockTaskApi.create.mockRejectedValue({
                response: { data: { message: errorMessage } }
            });

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const titleInput = screen.getByPlaceholderText('Enter task title');
            await user.type(titleInput, 'New Task');

            const submitButton = screen.getByRole('button', { name: 'Create Task' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(errorMessage)).toBeInTheDocument();
            });

            expect(mockOnSuccess).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
        });

        it('should disable submit button while loading', async () => {
            const user = userEvent.setup();
            mockTaskApi.create.mockImplementation(() =>
                new Promise(resolve => setTimeout(resolve, 1000))
            );

            render(
                <TaskFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                />
            );

            const titleInput = screen.getByPlaceholderText('Enter task title');
            await user.type(titleInput, 'New Task');

            const submitButton = screen.getByRole('button', { name: 'Create Task' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
            });
        });
    });
})