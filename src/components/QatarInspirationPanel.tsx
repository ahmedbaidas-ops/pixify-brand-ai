import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import demoFeed from "@/data/qatar_demo_feed.json";

interface FeedItem {
  id: string;
  image: string;
  caption: string;
  platform: string;
  colors: string[];
  hashtags: string[];
}

export function QatarInspirationPanel() {
  const [activeTab, setActiveTab] = useState("ig");
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    // In production, this would fetch from /api/feeds/qatar?platform=${activeTab}
    // For now, use demo data
    setItems((demoFeed as any)[activeTab] || []);
  }, [activeTab]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Qatar Airways Inspiration</h3>
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="ig" className="flex-1">Instagram</TabsTrigger>
          <TabsTrigger value="li" className="flex-1">LinkedIn</TabsTrigger>
          <TabsTrigger value="yt" className="flex-1">YouTube</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
            >
              <img src={item.image} alt="" className="w-full h-32 object-cover" />
              <div className="p-3 space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{item.caption}</p>
                {item.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.hashtags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-1">
                  {item.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
