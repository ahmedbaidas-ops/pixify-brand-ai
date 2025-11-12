import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Box, Sparkles, Target, FileText } from "lucide-react";

interface Node {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  color: string;
  icon: typeof Palette;
  items?: string[];
}

const nodes: Node[] = [
  {
    id: "brand",
    label: "Qatar Airways",
    category: "Brand Core",
    x: 50,
    y: 50,
    color: "hsl(330 88% 20%)",
    icon: Sparkles,
    items: ["Premium airline", "Global reach", "Exceptional service"],
  },
  {
    id: "strategy",
    label: "Strategy",
    category: "Foundation",
    x: 20,
    y: 20,
    color: "hsl(330 70% 30%)",
    icon: Target,
    items: ["Caregiver/Explorer", "Warm & Premium", "Trustworthy"],
  },
  {
    id: "colors",
    label: "Colors",
    category: "Visual System",
    x: 80,
    y: 20,
    color: "hsl(330 88% 35%)",
    icon: Palette,
    items: ["Qatar Maroon #5C0A3A", "Sand #CBB59C", "Neutral #0F1020"],
  },
  {
    id: "typography",
    label: "Typography",
    category: "Visual System",
    x: 20,
    y: 80,
    color: "hsl(30 32% 70%)",
    icon: Type,
    items: ["Display: Cormorant Garamond", "UI: Inter", "Scale: 12-72px"],
  },
  {
    id: "components",
    label: "Components",
    category: "Design System",
    x: 80,
    y: 80,
    color: "hsl(30 40% 60%)",
    icon: Box,
    items: ["Buttons", "Cards", "Navigation", "Forms"],
  },
  {
    id: "guidelines",
    label: "Guidelines",
    category: "Documentation",
    x: 50,
    y: 15,
    color: "hsl(240 37% 20%)",
    icon: FileText,
    items: ["Logo usage", "Color rules", "Typography scale"],
  },
];

const connections = [
  { from: "brand", to: "strategy" },
  { from: "brand", to: "colors" },
  { from: "brand", to: "typography" },
  { from: "brand", to: "components" },
  { from: "brand", to: "guidelines" },
  { from: "strategy", to: "guidelines" },
  { from: "colors", to: "components" },
  { from: "typography", to: "components" },
];

const Mindmap = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const getNodePosition = (node: Node) => ({
    left: `${node.x}%`,
    top: `${node.y}%`,
  });

  const getConnectionPath = (from: Node, to: Node) => {
    const startX = (from.x / 100) * 1200;
    const startY = (from.y / 100) * 800;
    const endX = (to.x / 100) * 1200;
    const endY = (to.y / 100) * 800;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    return `M ${startX} ${startY} Q ${midX} ${midY}, ${endX} ${endY}`;
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3">Brand Mindmap</h1>
          <p className="text-xl text-muted-foreground">
            Interactive visualization of Qatar Airways brand system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mindmap Canvas */}
          <div className="lg:col-span-2">
            <Card className="relative h-[800px] overflow-hidden bg-card shadow-xl">
              {/* SVG Connections */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(330 88% 20%)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="hsl(330 88% 20%)" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                {connections.map((conn, idx) => {
                  const fromNode = nodes.find((n) => n.id === conn.from);
                  const toNode = nodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  const isHighlighted =
                    hoveredNode === conn.from || hoveredNode === conn.to;

                  return (
                    <path
                      key={idx}
                      d={getConnectionPath(fromNode, toNode)}
                      stroke="url(#lineGradient)"
                      strokeWidth={isHighlighted ? "3" : "2"}
                      fill="none"
                      className="transition-all duration-300"
                      style={{
                        opacity: isHighlighted ? 1 : 0.4,
                      }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              <div className="relative w-full h-full" style={{ zIndex: 2 }}>
                {nodes.map((node) => {
                  const Icon = node.icon;
                  const isHovered = hoveredNode === node.id;
                  const isSelected = selectedNode?.id === node.id;
                  const isCentral = node.id === "brand";

                  return (
                    <div
                      key={node.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={getNodePosition(node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* Node Circle */}
                      <div
                        className={`relative transition-all duration-300 ${
                          isCentral
                            ? "w-40 h-40"
                            : isHovered || isSelected
                            ? "w-32 h-32"
                            : "w-28 h-28"
                        }`}
                      >
                        <div
                          className={`w-full h-full rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                            isHovered || isSelected ? "shadow-xl scale-110" : ""
                          }`}
                          style={{
                            backgroundColor: node.color,
                          }}
                        >
                          <Icon
                            className={`text-white mb-2 ${
                              isCentral ? "h-12 w-12" : "h-8 w-8"
                            }`}
                          />
                          <span
                            className={`text-white font-bold text-center px-2 ${
                              isCentral ? "text-lg" : "text-sm"
                            }`}
                          >
                            {node.label}
                          </span>
                        </div>

                        {/* Pulse animation for central node */}
                        {isCentral && (
                          <div
                            className="absolute inset-0 rounded-full animate-pulse"
                            style={{
                              backgroundColor: node.color,
                              opacity: 0.3,
                              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                            }}
                          />
                        )}

                        {/* Category badge */}
                        {!isCentral && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <Badge
                              variant="secondary"
                              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {node.category}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instructions */}
              <div className="absolute bottom-6 left-6 z-10">
                <Card className="px-4 py-2 bg-background/80 backdrop-blur-sm border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    Click nodes to view details • Hover to highlight connections
                  </p>
                </Card>
              </div>
            </Card>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-[800px] overflow-y-auto shadow-xl">
              {selectedNode ? (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: selectedNode.color }}
                    >
                      {(() => {
                        const Icon = selectedNode.icon;
                        return <Icon className="h-10 w-10 text-white" />;
                      })()}
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{selectedNode.label}</h2>
                    <Badge>{selectedNode.category}</Badge>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      Key Elements
                    </h3>
                    {selectedNode.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* Connected Nodes */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      Connected To
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {connections
                        .filter(
                          (conn) =>
                            conn.from === selectedNode.id || conn.to === selectedNode.id
                        )
                        .map((conn, idx) => {
                          const connectedId =
                            conn.from === selectedNode.id ? conn.to : conn.from;
                          const connectedNode = nodes.find((n) => n.id === connectedId);
                          if (!connectedNode) return null;

                          return (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary/10 transition-colors"
                              onClick={() => handleNodeClick(connectedNode)}
                            >
                              {connectedNode.label}
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Explore the Brand System</h3>
                    <p className="text-muted-foreground">
                      Click any node to view detailed information about that element
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-bold mb-4">System Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nodes.map((node) => {
              const Icon = node.icon;
              return (
                <div key={node.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: node.color }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{node.label}</p>
                    <p className="text-xs text-muted-foreground">{node.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Mindmap;
