"use client";

import { useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentList from "./commentList";
import { Card } from "./ui/card";

type PostProps = {
  id: number;
  author: string;
  authorAvatar: string;
  authorId: string;
  content?: string;
  imageUrl?: string;
};

type Comment = {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  likedByUser: boolean;
};

const dummyComments: Comment[] = [
  {
    id: 1,
    userId: "u1",
    userName: "Alice",
    userAvatar: "/avatars/alice.jpg",
    text: "Amazing shot!",
    likes: 2,
    likedByUser: false,
  },
  {
    id: 2,
    userId: "u2",
    userName: "Bob",
    userAvatar: "/avatars/bob.jpg",
    text: "Looks awesome.",
    likes: 1,
    likedByUser: false,
  },
];

export default function Post({
  id,
  author,
  authorAvatar,
  authorId,
  content,
  imageUrl,
}: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [avatarError, setAvatarError] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => prev + (liked ? -1 : 1));
  };

  const toggleCommentLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: c.likedByUser ? c.likes - 1 : c.likes + 1,
              likedByUser: !c.likedByUser,
            }
          : c
      )
    );
  };

  const addComment = (newComment: string) => {
    if (!newComment.trim()) return;
    const newCom: Comment = {
      id: Date.now(),
      userId: "currentUser",
      userName: "You",
      userAvatar: "/avatars/you.jpg",
      text: newComment,
      likes: 0,
      likedByUser: false,
    };
    setComments([newCom, ...comments]);
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials;
  };

  return (
    <Card className="rounded-xl shadow-md p-4 max-w-xl mx-auto mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <Link href={`/profile/${authorId}`}>
          {/* Display Avatar or Initials */}
          {avatarError || !authorAvatar ? (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">
              {getInitials(author || "Unknown")}
            </div>
          ) : (
            <Image
              src={authorAvatar}
              alt={author}
              width={40}
              height={40}
              className="rounded-full object-cover"
              onError={() => setAvatarError(true)} // Handle error and show initials
            />
          )}
        </Link>
        <Link href={`/profile/${authorId}`}>
          <h3 className="font-semibold  text-sm hover:underline">
            {author}
          </h3>
        </Link>
      </div>

      {content && <p className="mb-2">{content}</p>}

      {imageUrl && (
        <div className="mt-3 rounded-lg overflow-hidden relative w-full h-96">
          <Image
            src={imageUrl}
            alt="Post"
            fill
            className="object-cover rounded-md border"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={true}
          />
        </div>
      )}

      {/* Total Likes Summary (like Facebook) */}
      {likesCount > 0 && (
        <div className="mt-3 text-sm  flex items-center space-x-1">
          <ThumbsUp size={16} className="text-blue-500" />
          <span>{likesCount}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3 text-sm">
        <button
          onClick={toggleLike}
          className={`flex items-center space-x-1 hover:text-blue-600 ${
            liked ? "text-blue-600" : ""
          }`}
        >
          <ThumbsUp size={18} />
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setCommentsVisible(!commentsVisible)}
          className="flex items-center space-x-1 hover:text-blue-600"
        >
          <MessageCircle size={18} />
          <span>Comment · {comments.length}</span>
        </button>
      </div>

      {commentsVisible && (
        <CommentList
          comments={comments}
          toggleCommentLike={toggleCommentLike}
          addComment={addComment}
        />
      )}
    </Card>
  );
}
