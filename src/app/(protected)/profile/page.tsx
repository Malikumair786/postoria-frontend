"use client";

import React, { useState } from "react";
import { useGetMyPostsQuery, useUpdatePostMutation, useDeletePostMutation, useHidePostMutation } from "@/services/postApi";
import Post from "@/components/post";
import { useMeQuery } from "@/services/userApi";
import CreatePost from "@/components/CreatePost";

const ProfilePage = () => {
  const { data, isLoading, refetch } = useGetMyPostsQuery();
  const { data: userData } = useMeQuery();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [hidePost] = useHidePostMutation();

  const posts = data?.data || [];

  const username = (userData as { username?: string })?.username || "Your Name";
  const imageUrl = (userData as { imageUrl?: string })?.imageUrl || "/avatars/placeholder.png";

  const handleUpdate = async (postId: string, updatedContent: string) => {
    try {
      await updatePost({ postId, text: updatedContent });
      refetch();
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      refetch();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleHide = async (postId: string) => {
    try {
      await hidePost(postId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to hide post:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen space-y-6">
      <CreatePost />
      {!isLoading && posts.length === 0 && (
        <p className="text-gray-500 text-center mt-10">You haven’t posted anything yet.</p>
      )}

      {posts.map((post: any) => (
        <Post
          key={post._id}
          id={post._id}
          author={username}
          authorAvatar={imageUrl}
          authorId={post.userId}
          content={post.text}
          imageUrls={post.imageUrls}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          createdAt={post.createdAt}
          isOwnPost={true}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onHide={handleHide}
        />
      ))}
    </div>
  );
};

export default ProfilePage;
