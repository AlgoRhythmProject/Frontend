import { useState, useEffect } from 'react';
import { taskApi } from '@/api/task/taskApi';
import { courseApi } from '@/api/course/courseApi';
import type { Task } from '@/types/Task';
import type { Lecture } from '@/types/Lecture';
import type { Course } from '@/types/Course';
import { LectureFormModal } from '@/components/Admin/LectureFormModal';
import { TaskFormModal } from '@/components/Admin/TaskFormModal';
import { LectureContentModal } from '@/components/Admin/LectureContentModal';
import { LecturePreviewModal } from '@/components/Admin/LecturePreviewModal';
import { CourseFormModal } from '@/components/Admin/CourseFormModal';
import { AdminStats } from '@/components/Admin/AdminPanel/AdminStats';
import { AdminTabs } from '@/components/Admin/AdminPanel/AdminTabs';
import { UsersTab } from '@/components/Admin/AdminPanel/UsersTab';
import { TasksTab } from '@/components/Admin/AdminPanel/TasksTab';
import { LecturesTab } from '@/components/Admin/AdminPanel/LecturesTab';
import { CoursesTab } from '@/components/Admin/AdminPanel/CoursesTab';
import { commentApi } from '@/api/comment/commentApi';
import type { Comment } from '@/types/Comment';
import { CommentsTab } from '@/components/Admin/AdminPanel/CommentsTab';
import { SubmissionsTab } from '@/components/Admin/AdminPanel/SubmissionsTab';
import { adminApi } from '@/api/admin/adminApi';
import type { UserWithRoles } from '@/api/admin/types';
import { submissionApi } from '@/api/submission/submissionApi';
import type { SubmissionResponse } from '@/api/submission/types';
import { lectureApi } from '@/api/lecture/lectureApi';

type TabType = 'users' | 'tasks' | 'lectures' | 'courses' | 'comments' | 'submissions';
export function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isLecturePreviewModalOpen, setIsLecturePreviewModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);

  useEffect(() => {
    loadCourses();
    loadUsers();
    loadTasks();
    loadLectures();
  }, []);

  useEffect(() => {
    if (activeTab === 'tasks' && tasks.length === 0) {
      loadTasks();
    } else if (activeTab === 'lectures' && lectures.length === 0) {
      loadLectures();
    } else if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  const loadCourses = async () => {
    try {
      const data = await courseApi.getAll();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadLectures = async () => {
    try {
      const data = await lectureApi.getAll();
      setLectures(data);
    } catch (error) {
      console.error('Failed to load lectures:', error);
    }
  };

  const handleToggleAdminRole = async (user: UserWithRoles) => {
    const isAdmin = user.roles.includes('Admin');
    const action = isAdmin ? 'revoke' : 'assign';
    const actionText = isAdmin ? 'remove Admin role from' : 'grant Admin role to';

    if (!confirm(`Are you sure you want to ${actionText} ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      if (isAdmin) {
        await adminApi.revokeAdminRole(user.id);
      } else {
        await adminApi.assignAdminRole(user.id);
      }
      await loadUsers();
    } catch (error: any) {
      console.error(`Failed to ${action} admin role:`, error);
      alert(error.response?.data?.error || `Failed to ${action} admin role`);
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskApi.delete(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const handleTaskSuccess = () => {
    loadTasks();
  };

  const handleAddLecture = () => {
    setSelectedLecture(null);
    setIsLectureModalOpen(true);
  };

  const handleEditLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsLectureModalOpen(true);
  };

  const handlePreviewLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsLecturePreviewModalOpen(true);
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;
    try {
      await lectureApi.delete(lectureId);
      await loadLectures();
    } catch (error) {
      console.error('Failed to delete lecture:', error);
      alert('Failed to delete lecture');
    }
  };

  const handleLectureSuccess = () => {
    loadLectures();
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseApi.delete(courseId);
      await loadCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
  };

  const handleCourseSuccess = () => {
    loadCourses();
  };

  const handleManageContent = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsContentModalOpen(true);
  };

  const loadComments = async () => {
    try {
      const allComments: Comment[] = [];
      for (const task of tasks) {
        const taskComments = await commentApi.getByTaskId(task.id);
        allComments.push(...taskComments);
      }
      setComments(allComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  useEffect(() => {
    if (tasks.length > 0 && comments.length === 0) {
      loadComments();
    }
  }, [tasks]);

  useEffect(() => {
    if (activeTab === 'comments' && comments.length === 0 && tasks.length > 0) {
      loadComments();
    }
  }, [activeTab, tasks]);

  const loadSubmissions = async () => {
    try {
      const data = await submissionApi.getAllSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    if (activeTab === 'submissions' && submissions.length === 0) {
      loadSubmissions();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-sans font-medium text-foreground text-4xl mb-2" style={{ fontVariationSettings: "'wdth' 100" }}>
            Admin Panel
          </h1>
          <p className="font-sans text-muted-foreground">
            Manage users, tasks, lectures, and monitor platform activity
          </p>
        </div>

        <AdminStats users={users} tasks={tasks} lectures={lectures} />
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="bg-card border border-muted rounded-xl overflow-hidden">
          {activeTab === 'users' && (
            <UsersTab users={users} loading={loading} onToggleAdminRole={handleToggleAdminRole} />
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'lectures' && (
            <LecturesTab
              lectures={lectures}
              onAddLecture={handleAddLecture}
              onEditLecture={handleEditLecture}
              onPreviewLecture={handlePreviewLecture}
              onManageContent={handleManageContent}
              onDeleteLecture={handleDeleteLecture}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTab
              courses={courses}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}
          {activeTab === 'comments' && (
            <CommentsTab comments={comments} tasks={tasks} loading={loading} />
          )}
          {activeTab === 'submissions' && (
            <SubmissionsTab submissions={submissions} tasks={tasks} loading={loading} />
          )}
        </div>
      </div>

      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={handleCourseSuccess}
        course={selectedCourse}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={handleTaskSuccess}
        task={selectedTask}
      />

      <LectureFormModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        onSuccess={handleLectureSuccess}
        lecture={selectedLecture}
        courses={courses}
      />

      <LecturePreviewModal
        isOpen={isLecturePreviewModalOpen}
        onClose={() => setIsLecturePreviewModalOpen(false)}
        lecture={selectedLecture}
      />

      {selectedLecture && (
        <LectureContentModal
          isOpen={isContentModalOpen}
          onClose={() => setIsContentModalOpen(false)}
          lecture={selectedLecture}
        />
      )}
    </div>
  );
}