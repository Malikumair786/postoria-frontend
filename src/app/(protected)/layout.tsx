"use client";
import { useState, useEffect } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/store/themeSlice";
import { RootState } from "@/store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarMenu from "@/components/avatarMenu";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [hydrated, setHydrated] = useState(false);
  const currentTheme: any = useSelector((state: RootState) => state.theme.currentTheme);
  const dispatch = useDispatch();

  const handleChange = (theme: "light" | "dark" | "system") => {
    dispatch(setTheme(theme));
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
        <h1 className="text-3xl font-bold tracking-widest text-center text-primary">POSTORIA</h1>
        <div className="flex gap-2 justify-end">
          <div className="mt-1 mr-1 md:mr-4 border-2 rounded-md border-primary">
            <Select
              value={currentTheme}
              onValueChange={(value: any) => handleChange(value as "light" | "dark" | "system")}
            >
              <SelectTrigger className="px-2">
                <SelectValue placeholder="Select Theme" className="flex items-center">
                  {hydrated &&
                    (currentTheme === "light" ? (
                      <Sun className="text-primary" />
                    ) : currentTheme === "dark" ? (
                      <Moon className="text-primary" />
                    ) : (
                      <SunMoon className="text-primary" />
                    ))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <Sun className={`${currentTheme === "light" ? "text-primary" : "text-foreground"}`} />
                </SelectItem>
                <SelectItem value="dark">
                  <Moon className={`${currentTheme === "dark" ? "text-primary" : "text-foreground"}`} />
                </SelectItem>
                <SelectItem value="system">
                  <SunMoon className={`${currentTheme === "system" ? "text-primary" : "text-foreground"}`} />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AvatarMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full py-1">{children}</main>

      <footer className="text-sm py-4 text-center border-t">
        &copy; {new Date().getFullYear()} Postoria. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardLayout;
