import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Settings2, GripVertical, Eye, EyeOff } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface DashboardSection {
  id: string;
  label: string;
  visible: boolean;
}

interface CustomizeViewProps {
  sections: DashboardSection[];
  onSectionsChange: (sections: DashboardSection[]) => void;
}

interface SortableItemProps {
  section: DashboardSection;
  onToggleVisibility: (id: string) => void;
}

const SortableItem = ({ section, onToggleVisibility }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2.5 rounded-lg bg-background hover:bg-muted/50 group"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
      </button>
      <span className={`flex-1 text-sm ${!section.visible ? 'text-muted-foreground' : ''}`}>
        {section.label}
      </span>
      <button
        onClick={() => onToggleVisibility(section.id)}
        className="p-1.5 rounded-md hover:bg-muted transition-colors"
      >
        {section.visible ? (
          <Eye className="h-4 w-4 text-primary" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export const CustomizeView = ({ sections, onSectionsChange }: CustomizeViewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleVisibility = (id: string) => {
    onSectionsChange(
      sections.map(section => 
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      onSectionsChange(arrayMove(sections, oldIndex, newIndex));
    }
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
            Drag to reorder, click eye to toggle
          </p>
        </div>
        
        <div className="p-2 space-y-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableItem
                  key={section.id}
                  section={section}
                  onToggleVisibility={toggleVisibility}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        
        <div className="p-3 border-t border-border space-y-2">
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
          <Button 
            size="sm" 
            className="w-full text-xs"
            onClick={() => setIsOpen(false)}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
