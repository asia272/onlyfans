import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Comment = ({ comment }: { comment: any }) => {
    return (
        <div className="flex gap-3 py-3 border-b">
            <Avatar className="h-8 w-8">
                <AvatarImage
                    src={comment.user.image || "/user-placeholder.png"}
                />
                <AvatarFallback>
                    {comment.user.name.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
                <span className="font-semibold text-sm">
                    {comment.user.name}
                </span>

                <p className="text-sm text-muted-foreground">
                    {comment.text}
                </p>
            </div>
        </div>
    );
};

export default Comment;