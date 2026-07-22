import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Heart, ImageIcon, LockKeyholeIcon, MessageCircle, Trash } from 'lucide-react'
import Image from 'next/image'
import { CldVideoPlayer } from 'next-cloudinary'
import { user } from '@/dummy_data'
import Link from 'next/link'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const Post = ({ post, isSubscribed, admin }: { post: any, isSubscribed: boolean, admin: any }) => {

    const [isLiked, setIsLiked] = useState(false)

    return (
        <div className='flex flex-col gap-3 p-3 border-t'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={admin.image || "/user-placeholder.png"} className='object-cover' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='font-semibold text-sm md:text-md'>{admin.name}</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <p className='text-zinc-400 text-xs md:text-sm tracking-tighter'>17.06.2024</p>

                    {admin.id === user.id && (
                        <Trash
                            className='w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer'

                        />
                    )}
                </div>
            </div>


            <p className='text- sm md:text-md'>{post.text}</p>

            {(post.isPublic || isSubscribed) && post.mediaUrl && post.mediaType === "image" && (
                <div className='relative w-full pb-[56.25%] rounded-lg overflow-hidden'>
                    <Image src={post.mediaUrl} alt='Post Image' className='rounded-lg object-cover' fill />
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
                        className={cn("w-5 h-5 cursor-pointer", { "text-red-500": isLiked, "fill-red-500": isLiked })}
                        onClick={() => setIsLiked(!isLiked)}
                    />
                    <span className='text-xs text-zinc-400 tracking-tighter'>{post.likes}</span>
                </div>

                {/* Todo for comments */}
                {/* <div className='flex gap-1 items-center'>
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
                                        // <Comment key={comment.id} comment={comment} />
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

                </div> */}

            </div>
        </div>
    )
}

export default Post