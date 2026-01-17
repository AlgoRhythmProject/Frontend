import "@testing-library/jest-dom";

import { render, screen } from '@testing-library/react';
import { LecturePreviewModal } from '@/components/Admin/LecturePreviewModal';
import userEvent from '@testing-library/user-event';
import type { Lecture, LectureContent } from '@/types/Lecture';

describe('LecturePreviewModal', () => {
    const mockOnClose = jest.fn();

    const mockTextContent: LectureContent = {
        id: '1',
        lectureId: 'lec-1',
        type: 'Text',
        order: 1,
        createdAt: '2024-12-30',
        htmlContent: '<h1>Introduction</h1><p>This is the introduction to the lecture.</p>'
    };

    const mockPhotoContent: LectureContent = {
        id: '2',
        lectureId: 'lec-1',
        type: 'Photo',
        order: 2,
        createdAt: '2024-12-30',
        path: '/images/diagram.png',
        alt: 'Architecture diagram',
        title: 'System Architecture'
    };

    const mockVideoContent: LectureContent = {
        id: '3',
        lectureId: 'lec-1',
        type: 'Video',
        order: 3,
        createdAt: '2024-12-30',
        fileName: 'lecture-video.mp4',
        streamUrl: 'https://example.com/videos/lecture-video.mp4',
        fileSize: 50000000,
        lastModified: '2024-12-30'
    };

    const mockLectureWithContent: Lecture = {
        id: 'lec-1',
        title: 'Introduction to React',
        isPublished: true,
        contents: [mockTextContent, mockPhotoContent, mockVideoContent],
        courseIds: ['1'],
        tagIds: ['1', '2'],
        createdAt: '2024-12-30'
    };

    const mockLectureWithoutContent: Lecture = {
        id: 'lec-2',
        title: 'Empty Lecture',
        isPublished: false,
        contents: [],
        courseIds: [],
        tagIds: [],
        createdAt: '2024-12-30'
    };

    const mockLectureUnpublished: Lecture = {
        id: 'lec-3',
        title: 'Unpublished Lecture',
        isPublished: false,
        contents: [mockTextContent],
        courseIds: [],
        tagIds: [],
        createdAt: '2024-12-30'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should not render when isOpen is false', () => {
            render(
                <LecturePreviewModal
                    isOpen={false}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.queryByText('Lecture Preview')).not.toBeInTheDocument();
        });

        it('should not render when lecture is null', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={null}
                />
            );

            expect(screen.queryByText('Lecture Preview')).not.toBeInTheDocument();
        });

        it('should render modal when isOpen is true and lecture is provided', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.getByText('Lecture Preview')).toBeInTheDocument();
            expect(screen.getByText('Introduction to React')).toBeInTheDocument();
        });

        it('should display Lecture badge', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.getByText('Lecture')).toBeInTheDocument();
        });

        it('should display Published badge for published lecture', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.getByText('Published')).toBeInTheDocument();
        });

        it('should not display Published badge for unpublished lecture', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureUnpublished}
                />
            );

            expect(screen.queryByText('Published')).not.toBeInTheDocument();
        });
    });

    describe('Content rendering', () => {
        it('should display message when lecture has no content', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithoutContent}
                />
            );

            expect(screen.getByText('This lecture has no content yet.')).toBeInTheDocument();
        });

        it('should render text content with HTML', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.getByText('Introduction')).toBeInTheDocument();
            expect(screen.getByText('This is the introduction to the lecture.')).toBeInTheDocument();
        });

        it('should render photo content with image', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            const image = screen.getByAltText('Architecture diagram');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/images/diagram.png');
        });

        it('should render photo title as figcaption', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.getByText('System Architecture')).toBeInTheDocument();
        });

        it('should render video content placeholder', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.getByText('Video Content')).toBeInTheDocument();
            expect(screen.getByText('lecture-video.mp4')).toBeInTheDocument();
        });

        it('should display video stream URL when available', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(screen.getByText(/Stream URL:/)).toBeInTheDocument();
            expect(screen.getByText(/https:\/\/example.com\/videos\/lecture-video.mp4/)).toBeInTheDocument();
        });

        it('should render content in correct order', () => {
            const unorderedContents: LectureContent[] = [
                { ...mockVideoContent, order: 3 },
                { ...mockTextContent, order: 1 },
                { ...mockPhotoContent, order: 2 }
            ];

            const lectureWithUnorderedContent: Lecture = {
                ...mockLectureWithContent,
                contents: unorderedContents
            };

            const { container } = render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lectureWithUnorderedContent}
                />
            );

            const contentElements = container.querySelectorAll('.lecture-content > *');

            // First should be text content (order 1)
            expect(contentElements[0]).toHaveTextContent('Introduction');

            // Second should be photo (order 2) - figure element
            expect(contentElements[1].tagName).toBe('FIGURE');

            // Third should be video (order 3)
            expect(contentElements[2]).toHaveTextContent('Video Content');
        });
    });

    describe('Photo content variations', () => {
        it('should render photo without title', () => {
            const photoWithoutTitle: LectureContent = {
                ...mockPhotoContent,
                title: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [photoWithoutTitle]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            const image = screen.getByAltText('Architecture diagram');
            expect(image).toBeInTheDocument();
            expect(screen.queryByText('System Architecture')).not.toBeInTheDocument();
        });

        it('should render photo with empty alt text', () => {
            const photoWithoutAlt: LectureContent = {
                ...mockPhotoContent,
                alt: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [photoWithoutAlt]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            const image = screen.getByRole('presentation');
            expect(image).toHaveAttribute('alt', '');
        });
    });

    describe('Video content variations', () => {
        it('should render video without stream URL', () => {
            const videoWithoutUrl: LectureContent = {
                ...mockVideoContent,
                streamUrl: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [videoWithoutUrl]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            expect(screen.getByText('Video Content')).toBeInTheDocument();
            expect(screen.getByText('lecture-video.mp4')).toBeInTheDocument();
            expect(screen.queryByText(/Stream URL:/)).not.toBeInTheDocument();
        });
    });

    describe('Modal interactions', () => {
        it('should close modal when close button is clicked', async () => {
            const user = userEvent.setup();
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            const closeButton = screen.getByRole('button', { name: /close preview/i });
            await user.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should have accessible close button', () => {
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            const closeButton = screen.getByRole('button', { name: /close preview/i });
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveAttribute('aria-label', 'Close preview');
        });
    });

    describe('Content type filtering', () => {
        it('should only render valid content types', () => {
            const invalidContent = {
                id: '4',
                lectureId: 'lec-1',
                type: 'Unknown' as never,
                order: 4,
                createdAt: '2024-12-30'
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [mockTextContent, invalidContent]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            // Text content should render
            expect(screen.getByText('Introduction')).toBeInTheDocument();

            // Invalid content should not cause errors and should not render anything
            const contentElements = screen.getByText('Introduction').closest('.lecture-content');
            expect(contentElements?.children.length).toBe(1);
        });

        it('should not render text content with empty lectureContents', () => {
            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: []
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            // Should show empty state since no valid content
            expect(screen.getByText('This lecture has no content yet.')).toBeInTheDocument();
        });

        it('should not render photo content without path', () => {
            const photoWithoutPath: LectureContent = {
                ...mockPhotoContent,
                path: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [photoWithoutPath]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });

        it('should not render video content without fileName', () => {
            const videoWithoutFileName: LectureContent = {
                ...mockVideoContent,
                fileName: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [videoWithoutFileName]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            expect(screen.queryByText('Video Content')).not.toBeInTheDocument();
        });
    });

    describe('Multiple content items', () => {
        it('should render multiple text contents', () => {
            const secondTextContent: LectureContent = {
                id: '5',
                lectureId: 'lec-1',
                type: 'Text',
                order: 4,
                createdAt: '2024-12-30',
                htmlContent: '<h2>Conclusion</h2><p>This is the conclusion.</p>'
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [mockTextContent, secondTextContent]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            expect(screen.getByText('Introduction')).toBeInTheDocument();
            expect(screen.getByText('Conclusion')).toBeInTheDocument();
        });

        it('should render multiple photos', () => {
            const secondPhotoContent: LectureContent = {
                id: '6',
                lectureId: 'lec-1',
                type: 'Photo',
                order: 5,
                createdAt: '2024-12-30',
                path: '/images/chart.png',
                alt: 'Performance chart',
                title: 'Performance Metrics'
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [mockPhotoContent, secondPhotoContent]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            expect(screen.getByAltText('Architecture diagram')).toBeInTheDocument();
            expect(screen.getByAltText('Performance chart')).toBeInTheDocument();
        });

        it('should render multiple videos', () => {
            const secondVideoContent: LectureContent = {
                id: '7',
                lectureId: 'lec-1',
                type: 'Video',
                order: 6,
                createdAt: '2024-12-30',
                fileName: 'demo-video.mp4',
                streamUrl: 'https://example.com/videos/demo-video.mp4',
                fileSize: 30000000,
                lastModified: '2024-12-30'
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [mockVideoContent, secondVideoContent]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            expect(screen.getByText('lecture-video.mp4')).toBeInTheDocument();
            expect(screen.getByText('demo-video.mp4')).toBeInTheDocument();
        });
    });

    describe('HTML content rendering', () => {
        it('should render complex HTML content safely', () => {
            const complexHtmlContent: LectureContent = {
                id: '8',
                lectureId: 'lec-1',
                type: 'Text',
                order: 1,
                createdAt: '2024-12-30',
                htmlContent: '<div><h1>Title</h1><ul><li>Item 1</li><li>Item 2</li></ul><p>Text with <strong>bold</strong> and <em>italic</em>.</p></div>'
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [complexHtmlContent]
            };

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.getByText(/Text with/)).toBeInTheDocument();
        });
    });
});