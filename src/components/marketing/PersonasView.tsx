import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { personas } from "@/data/marketing";
import { Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const PersonasView = () => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audience Personas</h2>
          <p className="text-muted-foreground">AI-generated customer profiles for targeted campaigns</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate New Persona
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona, index) => (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ rotateY: flippedCard === persona.id ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => setFlippedCard(flippedCard === persona.id ? null : persona.id)}
              className="cursor-pointer"
            >
              {/* Front of card */}
              <Card 
                className="h-[500px] hover:shadow-xl transition-shadow"
                style={{ 
                  backfaceVisibility: "hidden",
                  transform: flippedCard === persona.id ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{persona.avatar}</div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardTitle className="text-2xl">{persona.name}</CardTitle>
                  <CardDescription>{persona.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Demographics</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Age: {persona.demographics.age}</div>
                      <div>Region: {persona.demographics.region}</div>
                      <div>Profession: {persona.demographics.profession}</div>
                      <div>Income: {persona.demographics.income}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Preferred Channels</h4>
                    <div className="flex flex-wrap gap-1">
                      {persona.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full gap-2 group">
                    Click to see tone & triggers
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Back of card */}
              {flippedCard === persona.id && (
                <Card 
                  className="h-[500px] absolute top-0 left-0 w-full hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/5 to-primary/10"
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">Tone & Triggers</CardTitle>
                    <CardDescription>Messaging guidance for {persona.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        Tone Words
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {persona.toneWords.map(word => (
                          <Badge key={word} className="bg-primary/20 text-primary hover:bg-primary/30">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Emotional Triggers</h4>
                      <div className="space-y-2">
                        {persona.emotionalTriggers.map(trigger => (
                          <div key={trigger} className="flex items-center gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                            {trigger}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold text-sm mb-2">Preferred CTA</h4>
                      <div className="p-3 rounded-lg bg-primary/10 text-primary font-medium text-center">
                        "{persona.preferredCTA}"
                      </div>
                    </div>

                    <Button variant="ghost" className="w-full gap-2">
                      Click to flip back
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PersonasView;
