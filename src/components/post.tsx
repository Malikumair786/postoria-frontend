"use client";
import { useState } from "react";
import { ThumbsUp, MessageCircle, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentList from "./commentList";
import { Card } from "./ui/card";

type PostProps = {
  id: number | string;
  author: string;
  authorAvatar: string;
  authorId: string;
  content?: string;
  imageUrls?: string[];
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
  isOwnPost?: boolean;
  onUpdate?: (postId: string, updatedContent: string) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
  onHide?: (postId: string) => Promise<void>;
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
    userAvatar: "/avatars/placeholder.png",
    text: "Amazing shot!",
    likes: 2,
    likedByUser: false,
  },
  {
    id: 2,
    userId: "u2",
    userName: "Bob",
    userAvatar: "/avatars/placeholder.png",
    text: "Looks awesome.",
    likes: 1,
    likedByUser: false,
  },
];

export default function Post({ id, author, authorAvatar, authorId, content, imageUrls = [], isOwnPost, onUpdate, onDelete, onHide }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [avatarError, setAvatarError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  // Add state for edit mode
  const [editedContent, setEditedContent] = useState(content || "");  // Store edited content

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
    return names.map((n) => n.charAt(0).toUpperCase()).join("");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editedContent !== content && onUpdate) {
      await onUpdate(id.toString(), editedContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(content || "");
    setIsEditing(false);
  };

  return (
    <Card className="rounded-xl shadow-md p-4 max-w-xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${authorId}`}>
            {avatarError || !authorAvatar ? (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">{getInitials(author || "Unknown")}</div>
            ) : (
              <Image src={authorAvatar} alt={author} width={40} height={40} className="w-10 h-10 rounded-full object-cover" onError={() => setAvatarError(true)} />
            )}
          </Link>
          <Link href={`/profile/${authorId}`}>
            <h3 className="font-semibold text-sm hover:underline">{author}</h3>
          </Link>
        </div>

        {isOwnPost && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button onClick={handleEditClick} className="hover:text-primary">
              Edit
            </button>
            <button onClick={() => onHide?.(id.toString())} className="hover:text-yellow-600">
              Hide
            </button>
            <button onClick={() => onDelete?.(id.toString())} className="hover:text-red-600">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Editable Content Section */}
      {isEditing ? (
        <div className="mb-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={handleSaveEdit} className="text-primary">Save</button>
            <button onClick={handleCancelEdit} className="text-gray-600">Cancel</button>
          </div>
        </div>
      ) : (
        content && <p className="mb-2">{content}</p>
      )}

      {imageUrls && imageUrls.length > 0 && (
        <div className="mt-3 grid gap-2 w-full">
          {imageUrls.length === 1 && (
            <div className="relative w-full h-96 rounded overflow-hidden">
              <Image src={imageUrls[0]} alt="Post image" fill className="object-cover rounded-md border" sizes="100vw" />
            </div>
          )}

          {imageUrls.length === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative h-80 rounded overflow-hidden">
                  <Image src={url} alt={`Post image ${idx + 1}`} fill className="object-cover rounded-md border" sizes="50vw" />
                </div>
              ))}
            </div>
          )}

          {imageUrls.length === 3 && (
            <div className="grid grid-cols-3 gap-2 h-80">
              <div className="relative col-span-2 rounded overflow-hidden">
                <Image src={imageUrls[0]} alt="Post image 1" fill className="object-cover rounded-md border" sizes="66vw" />
              </div>
              <div className="flex flex-col gap-2">
                {[imageUrls[1], imageUrls[2]].map((url, idx) => (
                  <div key={idx} className="relative flex-1 rounded overflow-hidden">
                    <Image src={url} alt={`Post image ${idx + 2}`} fill className="object-cover rounded-md border" sizes="33vw" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {imageUrls.length === 4 && (
            <div className="grid grid-cols-2 gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative h-60 rounded overflow-hidden">
                  <Image src={url} alt={`Post image ${idx + 1}`} fill className="object-cover rounded-md border" sizes="50vw" />
                </div>
              ))}
            </div>
          )}

          {imageUrls.length > 4 && (
            <div className="grid grid-cols-2 gap-2">
              {imageUrls.slice(0, 4).map((url, idx) => (
                <div key={idx} className="relative h-60 rounded overflow-hidden">
                  <Image src={url} alt={`Post image ${idx + 1}`} fill className="object-cover rounded-md border" sizes="50vw" />
                  {idx === 3 && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-semibold">+{imageUrls.length - 4} more</div>}
                </div>
              ))}
            </div>
          )}
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
        <button onClick={toggleLike} className={`flex items-center space-x-1 hover:text-blue-600 ${liked ? "text-blue-600" : ""}`}>
          <ThumbsUp size={18} />
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        <button onClick={() => setCommentsVisible(!commentsVisible)} className="flex items-center space-x-1 hover:text-blue-600">
          <MessageCircle size={18} />
          <span>Comment · {comments.length}</span>
        </button>
      </div>

      {commentsVisible && <CommentList comments={comments} toggleCommentLike={toggleCommentLike} addComment={addComment} />}
    </Card>
  );
}
