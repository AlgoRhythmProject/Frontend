import { useState, useEffect } from 'react';
import { Users, FileCode, Activity, BookOpen, Edit, Trash2, FileText, Shield, ShieldOff, Eye, Plus, Folders } from 'lucide-react';
import { taskApi } from '@/api/taskApi';
import { lectureApi } from '@/api/lectureApi';
import { courseApi } from '@/api/courseApi';
import { adminApi, type UserWithRoles } from '@/api/adminApi';
import type { Task } from '@/types/Task';
import type { Lecture } from '@/types/Lecture';
import { DifficultyLabel, DifficultyColor } from '@/utils/difficulty';
import { LectureFormModal } from '@/components/Admin/LectureFormModal';
import { TaskFormModal } from '@/components/Admin/TaskFormModal';
import { LectureContentModal } from '@/components/Admin/LectureContentModal';
import { LecturePreviewModal } from '@/components/Admin/LecturePreviewModal';
import type { Course } from '@/types/Course';
import { CourseFormModal } from '@/components/Admin/CourseFormModal';

export function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'lectures' | 'courses' | 'activity'>('users');
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

  // Załaduj wszystkie dane przy montowaniu
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

  const handleDeleteCourse = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await taskApi.delete(taskId);
      await loadTasks();
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sans font-medium text-foreground text-4xl mb-2" style={{ fontVariationSettings: "'wdth' 100" }}>
            Admin Panel
          </h1>
          <p className="font-sans text-muted-foreground">
            Manage users, tasks, lectures, and monitor platform activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-muted rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="font-sans text-muted-foreground">Total Users</p>
            </div>
            <p className="font-sans font-medium text-foreground text-3xl">{users.length}</p>
          </div>

          <div className="bg-card border border-muted rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-info/20 rounded-lg">
                <FileCode className="w-5 h-5 text-info" />
              </div>
              <p className="font-sans text-muted-foreground">Total Tasks</p>
            </div>
            <p className="font-sans font-medium text-foreground text-3xl">{tasks.length}</p>
          </div>

          <div className="bg-card border border-muted rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-warning/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-warning" />
              </div>
              <p className="font-sans text-muted-foreground">Total Lectures</p>
            </div>
            <p className="font-sans font-medium text-foreground text-3xl">{lectures.length}</p>
          </div>

          <div className="bg-card border border-muted rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <Activity className="w-5 h-5 text-success" />
              </div>
              <p className="font-sans text-muted-foreground">Admins</p>
            </div>
            <p className="font-sans font-medium text-foreground text-3xl">
              {users.filter(u => u.roles.includes('Admin')).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl p-2 mb-6 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'tasks' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <FileCode className="w-4 h-4" />
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('lectures')}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'lectures' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Lectures
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'courses' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Folders className="w-4 h-4" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'activity' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Activity className="w-4 h-4" />
            Activity
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-card border border-muted rounded-xl overflow-hidden">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="p-6 border-b border-muted">
                <h2 className="font-sans font-medium text-foreground text-xl">User Management</h2>
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  Manage user roles and permissions
                </p>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <p className="font-sans text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-sans text-muted-foreground">No users found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background">
                      <tr>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Roles</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Joined</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => {
                        const isAdmin = user.roles.includes('Admin');
                        return (
                          <tr key={user.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                            <td className="p-4 font-sans text-foreground">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="p-4 font-sans text-muted-foreground">{user.email}</td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {user.roles.map((role) => (
                                  <span
                                    key={role}
                                    className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${role === 'Admin'
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                      }`}
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${user.emailConfirmed
                                  ? 'bg-success/20 text-success'
                                  : 'bg-warning/20 text-warning'
                                  }`}
                              >
                                {user.emailConfirmed ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="p-4 font-sans text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleAdminRole(user)}
                                className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg transition-colors ${isAdmin
                                  ? 'bg-error/10 hover:bg-error/20 text-error'
                                  : 'bg-primary/10 hover:bg-primary/20 text-primary'
                                  }`}
                                title={isAdmin ? 'Revoke Admin' : 'Grant Admin'}
                              >
                                {isAdmin ? (
                                  <>
                                    <ShieldOff className="w-4 h-4" />
                                    <span className="text-sm font-sans font-medium">Revoke Admin</span>
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-sans font-medium">Grant Admin</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div>
              <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">Task Management</h2>
                <button
                  onClick={handleAddTask}
                  className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded-lg transition-colors"
                >
                  <FileCode className="w-4 h-4 " />
                  Add Task
                </button>
              </div>
              {tasks.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-sans text-muted-foreground">No tasks found. Create your first task!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background">
                      <tr>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Title</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Type</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Difficulty</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Created</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, idx) => (
                        <tr key={task.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                          <td className="p-4 font-sans text-foreground">{task.title}</td>
                          <td className="p-4 font-sans text-muted-foreground">
                            {task.taskType === 0 ? 'Programming' : 'Interactive'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${DifficultyColor[task.difficulty]}`} />
                              <span className="font-sans text-foreground">{DifficultyLabel[task.difficulty]}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${task.isPublished ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                                }`}
                            >
                              {task.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4 font-sans text-muted-foreground">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-2 hover:bg-muted rounded cursor-pointer transition-colors"
                                title="Edit Task"
                              >
                                <Edit className="w-4 h-4 text-info" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="cursor-pointer p-2 hover:bg-muted rounded transition-colors"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4 text-error" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Lectures Tab */}
          {activeTab === 'lectures' && (
            <div>
              <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">Lecture Management</h2>
                <button
                  onClick={handleAddLecture}
                  className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Add Lecture
                </button>
              </div>
              {lectures.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-sans text-muted-foreground">No lectures found. Create your first lecture!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background">
                      <tr>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Title</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Contents</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Created</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectures.map((lecture, idx) => (
                        <tr key={lecture.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                          <td className="p-4 font-sans text-foreground">{lecture.title}</td>
                          <td className="p-4 font-sans text-muted-foreground">
                            {lecture.contents?.length || 0} items
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${lecture.isPublished ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                                }`}
                            >
                              {lecture.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4 font-sans text-muted-foreground">
                            {new Date(lecture.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">

                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePreviewLecture(lecture)}
                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                title="Preview Lecture"
                              >
                                <Eye className="w-4 h-4 text-warning" />
                              </button>
                              <button
                                onClick={() => handleManageContent(lecture)}
                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                title="Manage Content"
                              >
                                <FileText className="w-4 h-4 text-primary" />
                              </button>
                              <button
                                onClick={() => handleEditLecture(lecture)}
                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                title="Edit Lecture"
                              >
                                <Edit className="w-4 h-4 text-info" />
                              </button>
                              <button
                                onClick={() => handleDeleteLecture(lecture.id)}
                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                title="Delete Lecture"
                              >
                                <Trash2 className="w-4 h-4 text-error" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">Course Management</h2>
                <button
                  onClick={handleAddCourse}
                  className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              </div>
              {courses.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-sans text-muted-foreground">No courses found. Create your first course!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background">
                      <tr>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Description</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Lectures</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Tasks</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Created</th>
                        <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, idx) => (
                        <tr key={course.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                          <td className="p-4 font-sans text-foreground font-medium">{course.name}</td>
                          <td className="p-4 font-sans text-muted-foreground max-w-xs truncate">
                            {course.description || 'No description'}
                          </td>
                          <td className="p-4 font-sans text-muted-foreground">
                            {course.lectures?.length || 0} lectures
                          </td>
                          <td className="p-4 font-sans text-muted-foreground">
                            {course.tasks.length || 0} tasks
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${course.isPublished
                                ? 'bg-success/20 text-success'
                                : 'bg-muted text-muted-foreground'
                                }`}
                            >
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4 font-sans text-muted-foreground">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                title="Edit Course"
                              >
                                <Edit className="w-4 h-4 text-info" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-2 hover:bg-muted cursor-pointer rounded transition-colors"
                                title="Delete Course"
                              >
                                <Trash2 className="w-4 h-4 text-error" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h2 className="font-sans font-medium text-foreground text-xl mb-6">Recent Activity</h2>
              <div className="p-8 text-center">
                <p className="font-sans text-muted-foreground">Activity tracking coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={handleCourseSuccess}
        course={selectedCourse}
      />
      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={handleTaskSuccess}
        task={selectedTask}
      />

      {/* Lecture Form Modal */}
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

      {/* Lecture Content Modal */}
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