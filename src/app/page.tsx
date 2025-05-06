"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useLoginMutation } from "@/services/authApi";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/passwordInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/loader";

import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ username, password }).unwrap();

      if (response.status === "0103") {
        const usernameEncoded = encodeURIComponent(username);
        const textEncoded = encodeURIComponent(
          "Please check your inbox to verify your username first"
        );
        router.push(`/verification?username=${usernameEncoded}&text=${textEncoded}`);
        return;
      }

      Cookies.set("access_token", response.data.access_token);
      router.replace("/dashboard");
    } catch (err: any) {
      toast("Invalid credentials", {
        description: "Incorrect username or password",
      })
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-2">
      <Card className="w-full mx-5 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <CardTitle className="text-3xl font-bold">Postoria</CardTitle>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                placeholder="m@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : "Login"}
            </Button>
            <div className="text-center text-md">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;