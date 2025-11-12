import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted border border-border">
        <div className="w-4 h-4" />
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border hover:bg-muted transition-all duration-200 group"
    >
      <div className="relative w-4 h-4">
        <Sun className={`absolute inset-0 w-4 h-4 text-foreground transition-all duration-200 ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`} />
        <Moon className={`absolute inset-0 w-4 h-4 text-foreground transition-all duration-200 ${
          theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`} />
      </div>
      <span className="text-sm font-medium">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
