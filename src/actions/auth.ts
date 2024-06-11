import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { UserCache } from "@/helpers/cache";
import { ServerError } from "./common";


export async function auth(role?: string) {
    const res = await getServerSession(authOptions);
    if (!res?.user) throw ServerError.notAuthed().emmit();
    if (role && res.user.role !== role) throw ServerError.notAllowed().emmit();
    const user = await UserCache.get(res.user.name);
    if (!user) throw ServerError.unknown("Error in UserCache").emmit();
    return user;
}

