
import { Users, FileCode, BookOpen, Code, Folders, MessageSquare } from 'lucide-react';

type TabType = 'users' | 'tasks' | 'lectures' | 'courses' | 'comments' | 'submissions';

interface AdminTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
    return (
        <div className="bg-card rounded-xl p-2 mb-6 inline-flex gap-2">
            <button
                onClick={() => onTabChange('users')}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <Users className="w-4 h-4" />
                Users
            </button>
            <button
                onClick={() => onTabChange('tasks')}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'tasks' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <FileCode className="w-4 h-4" />
                Tasks
            </button>
            <button
                onClick={() => onTabChange('lectures')}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'lectures' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <BookOpen className="w-4 h-4" />
                Lectures
            </button>
            <button
                onClick={() => onTabChange('courses')}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'courses' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <Folders className="w-4 h-4" />
                Courses
            </button>
            <button
                onClick={() => onTabChange('comments')}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'comments' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <MessageSquare className="w-4 h-4" />
                Comments
            </button>
            <button
                onClick={() => onTabChange('submissions')}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors ${activeTab === 'submissions' ? 'bg-primary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <Code className="w-4 h-4" />
                Submissions
            </button>
        </div>
    );
}