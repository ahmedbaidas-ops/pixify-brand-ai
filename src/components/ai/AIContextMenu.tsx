import { ReactNode, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { 
  Sparkles, 
  Wand2, 
  ShieldCheck, 
  Lightbulb, 
  FileText, 
  Palette,
  Type,
  MessageSquare
} from "lucide-react";
import { useBrandBrain } from "@/hooks/useBrandBrain";
import { toast } from "sonner";

interface AIContextMenuProps {
  children: ReactNode;
  selectedText?: string;
  contentType?: "copy" | "design" | "asset" | "color" | "typography";
  onAIResult?: (result: string, action: string) => void;
}

const AIContextMenu = ({
  children,
  selectedText = "",
  contentType = "copy",
  onAIResult
}: AIContextMenuProps) => {
  const { ask, isLoading } = useBrandBrain();

  const handleAIAction = async (action: string, prompt: string) => {
    const result = await ask(prompt, action as any);
    if (result) {
      if (onAIResult) {
        onAIResult(result, action);
      } else {
        toast.success("AI response ready", {
          description: result.substring(0, 100) + "...",
          action: {
            label: "Copy",
            onClick: () => navigator.clipboard.writeText(result)
          }
        });
      }
    }
  };

  const getSelectedText = () => {
    if (selectedText) return selectedText;
    const selection = window.getSelection();
    return selection?.toString() || "";
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Actions
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <ContextMenuItem
              className="gap-2"
              onClick={() => handleAIAction("rewrite", getSelectedText())}
              disabled={isLoading}
            >
              <Wand2 className="h-4 w-4" />
              Rewrite in Brand Voice
            </ContextMenuItem>
            <ContextMenuItem
              className="gap-2"
              onClick={() => handleAIAction("check", getSelectedText())}
              disabled={isLoading}
            >
              <ShieldCheck className="h-4 w-4" />
              Check Compliance
            </ContextMenuItem>
            <ContextMenuItem
              className="gap-2"
              onClick={() => handleAIAction("suggest", `Improve this: ${getSelectedText()}`)}
              disabled={isLoading}
            >
              <Lightbulb className="h-4 w-4" />
              Suggest Improvements
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="gap-2"
              onClick={() => handleAIAction("explain", `Explain how this relates to brand guidelines: ${getSelectedText()}`)}
              disabled={isLoading}
            >
              <MessageSquare className="h-4 w-4" />
              Explain Brand Rule
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <FileText className="h-4 w-4" />
            Convert To
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              onClick={() => handleAIAction("convert", `Convert to headline: ${getSelectedText()}`)}
            >
              Headline
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAIAction("convert", `Convert to social caption: ${getSelectedText()}`)}
            >
              Social Caption
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAIAction("convert", `Convert to tagline: ${getSelectedText()}`)}
            >
              Tagline
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAIAction("convert", `Convert to email subject: ${getSelectedText()}`)}
            >
              Email Subject
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {contentType === "color" && (
          <ContextMenuItem
            className="gap-2"
            onClick={() => handleAIAction("explain", `Explain brand usage for this color: ${getSelectedText()}`)}
          >
            <Palette className="h-4 w-4" />
            Explain Color Usage
          </ContextMenuItem>
        )}

        {contentType === "typography" && (
          <ContextMenuItem
            className="gap-2"
            onClick={() => handleAIAction("explain", `Explain typography guidelines for: ${getSelectedText()}`)}
          >
            <Type className="h-4 w-4" />
            Explain Font Usage
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default AIContextMenu;
