"use client";
import { useCreatePostMutation } from "@/services/postApi";
import { useMeQuery } from "@/services/userApi";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "./ui/card";
import Image from "next/image";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createPost] = useCreatePostMutation();
  const { data, error, isLoading } = useMeQuery();
  const imageUrl = (data as { imageUrl?: string })?.imageUrl || "/avatars/placeholder.jpg";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      urls.push(data.secure_url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error("Post cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrls = await uploadImagesToCloudinary();

      const result = await createPost({ text: content, imageUrls }).unwrap();

      toast.success("Post created!");
      setContent("");
      setImages([]);
      setPreviewUrls([]);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <Image src={imageUrl} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <Textarea placeholder="What's on your mind?" className="w-full resize-none text-sm" rows={3} value={content} onChange={(e: any) => setContent(e.target.value)} />
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {previewUrls.map((src, idx) => (
            <img key={idx} src={src} alt="Preview" className="rounded-lg object-cover h-32 w-full" />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 gap-2">
        <label className="flex items-center gap-2 text-primary cursor-pointer">
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
          <span className="text-sm font-medium">Add Photo</span>
        </label>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </Card>
  );
};

export default CreatePost;
