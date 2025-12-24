export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    roleId: string;
    role?: Role;
}

export interface Role {
    id: string;
    name: string;
    createdAt: Date;
}

export interface Image {
    id: string;
    url: string;
    createdAt: Date;
    productId?: string | null;
}
