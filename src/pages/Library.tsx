import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Grid, List, Image, FileText, Download } from "lucide-react";

const Library = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Assets data with actual logo
  const assets = [
    { id: 1, name: "Primary Logo", type: "logo", tags: ["logo", "primary"], views: 245, downloads: 89, url: "/qatar-airways-logo.png" },
    { id: 2, name: "Hero Banner", type: "image", tags: ["banner", "hero"], views: 189, downloads: 45 },
    { id: 3, name: "Social Template", type: "template", tags: ["social", "template"], views: 156, downloads: 67 },
    { id: 4, name: "Brand Guidelines PDF", type: "document", tags: ["guidelines", "pdf"], views: 312, downloads: 124 },
    { id: 5, name: "Color Palette", type: "image", tags: ["color", "palette"], views: 198, downloads: 92 },
    { id: 6, name: "Typography Guide", type: "document", tags: ["typography", "guide"], views: 167, downloads: 54 },
  ];

  const handleDownload = (asset: typeof assets[0]) => {
    if (asset.url) {
      const link = document.createElement('a');
      link.href = asset.url;
      link.download = `${asset.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Asset Library</h1>
              <p className="text-muted-foreground">Digital asset management</p>
            </div>
            <Button className="bg-gradient-primary">
              <Upload className="mr-2 h-4 w-4" />
              Upload Asset
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets by name, tag, or type..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Grid/List */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              All Assets (6)
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              Logo
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              Images
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              Templates
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
              Documents
            </Badge>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Card
                key={asset.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video bg-white flex items-center justify-center p-8">
                  {asset.url ? (
                    <img 
                      src={asset.url} 
                      alt={asset.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : asset.type === "logo" || asset.type === "image" ? (
                    <Image className="h-16 w-16 text-primary/40" />
                  ) : (
                    <FileText className="h-16 w-16 text-primary/40" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{asset.name}</h3>
                  <div className="flex gap-2 mb-3">
                    {asset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-muted-foreground space-x-3">
                      <span>{asset.views} views</span>
                      <span>{asset.downloads} downloads</span>
                    </div>
                    {asset.url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(asset)}
                        className="gap-2"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset) => (
              <Card
                key={asset.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded bg-white flex items-center justify-center flex-shrink-0 p-2">
                    {asset.url ? (
                      <img 
                        src={asset.url} 
                        alt={asset.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : asset.type === "logo" || asset.type === "image" ? (
                      <Image className="h-8 w-8 text-primary/40" />
                    ) : (
                      <FileText className="h-8 w-8 text-primary/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{asset.name}</h3>
                    <div className="flex gap-2">
                      {asset.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground mr-4">
                    <div>{asset.views} views</div>
                    <div>{asset.downloads} downloads</div>
                  </div>
                  {asset.url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(asset)}
                      className="gap-2"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
