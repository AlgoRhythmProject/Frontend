import { render, screen } from '@testing-library/react';
import type { UserWithRoles } from '@/api/admin/types';
import type { Task } from '@/types/Task';
import type { Lecture } from '@/types/Lecture';
import "@testing-library/jest-dom/vitest";
import {AdminStats} from "@/components/Admin/AdminPanel/AdminStats.tsx";


describe('AdminStats Component', () => {
    const mockUsers: UserWithRoles[] = [
        { id: '1', email: 'admin@test.com', roles: ['Admin', 'User'], firstName: 'admin', lastName: 'admin',
            emailConfirmed: true, createdAt: Date.now().toString(), updatedAt: Date.now().toString() },
        { id: '2', email: 'user1@test.com', roles: ['User'], firstName: 'user', lastName: 'user',
            emailConfirmed: true, createdAt: Date.now().toString(), updatedAt: Date.now().toString() },
        { id: '3', email: 'admin2@test.com', roles: ['User'], firstName: 'admin2', lastName: 'admin2',
            emailConfirmed: true, createdAt: Date.now().toString(), updatedAt: Date.now().toString() },
    ];

    const mockTasks: Partial<Task>[] = [
        { id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }
    ];

    const mockLectures: Partial<Lecture>[] = [
        { id: 'l1' }, { id: 'l2' }
    ];

    it('should render all stat labels correctly', () => {
        render(
            <AdminStats
                users={mockUsers}
                tasks={mockTasks as Task[]}
                lectures={mockLectures as Lecture[]}
            />
        );

        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('Total Tasks')).toBeInTheDocument();
        expect(screen.getByText('Total Lectures')).toBeInTheDocument();
        expect(screen.getByText('Admins')).toBeInTheDocument();
    });

    it('should display correct counts for users, tasks and lectures', () => {
        render(
            <AdminStats
                users={mockUsers}
                tasks={mockTasks as Task[]}
                lectures={mockLectures as Lecture[]}
            />
        );

        expect(screen.getByText('3')).toBeInTheDocument(); // users.length
        expect(screen.getByText('4')).toBeInTheDocument(); // tasks.length
        expect(screen.getByText('2')).toBeInTheDocument(); // lectures.length
    });

    it('should correctly filter and display the number of admins', () => {
        render(
            <AdminStats
                users={mockUsers}
                tasks={[]}
                lectures={[]}
            />
        );

        // W mockUsers mamy 2 osoby z rolą 'Admin'
        const adminCount = screen.getByText('1');
        expect(adminCount).toBeInTheDocument();
    });

    it('should display 0 when arrays are empty', () => {
        render(
            <AdminStats
                users={[]}
                tasks={[]}
                lectures={[]}
            />
        );

        const zeros = screen.getAllByText('0');
        expect(zeros).toHaveLength(4);
    });

    it('should render icons (lucide-react)', () => {
        const { container } = render(
            <AdminStats
                users={[]}
                tasks={[]}
                lectures={[]}
            />
        );

        const iconContainers = container.querySelectorAll('.rounded-lg');
        expect(iconContainers).toHaveLength(4);
    });
});