"use client";

import CreatePost from "@/components/CreatePost";
import Post from "@/components/post";
import { useGetPostsQuery } from "@/services/postApi";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { data, isLoading, error } = useGetPostsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-primary" />
        <span className="ml-2">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load posts.</div>;
  }

  return (
    <div className="p-6 min-h-screen space-y-6">
      <CreatePost />
      {data?.data?.map((post: any) => (
        <Post
          key={post._id}
          id={post._id}
          author={post.username} // ideally replace with user's name if available
          authorId={post.userId}
          authorAvatar={post.userImage || "/avatars/placeholder.png"}
          content={post.text}
          imageUrls={post.imageUrls}
        />
      ))}
    </div>
  );
};

export default Page;
