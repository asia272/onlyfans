import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Heart, ImageIcon, LockKeyholeIcon, MessageCircle, Trash } from 'lucide-react'
import Image from 'next/image'
import { CldVideoPlayer } from 'next-cloudinary'
import Link from 'next/link'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Button, buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'
import { Prisma, User } from '@prisma/client'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePostAction, toggleLike } from '@/app/actions/post.action'
import { Engagement } from 'next/font/google'
import { Input } from '../ui/input'
import Comment from './Comment'



type PostWithComments = Prisma.PostGetPayload<{
    include: {
        comments: {
            include: {
                user: true;
            };
        };
        likesList: true;
    };
}>;


const Post = ({ post, isSubscribed, admin }: { post: PostWithComments, isSubscribed: boolean, admin: User }) => {


    const { user } = useKindeBrowserClient();

    const [likeState, setLikeState] = useState({
        liked: post.likesList.length > 0,
        count: post.likes,
    });
    const [comment, setComment] = useState("")

    const { toast } = useToast();
    const queryClient = useQueryClient();

    //Delete post
    const { mutate: deletePost } = useMutation({
        mutationKey: ["deletePost"],
        mutationFn: async () => await deletePostAction(post.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast({
                title: "Success",
                description: "Post deleted successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
    //Toggle Like


    const { mutate: likePost, isPending } = useMutation({
        mutationFn: () => toggleLike(post.id),

        onMutate: () => {
            // Save current state for rollback
            const previousState = likeState;

            // Optimistic update
            setLikeState((prev) => ({
                liked: !prev.liked,
                count: prev.liked ? prev.count - 1 : prev.count + 1,
            }));

            return { previousState };
        },

        onError: (_error, _variables, context) => {
            if (!context) return;



            // Roll back to previous state
            setLikeState(context.previousState);

            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });
        },
    });
    const handleCommentSubmission = async () => {

    }
    return (
        <div className='flex flex-col gap-3 p-3 border-t'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2l '>
                    <Avatar>
                        <AvatarImage src={admin.image || "/user-placeholder.png"} className='object-cover' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='font-semibold text-sm md:text-md'>{admin.name}</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <p className='text-zinc-400 text-xs md:text-sm tracking-tighter'>17.06.2024</p>

                    {admin.id === user?.id && (
                        <Trash
                            className='w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer'
                            onClick={() => deletePost()}
                        />
                    )}
                </div>
            </div>

            <p className='text- sm md:text-md'>{post.text}</p>

            {(post.isPublic || isSubscribed) && post.mediaUrl && post.mediaType === "image" && (
                <div className='relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-red-50'>
                    <img src={post.mediaUrl} alt='Post Image' className='rounded-lg object-cover w-full' />
                </div>
            )}

            {(post.isPublic || isSubscribed) && post.mediaUrl && post.mediaType === "video" && (
                <div className='w-full mx-auto'>
                    <CldVideoPlayer width='960' height={540} className='rounded-md' src={post.mediaUrl} />
                </div>
            )}
            {/*when post is not public and user is not subscribed */}
            {!isSubscribed && !post.isPublic && (
                <div
                    className='w-full bg-slate-800 relative h-96 rounded-md bg-of flex flex-col justify-center
          items-center px-5 overflow-hidden
        '
                >
                    <LockKeyholeIcon className='w-16 h-16 text-zinc-400 mb-20 z-0' />

                    <div aria-hidden='true' className='opacity-60 absolute top-0 left-0 w-full h-full bg-stone-800' />

                    <div className='flex flex-col gap-2 z-10 border p-2 border-gray-500 w-full rounded'>
                        <div className='flex gap-1 items-center'>
                            <ImageIcon className='w-4 h-4' />
                            <span className='text-xs'>1</span>
                        </div>

                        <Link
                            className={buttonVariants({
                                className: "!rounded-full w-full font-bold ",
                            })}
                            href={"/pricing"}
                        >
                            Subscribe to unlock
                        </Link>
                    </div>
                </div>
            )}
            {/* show all like and comment for every post. Also add like and comment if user is authenticted */}

            <div className='flex gap-4'>
                <div className='flex gap-1 items-center'>
                    <Heart
                        className={cn(
                            "w-5 h-5 cursor-pointer",
                            {
                                "text-red-500 fill-red-500": likeState.liked,
                            }
                        )}
                        onClick={() => likePost()}
                    />

                    <span>{likeState.count}</span>
                </div>

                {/*  for comments */}
                <div className='flex gap-1 items-center'>
                    <Dialog>
                        <DialogTrigger>
                            <MessageCircle className='w-5 h-5 cursor-pointer' />
                        </DialogTrigger>
                        {isSubscribed && (
                            <DialogContent className='sm:max-w-[425px]'>
                                <DialogHeader>
                                    <DialogTitle>Comments</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className='h-[400px] w-[350px] rounded-md p-4'>
                                    {post.comments.map((comment: any) => (
                                        <Comment key={comment.id} comment={comment} />
                                    ))}

                                    {post.comments.length === 0 && (
                                        <div className='flex flex-col items-center justify-center h-full'>
                                            <p className='text-zinc-400'>No comments yet</p>
                                        </div>
                                    )}
                                </ScrollArea>

                                <form onSubmit={handleCommentSubmission}>
                                    <Input
                                        placeholder='Add a comment'
                                        onChange={(e) => setComment(e.target.value)}
                                        value={comment}
                                    />

                                    <DialogFooter>
                                        <Button type='submit' className='mt-4' disabled={isCommenting}>
                                            {isCommenting ? "Commenting..." : "Comment"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        )}
                    </Dialog>

                    <div className='flex gap-1 items-center'>
                        <span className='text-xs text-zinc-400 tracking-tighter'>
                            {post.comments.length > 0 ? post.comments.length : 0}
                        </span>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Post