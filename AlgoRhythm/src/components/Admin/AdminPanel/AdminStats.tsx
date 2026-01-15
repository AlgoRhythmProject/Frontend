import { Users, FileCode, BookOpen, Activity } from 'lucide-react';
import type { UserWithRoles } from '@/api/adminApi';
import type { Task } from '@/types/Task';
import type { Lecture } from '@/types/Lecture';

interface AdminStatsProps {
    users: UserWithRoles[];
    tasks: Task[];
    lectures: Lecture[];
}

export function AdminStats({ users, tasks, lectures }: AdminStatsProps) {
    return (
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
    );
}