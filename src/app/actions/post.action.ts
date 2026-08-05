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
export async function deletePostAction(postId: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (post?.userId !== user?.id) throw new Error("Only admin can delete posts");

    await prisma.post.delete({ where: { id: postId } });

    return { success: true };
}

export async function toggleLike(postId: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new Error("Post not found");
    }

    const existingLike = await prisma.like.findFirst({
        where: {
            userId: user.id,
            postId,
        },
    });

    // Unlike
    if (existingLike) {
        await prisma.like.delete({
            where: {
                id: existingLike.id,
            },
        });

        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                likes: {
                    decrement: 1,
                },
            },
        });

        return {
            liked: false,
            message: "Post unliked",
        };
    }

    // Like
    await prisma.like.create({
        data: {
            userId: user.id,
            postId,
        },
    });

    await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            likes: {
                increment: 1,
            },
        },
    });

    return {
        liked: true,
        message: "Post liked",
    };
}
//Create comment
export async function createCommentAction(
    postId: string,
    text: string
) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    if (!text.trim()) {
        throw new Error("Comment cannot be empty");
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            email: user.email!,
        },
    });

    if (!dbUser) {
        throw new Error("User not found");
    }

    const comment = await prisma.comment.create({
        data: {
            text,
            postId,
            userId: dbUser.id,
        },
        include: {
            user: true,
        },
    });

    return comment;
}