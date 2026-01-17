import "@testing-library/jest-dom";

import { render, screen, waitFor } from '@testing-library/react';
import { LectureFormModal } from '@/components/Admin/LectureFormModal';
import userEvent from '@testing-library/user-event';
import { lectureApi } from '@/api/lectureApi';
import { tagApi } from '@/api/tagApi';
import type { Lecture } from '@/types/Lecture';
import type { Tag } from '@/api/tagApi';
import type { CourseListItem } from '@/api/courseApi';

// Mock API modules
jest.mock('@/api/lectureApi');
jest.mock('@/api/tagApi');

const mockLectureApi = lectureApi as jest.Mocked<typeof lectureApi>;
const mockTagApi = tagApi as jest.Mocked<typeof tagApi>;

describe('LectureFormModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();

    const mockTags: Tag[] = [
        { id: '1', name: 'Basics', description: 'Basic concepts' },
        { id: '2', name: 'Advanced', description: 'Advanced topics' },
        { id: '3', name: 'React', description: 'React framework' },
    ];

    const mockCourses: CourseListItem[] = [
        { id: '1', name: 'Course 1' },
        { id: '2', name: 'Course 2' },
    ];

    const mockLecture: Lecture = {
        id: '1',
        title: 'Test Lecture',
        isPublished: true,
        contents: [],
        courseIds: ['1'],
        tagIds: ['1', '2'],
        createdAt: '2024-12-30'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockTagApi.getAll.mockResolvedValue(mockTags);
        mockTagApi.getById.mockImplementation((id) =>
            Promise.resolve(mockTags.find(t => t.id === id)!)
        );
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    describe('Rendering', () => {
        it('should not render when isOpen is false', () => {
            render(
                <LectureFormModal
                    isOpen={false}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            expect(screen.queryByText('Add New Lecture')).not.toBeInTheDocument();
        });

        it('should render create mode when no lecture is provided', async () => {
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            expect(screen.getByText('Add New Lecture')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter lecture title')).toHaveValue('');
            expect(screen.getByRole('button', { name: 'Create Lecture' })).toBeInTheDocument();
        });

        it('should render edit mode when lecture is provided', async () => {
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Edit Lecture')).toBeInTheDocument();
            });

            expect(screen.getByPlaceholderText('Enter lecture title')).toHaveValue('Test Lecture');
            expect(screen.getByRole('button', { name: 'Update Lecture' })).toBeInTheDocument();
        });

        it('should load tags on open', async () => {
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });
        });

        it('should load selected tags for existing lecture', async () => {
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getById).toHaveBeenCalledWith('1');
                expect(mockTagApi.getById).toHaveBeenCalledWith('2');
            });
        });
    });

    describe('Form interactions', () => {
        it('should update title field', async () => {
            const user = userEvent.setup();
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const titleInput = screen.getByPlaceholderText('Enter lecture title');
            await user.type(titleInput, 'New Lecture Title');

            expect(titleInput).toHaveValue('New Lecture Title');
        });

        it('should toggle published checkbox', async () => {
            const user = userEvent.setup();
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const checkbox = screen.getByRole('checkbox', { name: /publish lecture immediately/i });
            expect(checkbox).not.toBeChecked();

            await user.click(checkbox);
            expect(checkbox).toBeChecked();
        });

        it('should close modal on close button click', async () => {
            const user = userEvent.setup();
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

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
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe('Tag management', () => {
        it('should add tag to new lecture', async () => {
            const user = userEvent.setup();
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
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

            // Wybierz istniejący tag
            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('Basics')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            // Sprawdź czy tag został dodany
            await waitFor(() => {
                expect(screen.getByText('Basics')).toBeInTheDocument();
            });
        });

        it('should remove tag from new lecture', async () => {
            const user = userEvent.setup();
            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            // Dodaj tag
            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('Basics')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            await waitFor(() => {
                expect(screen.getByText('Basics')).toBeInTheDocument();
            });

            // Usuń tag
            const removeButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
            );

            if (removeButtons.length > 0) {
                await user.click(removeButtons[0]);
            }

            await waitFor(() => {
                const tagElement = screen.queryByText('Basics');
                const noTagsMessage = screen.queryByText('No tags added yet');
                expect(tagElement === null || noTagsMessage !== null).toBe(true);
            });
        });

        it('should add tag to existing lecture via API', async () => {
            const user = userEvent.setup();
            mockLectureApi.addTag.mockResolvedValue(undefined);

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            // Dodaj nowy tag (React - tag '3')
            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('React')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            await waitFor(() => {
                expect(mockLectureApi.addTag).toHaveBeenCalledWith('1', '3');
            });
        });

        it('should remove tag from existing lecture via API', async () => {
            const user = userEvent.setup();
            mockLectureApi.removeTag.mockResolvedValue(undefined);

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
                expect(mockTagApi.getById).toHaveBeenCalled();
            });

            // Poczekaj aż tagi się załadują
            await waitFor(() => {
                const tags = screen.queryAllByRole('button').filter(btn =>
                    btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
                );
                expect(tags.length).toBeGreaterThan(0);
            });

            // Usuń pierwszy tag
            const removeButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
            );

            if (removeButtons.length > 0) {
                await user.click(removeButtons[0]);
            }

            await waitFor(() => {
                expect(mockLectureApi.removeTag).toHaveBeenCalledWith('1', expect.any(String));
            });
        });

        it('should create new tag', async () => {
            const user = userEvent.setup();
            const newTag = { id: '4', name: 'New Tag', description: 'New description' };
            mockTagApi.create.mockResolvedValue(newTag);

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
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

            await waitFor(() => {
                expect(mockTagApi.create).toHaveBeenCalledWith('New Tag', 'New description');
            });

            await waitFor(() => {
                expect(screen.getByText('New Tag')).toBeInTheDocument();
            });
        });
    });

    describe('Form submission', () => {
        it('should create new lecture successfully', async () => {
            const user = userEvent.setup();
            const createdLecture = { ...mockLecture, id: '2', title: 'New Lecture' };
            mockLectureApi.create.mockResolvedValue(createdLecture);

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const titleInput = screen.getByPlaceholderText('Enter lecture title');
            await user.type(titleInput, 'New Lecture');

            const submitButton = screen.getByRole('button', { name: 'Create Lecture' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockLectureApi.create).toHaveBeenCalledWith({
                    title: 'New Lecture',
                    isPublished: false,
                });
                expect(mockOnSuccess).toHaveBeenCalled();
                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        it('should create lecture with tags', async () => {
            const user = userEvent.setup();
            const createdLecture = { ...mockLecture, id: '2', title: 'Lecture with Tags' };
            mockLectureApi.create.mockResolvedValue(createdLecture);
            mockLectureApi.addTag.mockResolvedValue(undefined);

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const titleInput = screen.getByPlaceholderText('Enter lecture title');
            await user.type(titleInput, 'Lecture with Tags');

            // Dodaj tag
            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('Basics')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            await waitFor(() => {
                expect(screen.getByText('Basics')).toBeInTheDocument();
            });

            const submitButton = screen.getByRole('button', { name: 'Create Lecture' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockLectureApi.create).toHaveBeenCalled();
                expect(mockLectureApi.addTag).toHaveBeenCalledWith('2', '1');
            });
        });

        it('should update existing lecture successfully', async () => {
            const user = userEvent.setup();
            mockLectureApi.update.mockResolvedValue();

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Enter lecture title')).toHaveValue('Test Lecture');
            });

            const titleInput = screen.getByPlaceholderText('Enter lecture title');
            await user.clear(titleInput);
            await user.type(titleInput, 'Updated Lecture');

            const submitButton = screen.getByRole('button', { name: 'Update Lecture' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockLectureApi.update).toHaveBeenCalledWith('1', {
                    title: 'Updated Lecture',
                    isPublished: true,
                });
                expect(mockOnSuccess).toHaveBeenCalled();
                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        it('should display error on submission failure', async () => {
            const user = userEvent.setup();
            const errorMessage = 'Failed to create lecture';
            mockLectureApi.create.mockRejectedValue({
                response: { data: { message: errorMessage } }
            });

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const titleInput = screen.getByPlaceholderText('Enter lecture title');
            await user.type(titleInput, 'New Lecture');

            const submitButton = screen.getByRole('button', { name: 'Create Lecture' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(errorMessage)).toBeInTheDocument();
            });

            expect(mockOnSuccess).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
        });

        it('should disable submit button while loading', async () => {
            const user = userEvent.setup();
            mockLectureApi.create.mockImplementation(() =>
                new Promise(resolve => setTimeout(resolve, 1000))
            );

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const titleInput = screen.getByPlaceholderText('Enter lecture title');
            await user.type(titleInput, 'New Lecture');

            const submitButton = screen.getByRole('button', { name: 'Create Lecture' });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
            });
        });
    });

    describe('Error handling', () => {
        it('should handle tag loading error gracefully', async () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation();
            mockTagApi.getAll.mockRejectedValue(new Error('Failed to load tags'));

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(consoleError).toHaveBeenCalledWith(
                    'Failed to load tags:',
                    expect.any(Error)
                );
            });

            consoleError.mockRestore();
        });

        it('should handle selected tags loading error gracefully', async () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation();
            mockTagApi.getById.mockRejectedValue(new Error('Tag not found'));

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getById).toHaveBeenCalled();
            });

            consoleError.mockRestore();
        });

        it('should handle tag addition error for existing lecture', async () => {
            const user = userEvent.setup();
            mockLectureApi.addTag.mockRejectedValue(new Error('Failed to add tag'));
            const consoleError = jest.spyOn(console, 'error').mockImplementation();

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            const addTagButton = screen.getByRole('button', { name: /add tag/i });
            await user.click(addTagButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tag name...')).toBeInTheDocument();
            });

            const tagButtons = screen.getAllByRole('button').filter(btn =>
                btn.textContent?.includes('React')
            );

            if (tagButtons.length > 0) {
                await user.click(tagButtons[0]);
            }

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Failed to add tag');
            });

            consoleError.mockRestore();
        });

        it('should handle tag removal error for existing lecture', async () => {
            const user = userEvent.setup();
            mockLectureApi.removeTag.mockRejectedValue(new Error('Failed to remove tag'));
            const consoleError = jest.spyOn(console, 'error').mockImplementation();

            render(
                <LectureFormModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSuccess={mockOnSuccess}
                    lecture={mockLecture}
                    courses={mockCourses}
                />
            );

            await waitFor(() => {
                expect(mockTagApi.getAll).toHaveBeenCalled();
            });

            await waitFor(() => {
                const tags = screen.queryAllByRole('button').filter(btn =>
                    btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
                );
                expect(tags.length).toBeGreaterThan(0);
            });

            const removeButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-x') && btn.className.includes('rounded-full')
            );

            if (removeButtons.length > 0) {
                await user.click(removeButtons[0]);
            }

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Failed to remove tag');
            });

            consoleError.mockRestore();
        });
    });
});