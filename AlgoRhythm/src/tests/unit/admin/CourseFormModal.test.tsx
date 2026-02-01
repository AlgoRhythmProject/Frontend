import "@testing-library/jest-dom/vitest";

import { render, screen, waitFor } from '@testing-library/react';
import { CourseFormModal } from '@/components/Admin/CourseFormModal';
import userEvent from '@testing-library/user-event';
import { courseApi } from '@/api/course/courseApi';
import { lectureApi } from '@/api/lecture/lectureApi';
import { taskApi } from '@/api/task/taskApi';
import type { Course } from '@/types/Course';
import type {Lecture, LectureContent} from '@/types/Lecture';
import type { Task } from '@/types/Task';

// Mock API modules
vi.mock('@/api/course/courseApi');
vi.mock('@/api/lecture/lectureApi');
vi.mock('@/api/task/taskApi');

const mockCourseApi = vi.mocked(courseApi);
const mockLectureApi =  vi.mocked(lectureApi);
const mockTaskApi =  vi.mocked(taskApi);

describe('CourseFormModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  const mockLectureContents: LectureContent[] = [
    {
      id: "1",
      lectureId: "lec-101",
      type: "Text",
      order: 1,
      createdAt: new Date().toISOString(),
      htmlContent: "<p>Welcome to the lecture! This is the introductory text.</p>"
    },
    {
      id: "2",
      lectureId: "lec-101",
      type: "Photo",
      order: 2,
      createdAt: new Date().toISOString(),
      path: "/images/lecture1-slide.png",
      alt: "Lecture slide 1",
      title: "Introduction Slide"
    },
    {
      id: "3",
      lectureId: "lec-101",
      type: "Video",
      order: 3,
      createdAt: new Date().toISOString(),
      fileName: "lecture1-part1.mp4",
      streamUrl: "https://example.com/videos/lecture1-part1.mp4",
      fileSize: 102_400_000, // w bajtach (np. 102 MB)
      lastModified: new Date().toISOString()
    },
    {
      id: "4",
      lectureId: "lec-101",
      type: "Text",
      order: 4,
      createdAt: new Date().toISOString(),
      htmlContent: "<p>Let's dive deeper into the main topic...</p>"
    },
    {
      id: "5",
      lectureId: "lec-101",
      type: "Photo",
      order: 5,
      createdAt: new Date().toISOString(),
      path: "/images/lecture1-diagram.png",
      alt: "Diagram explanation",
      title: "Diagram of main concepts"
    }
  ];

  const mockLectures: Lecture[] = [
    { id: '1', title: 'Lecture 1', contents: mockLectureContents.slice(0, 2),
      courseIds: [], tagIds: [], isPublished: true, createdAt: '2024-12-30' },
    { id: '2', title: 'Lecture 2',  contents: mockLectureContents.slice(2, 4),
      courseIds: [], tagIds: [], isPublished: true, createdAt: '2024-12-30' },
  ];

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: 'Task desc 1', difficulty: 1, taskType: 0,
      isPublished: true, isDeleted: false, createdAt: '2024-12-30' },
    { id: '2', title: 'Task 2', description: 'Task desc 2', difficulty: 2, taskType: 1,
      isPublished: true, isDeleted: false, createdAt: '2024-12-30' },
  ];

  const mockCourse: Course = {
    id: '1',
    name: 'Test Course',
    description: 'Test Description',
    isPublished: true,
    lectures: [{ id: '1', title: 'Lecture 1', tagIds: [] }],
    tasks: [{ id: '1', title: 'Task 1', tagIds: [] }],
    createdAt: '2024-12-30'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLectureApi.getPublished.mockResolvedValue(mockLectures);
    mockTaskApi.getPublished.mockResolvedValue(mockTasks);
    mockLectureApi.getById.mockImplementation((id) =>
        Promise.resolve(mockLectures.find(l => l.id === id)!)
    );
    mockTaskApi.getById.mockImplementation((id) =>
        Promise.resolve(mockTasks.find(t => t.id === id)!)
    );
    window.confirm = vi.fn(() => true);
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
          <CourseFormModal
              isOpen={false}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      expect(screen.queryByText('Add New Course')).not.toBeInTheDocument();
    });

    it('should render create mode when no course is provided', async () => {
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      expect(screen.getByText('Add New Course')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter course name')).toHaveValue('');
      expect(screen.getByRole('button', { name: 'Create Course' })).toBeInTheDocument();
    });

    it('should render edit mode when course is provided', async () => {
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
              course={mockCourse}
          />
      );


      const heading = await screen.findByText('Edit Course');
      expect(heading).toBeInTheDocument();

      expect(screen.getByPlaceholderText('Enter course name')).toHaveValue('Test Course');
      expect(screen.getByPlaceholderText('Enter course description')).toHaveValue('Test Description');
      expect(screen.getByRole('button', { name: 'Update Course' })).toBeInTheDocument();
    });

    it('should load and display resources on open', async () => {
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        expect(mockLectureApi.getPublished).toHaveBeenCalled();
        expect(mockTaskApi.getPublished).toHaveBeenCalled();
      });
    });
  });

  describe('Form interactions', () => {
    it('should update name field', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      const nameInput = screen.getByPlaceholderText('Enter course name');
      await user.type(nameInput, 'New Course');

      expect(nameInput).toHaveValue('New Course');
    });

    it('should update description field', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      const descInput = screen.getByPlaceholderText('Enter course description');
      await user.type(descInput, 'Course description');

      expect(descInput).toHaveValue('Course description');
    });

    it('should toggle published checkbox', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      const checkbox = screen.getByRole('checkbox', { name: /publish course immediately/i });
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('should close modal on close button click', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      const closeButton = screen.getAllByRole('button').find(btn =>
          btn.querySelector('svg')
      );

      if (closeButton) {
        await user.click(closeButton);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal on cancel button click', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
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

  describe('Lecture management', () => {
    it('should add lecture', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        expect(screen.getByText('Select a lecture to add...')).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue(/Select a lecture to add/i);
      await user.selectOptions(select, '1');

      await waitFor(() => {
        expect(screen.getByText('Lecture 1')).toBeInTheDocument();
      });
    });

    it('should remove lecture', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        expect(screen.getByText('Select a lecture to add...')).toBeInTheDocument();
      });

      // Add lecture
      const select = screen.getByDisplayValue(/Select a lecture to add/i);
      await user.selectOptions(select, '1');

      await waitFor(() => {
        expect(screen.getByText('Lecture 1')).toBeInTheDocument();
      });

      // Remove lecture
      const removeButtons = screen.getAllByRole('button').filter(btn =>
          btn.querySelector('svg') && btn.className.includes('cursor-pointer')
      );

      const lectureRemoveButton = removeButtons.find(btn =>
          btn.closest('.bg-primary\\/20')
      );

      if (lectureRemoveButton) {
        await user.click(lectureRemoveButton);
      }

      await waitFor(() => {
        expect(screen.queryByTestId('1')).not.toBeInTheDocument();
      });
    });

    it('should add lecture to existing course via API', async () => {
      const user = userEvent.setup();
      mockCourseApi.addLecture.mockResolvedValue(undefined);

      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
              course={mockCourse}
          />
      );

      await waitFor(() => {
        expect(screen.getByText('Select a lecture to add...')).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue(/Select a lecture to add/i);
      await user.selectOptions(select, '2');

      await waitFor(() => {
        expect(mockCourseApi.addLecture).toHaveBeenCalledWith('1', '2');
      });
    });

    it('should remove lecture from existing course via API', async () => {
      const user = userEvent.setup();
      mockCourseApi.removeLecture.mockResolvedValue(undefined);

      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
              course={mockCourse}
          />
      );

      await waitFor(() => {
        expect(screen.getByText('Lecture 1')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByRole('button').filter(btn =>
          btn.querySelector('svg') && btn.className.includes('cursor-pointer')
      );

      const lectureRemoveButton = removeButtons.find(btn =>
          btn.closest('.bg-primary\\/20')
      );

      if (lectureRemoveButton) {
        await user.click(lectureRemoveButton);
      }

      await waitFor(() => {
        expect(mockCourseApi.removeLecture).toHaveBeenCalledWith('1', '1');
      });
    });
  });

  describe('Task management', () => {
    it('should remove task from selection', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        const selects = screen.getAllByRole('combobox');
        expect(selects.length).toBeGreaterThan(0);
      });

      expect(screen.queryByRole('option', { name: 'Task 1'})).toBeInTheDocument();

      const selects = screen.getAllByRole('combobox');
      const taskSelect = selects[1]; // Second select is for tasks

      await user.selectOptions(taskSelect, '1');

      await waitFor(() => {
        expect(screen.queryByRole('option', { name: 'Task 1'})).not.toBeInTheDocument();
      });
    });

    it('should add task to selection', async () => {
      const user = userEvent.setup();
      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        const selects = screen.getAllByRole('combobox');
        expect(selects.length).toBeGreaterThan(0);
      });

      // Add task
      const selects = screen.getAllByRole('combobox');
      const taskSelect = selects[1];
      await user.selectOptions(taskSelect, '1');

      expect(screen.queryByRole('option', {name: 'Task 1'})).not.toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });

      // Remove task
      const removeButtons = screen.getAllByRole('button').filter(btn =>
          btn.querySelector('svg') && btn.className.includes('cursor-pointer')
      );

      const taskRemoveButton = removeButtons.find(btn =>
          btn.closest('.bg-info\\/20')
      );

      if (taskRemoveButton) {
        await user.click(taskRemoveButton);
      }

      await waitFor(() => {
        expect(screen.queryByRole('option', {name: 'Task 1'})).toBeInTheDocument();
      });
    });
  });

  describe('Form submission', () => {
    it('should create new course successfully', async () => {
      const user = userEvent.setup();
      const createdCourse = { ...mockCourse, id: '2' };
      mockCourseApi.create.mockResolvedValue(createdCourse);
      mockCourseApi.addLecture.mockResolvedValue(undefined);
      mockCourseApi.addTask.mockResolvedValue(undefined);

      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter course name')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('Enter course name');
      await user.type(nameInput, 'New Course');

      const submitButton = screen.getByRole('button', { name: 'Create Course' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCourseApi.create).toHaveBeenCalledWith({
          name: 'New Course',
          description: '',
          isPublished: false,
        });
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should create course with lectures and tasks', async () => {
      const user = userEvent.setup();
      const createdCourse = { ...mockCourse, id: '2' };
      mockCourseApi.create.mockResolvedValue(createdCourse);
      mockCourseApi.addLecture.mockResolvedValue(undefined);
      mockCourseApi.addTask.mockResolvedValue(undefined);

      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter course name')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('Enter course name');
      await user.type(nameInput, 'New Course');

      // Add lecture
      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[0], '1');

      // Add task
      await user.selectOptions(selects[1], '1');

      const submitButton = screen.getByRole('button', { name: 'Create Course' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCourseApi.create).toHaveBeenCalled();
        expect(mockCourseApi.addLecture).toHaveBeenCalledWith('2', '1');
        expect(mockCourseApi.addTask).toHaveBeenCalledWith('2', '1');
      });
    });

    it('should update existing course successfully', async () => {
      const user = userEvent.setup();
      mockCourseApi.update.mockResolvedValue();

      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
              course={mockCourse}
          />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter course name')).toHaveValue('Test Course');
      });

      const nameInput = screen.getByPlaceholderText('Enter course name');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Course');

      const submitButton = screen.getByRole('button', { name: 'Update Course' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCourseApi.update).toHaveBeenCalledWith('1', {
          name: 'Updated Course',
          description: 'Test Description',
          isPublished: true,
        });
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should display error on submission failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Failed to create course';
      mockCourseApi.create.mockRejectedValue({
        response: { data: { message: errorMessage } }
      });

      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter course name')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('Enter course name');
      await user.type(nameInput, 'New Course');

      const submitButton = screen.getByRole('button', { name: 'Create Course' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should disable submit button while loading', async () => {
      const user = userEvent.setup();
      mockCourseApi.create.mockImplementation(() =>
          new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(
          <CourseFormModal
              isOpen={true}
              onClose={mockOnClose}
              onSuccess={mockOnSuccess}
          />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter course name')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('Enter course name');
      await user.type(nameInput, 'New Course');

      const submitButton = screen.getByRole('button', { name: 'Create Course' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
      });
    });
  });
});