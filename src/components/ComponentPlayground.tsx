import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type ComponentType = "button" | "badge" | "input" | "progress" | "card";

interface PlaygroundProps {
  componentType: ComponentType;
  onClose: () => void;
}

export const ComponentPlayground = ({ componentType, onClose }: PlaygroundProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Button props
  const [buttonVariant, setButtonVariant] = useState<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium">("default");
  const [buttonSize, setButtonSize] = useState<"default" | "sm" | "lg" | "icon">("default");
  const [buttonText, setButtonText] = useState("Click Me");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Badge props
  const [badgeVariant, setBadgeVariant] = useState<"default" | "secondary" | "destructive" | "outline">("default");
  const [badgeText, setBadgeText] = useState("Badge");

  // Input props
  const [inputPlaceholder, setInputPlaceholder] = useState("Enter text...");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputType, setInputType] = useState<"text" | "email" | "password" | "number">("text");

  // Progress props
  const [progressValue, setProgressValue] = useState([65]);

  // Card props
  const [cardTitle, setCardTitle] = useState("Card Title");
  const [cardDescription, setCardDescription] = useState("Card description goes here");
  const [cardContent, setCardContent] = useState("This is the card content area.");

  const generateCode = () => {
    switch (componentType) {
      case "button":
        return `<Button
  variant="${buttonVariant}"
  size="${buttonSize}"
  ${buttonDisabled ? 'disabled' : ''}
>
  ${buttonText}
</Button>`;

      case "badge":
        return `<Badge variant="${badgeVariant}">
  ${badgeText}
</Badge>`;

      case "input":
        return `<Input
  type="${inputType}"
  placeholder="${inputPlaceholder}"
  ${inputDisabled ? 'disabled' : ''}
/>`;

      case "progress":
        return `<Progress value={${progressValue[0]}} />`;

      case "card":
        return `<Card>
  <CardHeader>
    <CardTitle>${cardTitle}</CardTitle>
    <CardDescription>${cardDescription}</CardDescription>
  </CardHeader>
  <CardContent>
    ${cardContent}
  </CardContent>
</Card>`;

      default:
        return "";
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "Component code has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const renderComponent = () => {
    switch (componentType) {
      case "button":
        return (
          <Button
            variant={buttonVariant}
            size={buttonSize}
            disabled={buttonDisabled}
          >
            {buttonText}
          </Button>
        );

      case "badge":
        return <Badge variant={badgeVariant}>{badgeText}</Badge>;

      case "input":
        return (
          <Input
            type={inputType}
            placeholder={inputPlaceholder}
            disabled={inputDisabled}
            className="max-w-md"
          />
        );

      case "progress":
        return <Progress value={progressValue[0]} className="max-w-md" />;

      case "card":
        return (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>{cardTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">{cardDescription}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{cardContent}</p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderControls = () => {
    switch (componentType) {
      case "button":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Variant</Label>
              <Select value={buttonVariant} onValueChange={(value: any) => setButtonVariant(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={buttonSize} onValueChange={(value: any) => setButtonSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="icon">Icon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Disabled</Label>
              <Switch
                checked={buttonDisabled}
                onCheckedChange={setButtonDisabled}
              />
            </div>
          </div>
        );

      case "badge":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Variant</Label>
              <Select value={badgeVariant} onValueChange={(value: any) => setBadgeVariant(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "input":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input
                value={inputPlaceholder}
                onChange={(e) => setInputPlaceholder(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={inputType} onValueChange={(value: any) => setInputType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Disabled</Label>
              <Switch
                checked={inputDisabled}
                onCheckedChange={setInputDisabled}
              />
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Progress Value: {progressValue[0]}%</Label>
              <Slider
                value={progressValue}
                onValueChange={setProgressValue}
                max={100}
                step={1}
              />
            </div>
          </div>
        );

      case "card":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Input
                value={cardContent}
                onChange={(e) => setCardContent(e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border-2 border-primary/20">
        <CardHeader className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Component Playground: {componentType.charAt(0).toUpperCase() + componentType.slice(1)}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Customize props and see live updates
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Controls Panel */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  Controls
                </h3>
                <Card className="bg-muted/30">
                  <CardContent className="p-6">
                    {renderControls()}
                  </CardContent>
                </Card>
              </div>

              {/* Code Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Code
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCode}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Card className="bg-[#0F1020] border-border/50">
                  <CardContent className="p-6">
                    <pre className="text-sm text-green-400 overflow-x-auto">
                      <code>{generateCode()}</code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Live Preview
              </h3>
              <Card className="bg-gradient-to-br from-muted/30 via-background to-muted/20 min-h-[400px]">
                <CardContent className="p-12 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-3xl"></div>
                    <div className="relative">
                      {renderComponent()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Tips */}
              <Card className="mt-6 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold mb-2 text-primary">Usage Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Adjust props in real-time to see instant updates</li>
                    <li>• Copy the generated code to use in your project</li>
                    <li>• All components follow Qatar Airways design system</li>
                    <li>• Components are fully accessible and responsive</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
