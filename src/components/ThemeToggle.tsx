import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "modern", label: "Modern", icon: Sparkles },
] as const;

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

  const currentTheme = themes.find(t => t.value === theme) ?? themes[1]; // default to dark
  const IconComponent = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border 
                     hover:bg-muted transition-all duration-200 group w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Theme</span>
          </div>
          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-md">
            {currentTheme.label}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              theme === t.value && "bg-primary/10 text-primary"
            )}
          >
            {(() => {
              const Icon = t.icon;
              return <Icon className="w-4 h-4" />;
            })()}
            <span>{t.label}</span>
            {t.value === "modern" && (
              <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                New
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}