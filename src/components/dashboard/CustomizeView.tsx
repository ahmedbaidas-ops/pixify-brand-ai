import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Settings2, GripVertical, Eye, EyeOff } from "lucide-react";

export interface DashboardSection {
  id: string;
  label: string;
  visible: boolean;
}

interface CustomizeViewProps {
  sections: DashboardSection[];
  onSectionsChange: (sections: DashboardSection[]) => void;
}

export const CustomizeView = ({ sections, onSectionsChange }: CustomizeViewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVisibility = (id: string) => {
    onSectionsChange(
      sections.map(section => 
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-full shadow-lg hover:bg-foreground/90 transition-colors font-medium text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings2 className="h-4 w-4" />
          Customize View
        </motion.button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0 bg-popover border border-border shadow-xl" 
        align="end"
        sideOffset={12}
      >
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm">Customize Dashboard</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Toggle sections and drag to reorder
          </p>
        </div>
        
        <Reorder.Group 
          axis="y" 
          values={sections} 
          onReorder={onSectionsChange}
          className="p-2 space-y-1"
        >
          <AnimatePresence>
            {sections.map((section) => (
              <Reorder.Item
                key={section.id}
                value={section}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-background hover:bg-muted/50 cursor-grab active:cursor-grabbing group"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                <span className={`flex-1 text-sm ${!section.visible ? 'text-muted-foreground' : ''}`}>
                  {section.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(section.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  {section.visible ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        
        <div className="p-3 border-t border-border">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              onSectionsChange(sections.map(s => ({ ...s, visible: true })));
            }}
          >
            Show All Sections
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
