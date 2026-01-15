import { Shield, ShieldOff } from 'lucide-react';
import type { UserWithRoles } from '@/api/adminApi';

interface UsersTabProps {
    users: UserWithRoles[];
    loading: boolean;
    onToggleAdminRole: (user: UserWithRoles) => void;
}

export function UsersTab({ users, loading, onToggleAdminRole }: UsersTabProps) {
    return (
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
                                                onClick={() => onToggleAdminRole(user)}
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
    );
}