import "@testing-library/jest-dom/vitest";

import {render, screen, waitFor} from '@testing-library/react';
import { LecturePreviewModal } from '@/components/Admin/LecturePreviewModal';
import userEvent from '@testing-library/user-event';
import type { Lecture, LectureContent } from '@/types/Lecture';
import {describe, vi, expect, it} from "vitest";
import {lectureApi} from "@/api/lecture/lectureApi";

vi.mock('@/components/MediaViewer', () => ({
    ImageViewer: ({ fileName, alt, title }: any) => (
        <div data-testid="mock-image">
            <img src={fileName} alt={alt} />
            {title && <span>{title}</span>}
        </div>
    ),
    VideoViewer: ({ fileName, fileUrl, title }: any) => (
        <div data-testid="mock-video">
            <span>Video Content: {fileName}</span>
            <span>URL: {fileUrl}</span>
            {title && <span>{title}</span>}
        </div>
    ),
}));

vi.mock('@/api/lecture/lectureApi', () => ({
    lectureApi: {
        getAllContents: vi.fn(),
    },
}));

describe('LecturePreviewModal', () => {
    const mockOnClose = vi.fn();
    vi.mock('@/api/lecture/lectureApi');

    const mockLectureApi = vi.mocked(lectureApi);

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
        vi.clearAllMocks();
        mockLectureApi.getAllContents.mockResolvedValue([]);
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
        it('should display message when lecture has no content', async () => {

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithoutContent}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.getByText('This lecture has no content yet.')).toBeInTheDocument();
        });

        it('should render text content with HTML', async () => { // 1. Dodaj async
            mockLectureApi.getAllContents.mockResolvedValue([mockTextContent]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(await screen.findByText('Introduction')).toBeInTheDocument();

            expect(screen.getByText('This is the introduction to the lecture.')).toBeInTheDocument();
        });

        it('should render photo content with image', async () => {
            mockLectureApi.getAllContents.mockResolvedValue(mockLectureWithContent.contents);
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            const image = screen.getByAltText('Architecture diagram');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/images/diagram.png');
        });

        it('should render photo title as figcaption', async () => {
            mockLectureApi.getAllContents.mockResolvedValue(mockLectureWithContent.contents);
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.getByText('System Architecture')).toBeInTheDocument();
        });

        it('should render video content placeholder', async () => {
            mockLectureApi.getAllContents.mockResolvedValue([mockVideoContent]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(await screen.findByText(/Video Content/i)).toBeInTheDocument();
        });

        it('should display video stream URL when available', async () => {
            mockLectureApi.getAllContents.mockResolvedValue(mockLectureWithContent.contents);
            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            expect(await screen.findByText(/URL:/)).toBeInTheDocument();
            expect(await screen.findByText(/https:\/\/example.com\/videos\/lecture-video.mp4/)).toBeInTheDocument();
        });

        it('should render content in correct order sorted by order property', async () => {
            const unorderedContents: LectureContent[] = [
                { ...mockVideoContent, order: 3 },
                { ...mockTextContent, order: 1 },
                { ...mockPhotoContent, order: 2 }
            ];

            mockLectureApi.getAllContents.mockResolvedValue(unorderedContents);

            const { container } = render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={mockLectureWithContent}
                />
            );

            await screen.findByText('Introduction');

            const listContainer = container.querySelector('.lecture-content');

            expect(listContainer).toBeInTheDocument();

            const children = listContainer!.children;

            expect(children).toHaveLength(3);

            expect(children[0]).toHaveTextContent('Introduction');

            expect(children[1]).toHaveTextContent('System Architecture');

            expect(children[2]).toHaveTextContent('lecture-video.mp4');
        });
    });

    describe('Photo content variations', () => {
        it('should render photo without title', async () => {
            const photoWithoutTitle: LectureContent = {
                ...mockPhotoContent,
                title: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [photoWithoutTitle]
            };

            mockLectureApi.getAllContents.mockResolvedValue([photoWithoutTitle]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            const image = screen.getByAltText('Architecture diagram');
            expect(image).toBeInTheDocument();
            expect(screen.queryByText('System Architecture')).not.toBeInTheDocument();
        });

        it('should render photo with empty alt text', async () => {
            const photoWithoutAlt: LectureContent = {
                ...mockPhotoContent,
                alt: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [photoWithoutAlt]
            };

            mockLectureApi.getAllContents.mockResolvedValue([photoWithoutAlt]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            const image = screen.getByRole('presentation');
            expect(image).toHaveAttribute('alt', '');
        });
    });

    describe('Video content variations', () => {
        it('should render video without stream URL', async () => {
            const videoWithoutUrl: LectureContent = {
                ...mockVideoContent,
                streamUrl: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [videoWithoutUrl]
            };

            mockLectureApi.getAllContents.mockResolvedValue([videoWithoutUrl]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(await screen.findByText(/Video Content/i)).toBeInTheDocument();
            expect(await screen.findByText(/lecture-video\.mp4/i)).toBeInTheDocument();
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
        it('should only render valid content types', async () => {
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

            mockLectureApi.getAllContents.mockResolvedValue([mockTextContent, invalidContent]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            // Text content should render
            expect(screen.getByText('Introduction')).toBeInTheDocument();

            // Invalid content should not cause errors and should not render anything
            const contentElements = screen.getByText('Introduction').closest('.lecture-content');
            expect(contentElements?.children.length).toBe(1);
        });

        it('should not render text content with empty lectureContents', async () => {
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

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.getByText('This lecture has no content yet.')).toBeInTheDocument();
        });

        it('should not render photo content without path', async () => {
            const photoWithoutPath: LectureContent = {
                ...mockPhotoContent,
                path: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [photoWithoutPath]
            };

            mockLectureApi.getAllContents.mockResolvedValue([photoWithoutPath]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });

        it('should not render video content without fileName', async () => {
            const videoWithoutFileName: LectureContent = {
                ...mockVideoContent,
                fileName: undefined
            };

            const lecture: Lecture = {
                ...mockLectureWithContent,
                contents: [videoWithoutFileName]
            };

            mockLectureApi.getAllContents.mockResolvedValue([videoWithoutFileName]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.queryByText('Video Content')).not.toBeInTheDocument();
        });
    });

    describe('Multiple content items', () => {
        it('should render multiple text contents', async () => {
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

            mockLectureApi.getAllContents.mockResolvedValue([mockTextContent, secondTextContent]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.getByText('Introduction')).toBeInTheDocument();
            expect(screen.getByText('Conclusion')).toBeInTheDocument();
        });

        it('should render multiple photos', async () => {
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

            mockLectureApi.getAllContents.mockResolvedValue([mockPhotoContent, secondPhotoContent]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.getByAltText('Architecture diagram')).toBeInTheDocument();
            expect(screen.getByAltText('Performance chart')).toBeInTheDocument();
        });

        it('should render multiple videos', async () => {
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

            mockLectureApi.getAllContents.mockResolvedValue([mockVideoContent, secondVideoContent]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={mockOnClose}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            const videoMocks = await screen.findAllByTestId('mock-video');

            expect(videoMocks).toHaveLength(2);

            expect(videoMocks[0]).toHaveTextContent(/lecture-video\.mp4/i);
            expect(videoMocks[1]).toHaveTextContent(/demo-video\.mp4/i);
        });
    });

    describe('HTML content rendering', () => {
        it('should render complex HTML content safely', async () => {
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

            mockLectureApi.getAllContents.mockResolvedValue([complexHtmlContent]);

            render(
                <LecturePreviewModal
                    isOpen={true}
                    onClose={() => {
                    }}
                    lecture={lecture}
                />
            );

            await waitFor(() => {
                expect(screen.queryByText('Loading contents...')).not.toBeInTheDocument();
            });

            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.getByText(/Text with/)).toBeInTheDocument();
        });
    });
});