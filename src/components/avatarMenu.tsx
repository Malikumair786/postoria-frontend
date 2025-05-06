"use client";

import { useState } from "react";
import { useMeQuery } from "@/services/userApi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut, SquareUserRound, User } from "lucide-react";

import Loader from "./loader";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AvatarMenu = () => {
  const { data, error, isLoading } = useMeQuery();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isLoading) return <Loader />;

  const username = (data as { username?: string })?.username || "Your Name";
  const imageUrl = (data as { imageUrl?: string })?.imageUrl || "/avatars/placeholder.png";
  const nameParts = username.split(" ");
  const firstInitial = nameParts[0]?.charAt(0) || "";
  const lastInitial = nameParts[1]?.charAt(0) || "";

  const handleSignOut = () => {
    Cookies.remove("access_token");
    router.push("/");
  };

  if (error) {
    return (
      <button className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300">
        <Avatar className="cursor-pointer bg-primary text-white">
          <AvatarFallback className="text-sm font-medium text-primary">DU</AvatarFallback>
        </Avatar>
      </button>
    );
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded-full focus:outline-none focus:ring-primary transition">
          <Avatar className="cursor-pointer bg-primary hover:opacity-200">
            {imageUrl && <AvatarImage src={imageUrl} alt={username} />}
            <AvatarFallback className="text-sm font-medium text-primary">{(firstInitial + lastInitial).toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg border border-gray-200 py-2">
        <div className="px-4 py-2 text-sm font-bold text-center">{username}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-md px-4 py-2"
          onClick={() => router.push("/profile")}
        >
          <User className="mr-2 h-6 w-6 text-primary" size={32} />
            Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-md cursor-pointer flex items-center px-4 py-2">
          <LogOut className="mr-2 h-6 w-6 text-red-500" size={32} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarMenu;
