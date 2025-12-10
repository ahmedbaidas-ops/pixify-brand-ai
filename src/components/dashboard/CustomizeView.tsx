import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Settings2, GripVertical, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";

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

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    onSectionsChange(newSections);
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
            Toggle sections and use arrows to reorder
          </p>
        </div>
        
        <div className="p-2 space-y-1">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-background hover:bg-muted/50 group"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="h-3 w-3 text-muted-foreground" />
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
              <span className={`flex-1 text-sm ${!section.visible ? 'text-muted-foreground' : ''}`}>
                {section.label}
              </span>
              <button
                onClick={() => toggleVisibility(section.id)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                {section.visible ? (
                  <Eye className="h-4 w-4 text-primary" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          ))}
        </div>
        
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
