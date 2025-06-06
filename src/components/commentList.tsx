"use client";

import { useState } from "react";
import { ThumbsUp, SendHorizonal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui/card";

type Comment = {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  likedByUser: boolean;
};

type CommentListProps = {
  comments: Comment[];
  toggleCommentLike: (commentId: number) => void;
  addComment: (newComment: string) => void;
};

const CommentList = ({ comments, toggleCommentLike, addComment }: CommentListProps) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    addComment(newComment);
    setNewComment("");
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="text-primary"
        >
          <SendHorizonal size={18} />
        </button>
      </div>

      {comments.map((comment) => (
        <Card key={comment.id} className="rounded-xl px-3 py-2 flex items-start gap-2">
          <Link href={`/profile/${comment.userId}`}>
            <Image
              src={comment.userAvatar}
              alt={comment.userName}
              width={32}
              height={32}
              className="rounded-full object-cover mt-1"
            />
          </Link>

          <div className="flex-1">
            <Link
              href={`/profile/${comment.userId}`}
              className="text-sm font-semibold hover:underline"
            >
              {comment.userName}
            </Link>
            <p className="text-sm">{comment.text}</p>
          </div>

          <button
            onClick={() => toggleCommentLike(comment.id)}
            className={`text-xs hover:text-primary self-center ${
              comment.likedByUser ? "text-primary" : ""
            }`}
          >
            <ThumbsUp size={14} className="inline-block mr-1" />
            {comment.likes}
          </button>
        </Card>
      ))}
    </div>
  );
};

export default CommentList;
