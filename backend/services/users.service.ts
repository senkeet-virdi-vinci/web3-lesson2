import type { User, UserFilter } from "../types/user.ts";
import { db } from "../src/prisma/db.ts";

export class UsersService {

    public static async getUsers(filter?: UserFilter) : Promise<User[]> {
        const id = filter?.id;

        const query = id !== undefined 
        ? db.orm.public.User.where((user) => user.id.eq(id))
        : db.orm.public.User;

        const users = await query.all();

        return users;
    }

}