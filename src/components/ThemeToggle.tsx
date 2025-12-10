import { Moon, Sun, Sparkles, Gamepad2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun, color: "hsl(45, 100%, 60%)" },
  { value: "dark", label: "Dark", icon: Moon, color: "hsl(235, 70%, 50%)" },
  { value: "modern", label: "Modern", icon: Sparkles, color: "hsl(210, 25%, 92%)" },
  { value: "retro", label: "Retro", icon: Gamepad2, color: "hsl(120, 100%, 40%)" },
] as const;

interface RippleState {
  x: number;
  y: number;
  color: string;
  id: number;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = useCallback((newTheme: string, event: React.MouseEvent) => {
    const themeConfig = themes.find(t => t.value === newTheme);
    if (!themeConfig) return;

    // Get button position for ripple origin
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      rippleIdRef.current += 1;
      setRipple({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        color: themeConfig.color,
        id: rippleIdRef.current,
      });
    }

    // Add transition class before changing theme
    document.documentElement.classList.add('theme-transition');
    setTheme(newTheme);
    
    // Remove transition class and ripple after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 400);

    setTimeout(() => {
      setRipple(null);
    }, 600);
  }, [setTheme]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted border border-border">
        <div className="w-4 h-4" />
      </div>
    );
  }

  const currentTheme = themes.find(t => t.value === theme) ?? themes[1];
  const IconComponent = currentTheme.icon;

  return (
    <>
      {/* Full-screen ripple overlay */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.id}
            className="fixed inset-0 pointer-events-none z-[9999]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: ripple.color,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ width: 0, height: 0, opacity: 0.6 }}
              animate={{ 
                width: "300vmax", 
                height: "300vmax", 
                opacity: 0,
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            ref={buttonRef}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 border border-black/10 
                       hover:bg-black/10 transition-all duration-200 group"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              <IconComponent className="w-5 h-5" />
            </motion.div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {themes.map((t) => (
            <DropdownMenuItem
              key={t.value}
              onClick={(e) => handleThemeChange(t.value, e)}
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
    </>
  );
}