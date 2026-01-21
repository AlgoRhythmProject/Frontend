export interface UserWithRoles {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailConfirmed: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}
