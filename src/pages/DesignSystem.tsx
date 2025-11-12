import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  LayoutGrid, 
  List, 
  ChevronDown,
  CircleUser,
  Bell,
  CreditCard,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Menu,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ComponentPlayground } from "@/components/ComponentPlayground";
import { Link } from "react-router-dom";

type ViewMode = "grid" | "list";
type ComponentType = "button" | "badge" | "input" | "progress" | "card";

const DesignSystem = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [openSections, setOpenSections] = useState<string[]>(["overview"]);
  const [playgroundComponent, setPlaygroundComponent] = useState<ComponentType | null>(null);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const components = [
    {
      name: "Button",
      category: "Actions",
      icon: <div className="w-24 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">Click Me</div>,
      description: "Primary action trigger for user interactions",
      hasPlayground: true,
      playgroundType: "button" as ComponentType
    },
    {
      name: "Card",
      category: "Containers",
      icon: <div className="w-24 h-20 bg-card border-2 border-border rounded-2xl p-3 shadow-md"><div className="h-2 bg-muted rounded mb-2"></div><div className="h-2 bg-muted rounded w-3/4"></div></div>,
      description: "Content container with elevation",
      hasPlayground: true,
      playgroundType: "card" as ComponentType
    },
    {
      name: "Badge",
      category: "Display",
      icon: <div className="flex gap-2"><Badge className="bg-primary">New</Badge><Badge variant="outline">Info</Badge></div>,
      description: "Status indicators and labels",
      hasPlayground: true,
      playgroundType: "badge" as ComponentType
    },
    {
      name: "Avatar",
      category: "Display",
      icon: <Avatar className="w-16 h-16"><AvatarFallback className="bg-primary text-white text-xl">QA</AvatarFallback></Avatar>,
      description: "User profile representation"
    },
    {
      name: "Input",
      category: "Forms",
      icon: <Input placeholder="Enter text..." className="w-full" />,
      description: "Text input field for user data",
      hasPlayground: true,
      playgroundType: "input" as ComponentType
    },
    {
      name: "Alert",
      category: "Feedback",
      icon: <div className="flex items-center gap-2 bg-primary/10 border-l-4 border-primary p-2 rounded"><AlertCircle className="w-5 h-5 text-primary" /><span className="text-xs">Alert message</span></div>,
      description: "Important notifications and messages"
    },
    {
      name: "Progress",
      category: "Feedback",
      icon: <Progress value={65} className="w-24" />,
      description: "Visual progress indicator",
      hasPlayground: true,
      playgroundType: "progress" as ComponentType
    },
    {
      name: "Switch",
      category: "Forms",
      icon: <Switch checked />,
      description: "Toggle between two states"
    },
    {
      name: "Checkbox",
      category: "Forms",
      icon: <div className="flex gap-2"><Checkbox checked /><Checkbox /></div>,
      description: "Multiple selection control"
    },
    {
      name: "Slider",
      category: "Forms",
      icon: <Slider defaultValue={[60]} max={100} className="w-24" />,
      description: "Range value selection"
    },
    {
      name: "Calendar",
      category: "Forms",
      icon: <div className="w-20 h-20 bg-card border-2 border-border rounded-lg flex flex-col items-center justify-center"><Calendar className="w-10 h-10 text-primary" /></div>,
      description: "Date selection component"
    },
    {
      name: "Dialog",
      category: "Overlays",
      icon: <div className="w-24 h-20 bg-background border-2 border-border rounded-lg shadow-2xl p-2"><div className="h-2 bg-muted rounded mb-1"></div><div className="h-2 bg-muted rounded w-2/3"></div></div>,
      description: "Modal dialog for focused interactions"
    },
  ];

  const sidebarSections = [
    { id: "overview", label: "Overview", hasSubmenu: false },
    { 
      id: "tokens", 
      label: "Tokens", 
      hasSubmenu: true,
      items: ["Colors", "Typography", "Spacing", "Shadows"]
    },
    { 
      id: "components", 
      label: "Components", 
      hasSubmenu: true,
      items: ["Actions", "Containers", "Display", "Forms", "Feedback", "Overlays"]
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card/30 backdrop-blur-sm fixed h-screen overflow-y-auto">
        {/* Breadcrumb at top of sidebar */}
        <div className="p-6 border-b border-border">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Design System</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Brand Identity */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-foreground font-bold text-lg">Qatar Airways</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mt-4">Design System</h2>
        </div>

        <nav className="p-4">
          {sidebarSections.map((section) => (
            section.hasSubmenu ? (
              <Collapsible
                key={section.id}
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg transition-colors group">
                  <span className="font-semibold text-foreground">{section.label}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    openSections.includes(section.id) && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-1">
                  {section.items?.map((item) => (
                    <button
                      key={item}
                      className="block w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <button
                key={section.id}
                className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <span className="font-semibold text-foreground">{section.label}</span>
              </button>
            )
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-foreground mb-4">Components overview</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Components are reusable pieces of code that serve as specific user interface elements or functions, 
            crafted with Qatar Airways brand excellence and attention to detail.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-8">
          <div className="inline-flex rounded-full border border-border bg-card shadow-sm">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-full",
                viewMode === "grid" && "bg-primary text-primary-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-full",
                viewMode === "list" && "bg-primary text-primary-foreground"
              )}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Components Grid/List */}
        <div className={cn(
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        )}>
          {components.map((component) => (
            <Card
              key={component.name}
              className={cn(
                "group cursor-pointer border-border/50 hover:border-primary transition-all duration-300 hover:shadow-premium overflow-hidden",
                viewMode === "list" && "flex-row"
              )}
            >
              <CardContent className={cn(
                "p-0",
                viewMode === "grid" ? "flex flex-col" : "flex flex-row items-center"
              )}>
                {/* Component Preview */}
                <div className={cn(
                  "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center relative overflow-hidden",
                  viewMode === "grid" ? "h-48 w-full" : "h-32 w-48 flex-shrink-0"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 scale-90 group-hover:scale-100 transition-transform duration-300">
                    {component.icon}
                  </div>
                </div>

                {/* Component Info */}
                <div className={cn(
                  "p-6",
                  viewMode === "list" && "flex-1"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {component.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {component.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {component.description}
                  </p>
                  
                  {component.hasPlayground && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-primary/50 hover:bg-primary/10 hover:border-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlaygroundComponent(component.playgroundType);
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Try it out
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Playground Modal */}
      {playgroundComponent && (
        <ComponentPlayground
          componentType={playgroundComponent}
          onClose={() => setPlaygroundComponent(null)}
        />
      )}
    </div>
  );
};

export default DesignSystem;
