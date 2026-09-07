import {User} from "../entities/user";

export class UserService {
    private readonly users: User[];
    constructor() {
        this.users = [
            {id: 1, email: "1@hotmail.com", password: "1"},
            {id: 2, email: "2@hotmail.com", password: "2"},
            {id: 3, email: "3@hotmail.com", password: "3"},
        ];
    }

    create(userData: Omit<User, "id">): User {
        const nextId = this.users.reduce(
            (highestId, user) => Math.max(highestId, user.id),
            0,
        ) + 1;
        const user: User = {
            id: nextId,
            ...userData,
        };
        this.users.push(user);
        return user;
    }

    reads(): User[] {
        return [...this.users];
    }

    read(id: number): User | undefined {
        return this.users.find((user) => user.id === id);
    }

    update(id: number, userData: Partial<Omit<User, "id">>): User | undefined {
        const user = this.read(id);
        if (!user) {
            return undefined;
        }
        Object.assign(user, userData);
        return user;
    }

    delete(id: number): boolean {
        const userIndex = this.users.findIndex((user) => user.id === id);
        if (userIndex === -1) {
            return false;
        }
        this.users.splice(userIndex, 1);
        return true;
    }
}
