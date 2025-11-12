import { useMemo, useState } from "react";
import { competitors } from "@/data/competitors";
import { ExternalLink, Search, Filter, Download, Palette, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Competitors = () => {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<"All" | "Middle East" | "Global">("All");
  const [alliance, setAlliance] = useState<"All" | "oneworld" | "star" | "skyteam" | "none">("All");
  const [type, setType] = useState<"All" | "Full-service" | "LCC">("All");

  const filtered = useMemo(() => {
    return competitors.filter(c =>
      (region === "All" || c.region === region) &&
      (alliance === "All" || (c.alliance ?? "none") === alliance) &&
      (type === "All" || c.type === type) &&
      (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.hub.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, region, alliance, type]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Competitor Explorer</h1>
            <p className="text-lg text-muted-foreground">
              See how other airlines present and govern their brands
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or hub..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={region} onValueChange={(val) => setRegion(val as any)}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Region" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Regions</SelectItem>
              <SelectItem value="Middle East">Middle East</SelectItem>
              <SelectItem value="Global">Global</SelectItem>
            </SelectContent>
          </Select>

          <Select value={alliance} onValueChange={(val) => setAlliance(val as any)}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Alliance" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Alliances</SelectItem>
              <SelectItem value="oneworld">oneworld</SelectItem>
              <SelectItem value="star">Star Alliance</SelectItem>
              <SelectItem value="skyteam">SkyTeam</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={(val) => setType(val as any)}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Full-service">Full-service</SelectItem>
              <SelectItem value="LCC">Low-cost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {competitors.length} competitors
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <Card 
              key={c.name}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Accent ring on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                style={{ boxShadow: `inset 0 0 0 2px ${c.primaryColor ?? "rgba(92, 10, 58, 0.3)"}` }}
              />
              
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                    style={{ backgroundColor: c.primaryColor ?? "hsl(var(--muted))" }}
                  >
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-foreground">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.country} • Hub {c.hub}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{c.type}</Badge>
                  <Badge variant="outline">{c.alliance ?? "none"}</Badge>
                  <Badge variant="outline">{c.region}</Badge>
                </div>

                {/* Color swatch */}
                <div 
                  className="mt-4 h-3 w-full rounded-full shadow-inner transition-all duration-300"
                  style={{ backgroundColor: c.primaryColor ?? "hsl(var(--muted))" }}
                />
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="gap-2 flex-1"
                  >
                    <a href={c.brandUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Brand Site
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={c.mediaUrl ?? c.brandUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3.5 w-3.5" />
                      Media
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    title="Compare palette"
                  >
                    <Palette className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Notes */}
                {c.notes && (
                  <CardDescription className="text-xs leading-relaxed">
                    {c.notes}
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No competitors found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Competitors;
