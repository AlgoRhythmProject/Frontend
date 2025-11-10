import { useState } from 'react';
import { Users, FileCode, Activity, Plus, Edit, Trash2 } from 'lucide-react';
import { tasks } from '../data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tasksCompleted: number;
  joinDate: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alex Chen', email: 'alex.chen@example.com', role: 'Student', tasksCompleted: 47, joinDate: '2024-01-15' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Student', tasksCompleted: 32, joinDate: '2024-02-20' },
  { id: '3', name: 'Mike Williams', email: 'mike.w@example.com', role: 'Admin', tasksCompleted: 89, joinDate: '2023-11-05' },
  { id: '4', name: 'Emma Davis', email: 'emma.d@example.com', role: 'Student', tasksCompleted: 15, joinDate: '2024-03-10' },
];

export function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'activity'>('users');

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sans font-medium text-foreground text-4xl mb-2" style={{ fontVariationSettings: "'wdth' 100" }}>
            Admin Panel
          </h1>
          <p className="font-sans text-muted-foreground">
            Manage users, tasks, and monitor platform activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-muted rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="font-sans text-muted-foreground">Total Users</p>
            </div>
            <p className="font-sans font-medium text-foreground text-3xl">{mockUsers.length}</p>
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
              <div className="p-2 bg-success/20 rounded-lg">
                <Activity className="w-5 h-5 text-success" />
              </div>
              <p className="font-sans text-muted-foreground">Active Today</p>
            </div>
            <p className="font-sans font-medium text-foreground text-3xl">12</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl p-2 mb-6 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'tasks' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <FileCode className="w-4 h-4" />
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'activity' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
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
              <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">User Management</h2>
                <button className="flex items-center gap-2 bg-primary hover:bg-[#7952e5] text-foreground px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Role</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Tasks</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Joined</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user, idx) => (
                      <tr key={user.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                        <td className="p-4 font-sans text-foreground">{user.name}</td>
                        <td className="p-4 font-sans text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${user.role === 'Admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 font-sans text-foreground">{user.tasksCompleted}</td>
                        <td className="p-4 font-sans text-muted-foreground">{user.joinDate}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Edit className="w-4 h-4 text-info" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div>
              <div className="p-6 border-b border-muted flex items-center justify-between">
                <h2 className="font-sans font-medium text-foreground text-xl">Task Management</h2>
                <button className="flex items-center gap-2 bg-primary hover:bg-[#7952e5] text-foreground px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">ID</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Title</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Difficulty</th>
                      <th className="text-left p-4 font-sans font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, idx) => (
                      <tr key={task.id} className={idx % 2 === 0 ? 'bg-background/50' : ''}>
                        <td className="p-4 font-mono text-primary">{task.id}</td>
                        <td className="p-4 font-sans text-foreground">{task.title}</td>
                        <td className="p-4 font-sans text-muted-foreground">{task.category}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${task.difficulty === 'Easy' ? 'bg-success' :
                              task.difficulty === 'Medium' ? 'bg-warning' : 'bg-error'
                              }`} />
                            <span className="font-sans text-foreground">{task.difficulty}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Edit className="w-4 h-4 text-info" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h2 className="font-sans font-medium text-foreground text-xl mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-background rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-sans font-medium text-foreground mb-1">
                        User {mockUsers[i % mockUsers.length].name} completed task "{tasks[i % tasks.length].title}"
                      </p>
                      <p className="font-sans text-muted-foreground text-sm">
                        {new Date(Date.now() - i * 3600000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
