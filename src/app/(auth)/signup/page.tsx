"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignupMutation } from "@/services/userApi";
import { toast } from "sonner";
import { PasswordInput } from "@/components/passwordInput";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CldImage } from "next-cloudinary";

const passwordRequirements = [
  {
    regex: /.{8,}/,
    message:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
  },
  { regex: /[A-Z]/, message: "" },
  { regex: /[a-z]/, message: "" },
  { regex: /[0-9]/, message: "" },
];

const Signup = () => {
  const router = useRouter();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    profilePicture: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validatePassword = (
    password: string,
    confirmPassword: string
  ): string[] => {
    const errors: string[] = [];
    const failedRequirements = passwordRequirements.filter(
      (req) => !req.regex.test(password)
    );
    if (failedRequirements.length > 0) {
      errors.push(failedRequirements[0].message);
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }
    return errors;
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Image upload failed.");
    const data = await response.json();
    return data.public_id;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast("Error", {
          description: "Image size should be less than 2MB.",
        });
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    const newErrors = validatePassword(
      userData.password,
      userData.confirmPassword
    );
    if (newErrors.length > 0) {
      setErrorMessages(newErrors);
      return;
    }

    try {
      if (imageFile) {
        const publicId = await uploadImageToCloudinary(imageFile);
        setImagePublicId(publicId);

        await signup({
          ...userData,
          profilePicture: publicId,
        }).unwrap();
        router.replace(`/`);
      }
    } catch (err: any) {
      toast("Error", {
        description: err?.data?.message || "Unable to Signup",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full mx-5 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <CardTitle>Postoria</CardTitle>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleRegisterUser} className="grid gap-4">
            <div className="flex items-center justify-center">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div
                  className={`relative w-24 h-24 overflow-hidden rounded-full border-2 border-gray-200 flex justify-center items-center ${
                    imagePreview ? "bg-transparent" : "bg-gray-100"
                  }`}
                  style={{
                    backgroundImage: imagePreview
                      ? `url(${imagePreview})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <input
                    id="photo-upload"
                    type="file"
                    onChange={handleImageChange}
                    className="absolute top-0 left-0 opacity-0 w-full h-full"
                  />
                  {!imagePreview && (
                    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full opacity-50 hover:opacity-100 transition-opacity duration-300 bg-gray-100">
                      <span className="text-sm text-primary">upload image</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="grid gap-2">
              <Label id="username" htmlFor="username">
                Username
              </Label>
              <Input
                id="username"
                name="name"
                type="name"
                value={userData.username}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                required
              />
            </div>
            <PasswordInput
              id="password"
              value={userData.password}
              onChange={handleInputChange}
            />
            <PasswordInput
              id="confirmPassword"
              text="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleInputChange}
            />

            {errorMessages.length > 0 && (
              <div className="text-red-500 text-sm">
                {errorMessages.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Register"}
            </Button>
          </form>
          <div className="text-center text-md mt-4">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
