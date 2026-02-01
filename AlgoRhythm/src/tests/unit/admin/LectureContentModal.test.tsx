import "@testing-library/jest-dom/vitest";

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { LectureContentModal } from '@/components/Admin/LectureContentModal';
import userEvent from '@testing-library/user-event';
import { lectureApi } from '@/api/lecture/lectureApi';
import type { Lecture, LectureContent } from '@/types/Lecture';
import { describe, vi, expect, it } from "vitest";

// Mock API modules
vi.mock('@/api/lecture/lectureApi');
vi.mock('@/components/Admin/FileSelector', () => ({
    FileSelector: ({ onSelect, accept }: any) => (
        <button
            onClick={() =>
                accept?.includes('video')
                    ? onSelect({ name: 'mock.mp4', streamUrl: 'https://example.com/mock.mp4' })
                    : onSelect('/images/new-photo.jpg') // Photo
            }
        >
            MockFileSelector
        </button>
    )
}));

const mockLectureApi = vi.mocked(lectureApi);

describe('LectureContentModal', () => {
    const mockOnClose = vi.fn();

    const mockTextContent: LectureContent = {
        id: '1',
        lectureId: 'lec-1',
        type: 'Text',
        order: 0,
        createdAt: '2024-12-30',
        htmlContent: '<h1>Introduction</h1><p>This is the introduction.</p>'
    };

    const mockPhotoContent: LectureContent = {
        id: '2',
        lectureId: 'lec-1',
        type: 'Photo',
        order: 1,
        createdAt: '2024-12-30',
        path: '/images/diagram.png',
        alt: 'Architecture diagram',
        title: 'System Architecture'
    };

    const mockVideoContent: LectureContent = {
        id: '3',
        lectureId: 'lec-1',
        type: 'Video',
        order: 2,
        createdAt: '2024-12-30',
        fileName: 'lecture-video.mp4',
        streamUrl: 'https://example.com/videos/lecture.mp4',
        fileSize: 50000000,
        lastModified: '2024-12-30'
    };

    const mockLecture: Lecture = {
        id: 'lec-1',
        title: 'Introduction to React',
        isPublished: true,
        contents: [mockTextContent, mockPhotoContent, mockVideoContent],
        courseIds: ['1'],
        tagIds: ['1'],
        createdAt: '2024-12-30'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockLectureApi.getAllContents.mockResolvedValue([
            mockTextContent,
            mockPhotoContent,
            mockVideoContent
        ]);
        window.confirm = vi.fn(() => true);
        window.alert = vi.fn();
    });

    describe('Rendering', () => {
        it('should not render when isOpen is false', () => {
            render(
                <LectureContentModal
                    isOpen={false}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            expect(screen.queryByText('Manage Lecture Content')).not.toBeInTheDocument();
        });

        it('should render modal when isOpen is true', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            expect(screen.getByText('Manage Lecture Content')).toBeInTheDocument();
            expect(screen.getByText('Introduction to React')).toBeInTheDocument();
        });

        it('should load contents on open', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(mockLectureApi.getAllContents).toHaveBeenCalledWith('lec-1');
            });
        });

        it('should display loading state', async () => {
            mockLectureApi.getAllContents.mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve([]), 100))
            );

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            expect(screen.getByText('Loading contents...')).toBeInTheDocument();
        });

        it('should display empty state when no contents', async () => {
            mockLectureApi.getAllContents.mockResolvedValue([]);

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('No content yet')).toBeInTheDocument();
                expect(
                    screen.getByText('Add your first content block to get started!')
                ).toBeInTheDocument();
            });
        });

        it('should display Add Content button', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /add content/i })).toBeInTheDocument();
            });
        });
    });

    describe('Content display', () => {
        it('should display text content', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Text')).toBeInTheDocument();
                expect(screen.getByText('Introduction')).toBeInTheDocument();
            });
        });


        it('should display video content', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            expect(await screen.findByText('Video')).toBeInTheDocument();

            expect(
                await screen.findByText(/lecture-video/i)
            ).toBeInTheDocument();

            expect(
                await screen.findByText(/example.com\/videos/)
            ).toBeInTheDocument();
        });


        it('should display content order', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('#0')).toBeInTheDocument();
                expect(screen.getByText('#1')).toBeInTheDocument();
                expect(screen.getByText('#2')).toBeInTheDocument();
            });
        });

        it('should truncate long text content', async () => {
            const longContent: LectureContent = {
                ...mockTextContent,
                htmlContent: '<p>' + 'A'.repeat(250) + '</p>'
            };
            mockLectureApi.getAllContents.mockResolvedValue([longContent]);

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                const contentDiv = screen.getByText(/AAA/).closest('div');
                expect(contentDiv?.innerHTML).toContain('...');
            });
        });
    });

    describe('Add content form', () => {
        it('should show add form when Add Content is clicked', async () => {
            const user = userEvent.setup();
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /add content/i })).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: /add content/i });
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText('Add New Content')).toBeInTheDocument();
            });
        });

        it('should hide Add Content button when form is shown', async () => {
            const user = userEvent.setup();
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /add content/i })).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: /add content/i });
            await user.click(addButton);

            await waitFor(() => {
                const addButtons = screen.queryAllByRole('button', { name: /add content/i });
                expect(addButtons.length).toBe(1); // Only submit button
            });
        });
        it('should cancel add form', async () => {
            const user = userEvent.setup();
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /add content/i })).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: /add content/i });
            await user.click(addButton);

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            await waitFor(() => {
                expect(screen.queryByText('Add New Content')).not.toBeInTheDocument();
            });
        });

        it('should change content type', async () => {
            const user = userEvent.setup();
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /add content/i })).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: /add content/i });
            await user.click(addButton);

            const typeSelect = screen.getByRole('combobox');
            await user.selectOptions(typeSelect, 'Photo');

            await user.click(screen.getByText('MockFileSelector'));
        });
    });

    describe('Add text content', () => {
        it('should add text content successfully', async () => {
            const user = userEvent.setup();
            mockLectureApi.addContent.mockResolvedValue(mockTextContent);

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /add content/i })).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: /add content/i });
            await user.click(addButton);

            const htmlInput = screen.getByPlaceholderText('<p>Enter HTML content here...</p>');
            fireEvent.change(htmlInput, { target: { value: '<p>New content</p>' } });

            const submitButton = screen.getByRole('button', { name: /^Add Content$/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockLectureApi.addContent).toHaveBeenCalledWith('lec-1', {
                    type: 'Text',
                    htmlContent: '<p>New content</p>'
                });
            });
        });
    });

    describe('Add photo content', () => {
        it('should add photo content successfully', async () => {
            const user = userEvent.setup();
            mockLectureApi.addContent.mockResolvedValue(mockPhotoContent);

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            // open form
            await user.click(
                await screen.findByRole('button', { name: /add content/i })
            );

            // select Photo
            await user.selectOptions(
                screen.getByRole('combobox'),
                'Photo'
            );

            // select image via mocked FileSelector
            await user.click(screen.getByText('MockFileSelector'));

            // fill alt
            await user.type(
                screen.getByPlaceholderText('Describe the image for screen readers'),
                'New photo'
            );

            // fill caption
            await user.type(
                screen.getByPlaceholderText('Caption displayed below the image'),
                'Photo Title'
            );

            // submit
            await user.click(
                screen.getByRole('button', { name: /^Add Content$/i })
            );

            await waitFor(() => {
                expect(mockLectureApi.addContent).toHaveBeenCalledWith('lec-1', {
                    type: 'Photo',
                    htmlContent: '',
                    path: '/images/new-photo.jpg',
                    alt: 'New photo',
                    title: 'Photo Title',
                });
            });
        });
    });

    describe('Delete content', () => {
        it('should delete content when confirmed', async () => {
            const user = userEvent.setup();
            mockLectureApi.removeContent.mockResolvedValue();

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Text')).toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-trash-2')
            );

            await user.click(deleteButtons[0]);

            expect(window.confirm).toHaveBeenCalled();

            await waitFor(() => {
                expect(mockLectureApi.removeContent).toHaveBeenCalledWith('lec-1', '1');
            });
        });

        it('should not delete content when cancelled', async () => {
            const user = userEvent.setup();
            window.confirm = vi.fn(() => false);

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Text')).toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-trash-2')
            );

            await user.click(deleteButtons[0]);

            expect(window.confirm).toHaveBeenCalled();
            expect(mockLectureApi.removeContent).not.toHaveBeenCalled();
        });
    });

    describe('Reorder content', () => {
        it('should move content up', async () => {
            const user = userEvent.setup();
            mockLectureApi.swapContentOrder.mockResolvedValue();

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('#2')).toBeInTheDocument();
            });

            const moveUpButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-move-up')
            );

            // Move second item up
            await user.click(moveUpButtons[1]);

            await waitFor(() => {
                expect(mockLectureApi.swapContentOrder).toHaveBeenCalledWith('lec-1', {
                    firstContentId: '2',
                    secondContentId: '1'
                });
            });
        });

        it('should move content down', async () => {
            const user = userEvent.setup();
            mockLectureApi.swapContentOrder.mockResolvedValue();

            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('#1')).toBeInTheDocument();
            });

            const moveDownButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-move-down')
            );

            // Move first item down
            await user.click(moveDownButtons[0]);

            await waitFor(() => {
                expect(mockLectureApi.swapContentOrder).toHaveBeenCalledWith('lec-1', {
                    firstContentId: '1',
                    secondContentId: '2'
                });
            });
        });

        it('should disable move up for first item', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('#1')).toBeInTheDocument();
            });

            const moveUpButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-move-up')
            );

            expect(moveUpButtons[0]).toBeDisabled();
        });

        it('should disable move down for last item', async () => {
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('#2')).toBeInTheDocument();
            });

            const moveDownButtons = screen.getAllByRole('button').filter(btn =>
                btn.querySelector('.lucide-move-down')
            );

            expect(moveDownButtons[2]).toBeDisabled();
        });
    });

    describe('Modal interactions', () => {
        it('should close modal when close button is clicked', async () => {
            const user = userEvent.setup();
            render(
                <LectureContentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLecture}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Manage Lecture Content')).toBeInTheDocument();
            });

            const closeButton = screen.getAllByRole('button').find(btn =>
                btn.querySelector('.lucide-x')
            );

            if (closeButton) {
                await user.click(closeButton);
            }

            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});