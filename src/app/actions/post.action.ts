"use server";

import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getPostsAction() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) throw new Error("Unauthorized");

    const posts = await prisma.post.findMany({
        include: {
            comments: {
                include: {
                    user: true,
                },
            },
            likesList: { where: { userId: user.id } },
        },
    });

    return posts;
}