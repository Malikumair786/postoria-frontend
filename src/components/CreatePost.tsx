"use client";
import { useCreatePostMutation } from "@/services/postApi";
import { useMeQuery } from "@/services/userApi";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "./ui/card";
import Image from "next/image";
import { X, Images } from "lucide-react"; // for remove icon (optional, or use ✕)

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createPost] = useCreatePostMutation();
  const { data } = useMeQuery();
  const imageUrl = (data as { imageUrl?: string })?.imageUrl || "/avatars/placeholder.png";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };
  
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

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
      await createPost({ text: content, imageUrls }).unwrap();

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
    <Card className="rounded-xl shadow-md p-4 max-w-xl mx-auto mb-6">
      <div className="flex items-start gap-3 mb-4">
        <Image src={imageUrl} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <Textarea
          placeholder="What's on your mind?"
          className="w-full resize-none text-sm"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {previewUrls.map((src, idx) => (
            <div key={idx} className="relative group">
              <img src={src} alt="Preview" className="rounded-lg object-cover h-32 w-full" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                onClick={() => handleRemoveImage(idx)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 gap-2">
        <label className="flex items-center gap-2 text-primary cursor-pointer">
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
          <span className="text-sm font-medium"><Images /></span>
        </label>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </Card>
  );
};

export default CreatePost;
